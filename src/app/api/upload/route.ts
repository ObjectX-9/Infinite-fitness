/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import OSS from "ali-oss";
import { v4 as uuidv4 } from "uuid";
import {
  ApiErrors,
  unifiedInterfaceProcess,
  successResponse,
  createApiParams,
} from "@/utils/api-helpers";

// 检查所有必需的环境变量
const requiredEnvVars = {
  region: process.env.OSS_REGION || process.env.NEXT_PUBLIC_OSS_REGION,
  accessKeyId:
    process.env.OSS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_ID,
  accessKeySecret:
    process.env.OSS_ACCESS_KEY_SECRET ||
    process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET || process.env.NEXT_PUBLIC_OSS_BUCKET,
};

// 验证环境变量
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error(
    `缺少必要的环境变量: ${missingEnvVars.join(", ")}`
  );
}

// 创建OSS客户端
const client = new OSS({
  region: requiredEnvVars.region!,
  accessKeyId: requiredEnvVars.accessKeyId!,
  accessKeySecret: requiredEnvVars.accessKeySecret!,
  bucket: requiredEnvVars.bucket!,
});

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
    const type = formData.get("type") as string || "common"; // 默认为 common 目录

    if (!file) {
      throw ApiErrors.BAD_REQUEST("未提供文件");
    }

    // 检查文件类型
    const allowedTypes = ["text/markdown", "text/plain", "image/"];
    const isAllowedType = allowedTypes.some(allowedType => 
      file.type.startsWith(allowedType) || file.name.endsWith(".md")
    );

    if (!isAllowedType) {
      throw ApiErrors.BAD_REQUEST("仅允许上传Markdown和图片文件");
    }

    // 获取文件扩展名
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension) {
      throw ApiErrors.BAD_REQUEST("无效的文件扩展名");
    }

    // 根据文件类型决定存储路径
    const basePath = file.type.startsWith("image/") ? "images" : "articles";
    const filename = `${basePath}/${type}/${uuidv4()}.${extension}`;

    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer());

    // 上传文件到OSS
    const result = await uploadWithRetry(client, filename, buffer);

    // 构建完整的URL
    const url = `https://${requiredEnvVars.bucket}.${requiredEnvVars.region}.aliyuncs.com/${filename}`;

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