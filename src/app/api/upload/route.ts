import { NextRequest } from "next/server";
import OSS from "ali-oss";
import { v4 as uuidv4 } from "uuid";
import {
  ApiErrors,
  unifiedInterfaceProcess,
  successResponse,
  createApiParams,
} from "@/utils/api-helpers";

/**
 * 初始化OSS客户端
 * @returns OSS实例或null(如果配置不完整)
 */
let ossClientInstance: OSS | null = null;

const initOss = (): OSS | null => {
  // 如果已经初始化过，直接返回缓存的实例
  if (ossClientInstance) {
    return ossClientInstance;
  }

  const requiredEnvVars = [
    { key: "region", value: process.env.OSS_REGION },
    { key: "accessKeyId", value: process.env.OSS_ACCESS_KEY_ID },
    { key: "accessKeySecret", value: process.env.OSS_ACCESS_KEY_SECRET },
    { key: "bucket", value: process.env.OSS_BUCKET },
  ];

  // 检查环境变量
  const missingVars = requiredEnvVars
    .filter((item) => !item.value)
    .map((item) => item.key);

  if (missingVars.length > 0) {
    console.error(
      `初始化OSS失败：缺少必要的环境变量 [${missingVars.join(", ")}]`
    );
    return null;
  }

  try {
    ossClientInstance = new OSS({
      region: process.env.OSS_REGION!,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
      bucket: process.env.OSS_BUCKET!,
    });
    return ossClientInstance;
  } catch (error) {
    console.error("初始化OSS客户端失败:", error);
    return null;
  }
};

const client = initOss();

if (!client) {
  throw new Error("OSS 客户端初始化失败");
}

// 重试配置
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1秒
  maxDelay: 5000, // 5秒
};

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 带重试的上传函数
 * @param client OSS客户端
 * @param filename 文件名
 * @param buffer 文件内容
 * @param attempt 当前尝试次数
 * @returns 上传结果
 */
async function uploadWithRetry(
  client: OSS,
  filename: string,
  buffer: Buffer,
  attempt: number = 1
): Promise<OSS.PutObjectResult> {
  try {
    return await client.put(filename, buffer);
  } catch (err) {
    if (attempt >= RETRY_CONFIG.maxRetries) {
      throw err;
    }

    const delayTime = Math.min(
      RETRY_CONFIG.initialDelay * Math.pow(2, attempt - 1),
      RETRY_CONFIG.maxDelay
    );
    await delay(delayTime);

    return uploadWithRetry(client, filename, buffer, attempt + 1);
  }
}

/**
 * 上传文件接口
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const customPath = formData.get("path") as string;
    const fileTypeCheck = formData.get("fileTypeCheck") as string;

    if (!file) {
      throw ApiErrors.BAD_REQUEST("未提供文件");
    }

    if (!customPath) {
      throw ApiErrors.BAD_REQUEST("未提供文件路径");
    }

    // 如果需要检查文件类型
    if (fileTypeCheck) {
      const allowedTypes = fileTypeCheck.split(",");
      const isAllowedType = allowedTypes.some(
        (allowedType) =>
          file.type.startsWith(allowedType.trim()) ||
          file.name.toLowerCase().endsWith(`.${allowedType.trim()}`)
      );

      if (!isAllowedType) {
        throw ApiErrors.BAD_REQUEST(`文件类型不允许，仅支持: ${fileTypeCheck}`);
      }
    }

    // 获取文件扩展名
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension) {
      throw ApiErrors.BAD_REQUEST("无效的文件扩展名");
    }

    // 清理路径并构建文件名
    const cleanPath = customPath.replace(/^\/+|\/+$/g, ""); // 移除开头和结尾的斜杠
    const filename = `${cleanPath}/${uuidv4()}.${extension}`;

    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer());

    await uploadWithRetry(client, filename, buffer);

    // 构建完整的URL
    const url = `https://${process.env.OSS_BUCKET}.${process.env.OSS_REGION}.aliyuncs.com/${filename}`;

    return successResponse({ url, filename }, "文件上传成功");
  } catch (error) {
    console.error("上传错误:", error);
    throw error; // 统一接口处理函数会捕获并格式化这个错误
  }
});

/**
 * 删除文件接口
 */
export const DELETE = unifiedInterfaceProcess(async (req: NextRequest) => {
  const apiParams = createApiParams(req);
  const filename = apiParams.getRequiredString("filename");

  try {
    await client.delete(filename);
    return successResponse({ success: true }, "文件删除成功");
  } catch (error) {
    console.error("删除文件错误:", error);
    throw error;
  }
});
