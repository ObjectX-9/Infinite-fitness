import { NextRequest } from "next/server";
import { BodyPartTypeModel } from "@/model/fit-record/BodyType/bodyPartType";
import {
  ApiErrors,
  unifiedInterfaceProcess,
  paginatedResponse,
  createPagination,
  createApiParams,
  successResponse,
  parseRequestBody,
  RequestValidator,
} from "@/utils/api-helpers";
import mongoose from "mongoose";
import { UserInfo } from "@/utils/withAuth";
import { MembershipLevel } from "@/model/user-member/type";

/**
 * 定义查询条件接口
 */
interface BodyPartQuery {
  _id?: string;
  userId?: string;
  isCustom?: boolean;
  $or?: Array<{ userId?: string } | { isCustom: boolean }>;
}

/**
 * 获取所有身体部位类型列表
 */
export const GET = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const apiParams = createApiParams(req);
    const page = apiParams.getNumber("page") ?? 1;
    const limit = apiParams.getNumber("limit") ?? 10;
    const skip = (page - 1) * limit;

    // 参数验证
    if (page < 1 || limit < 1) {
      throw ApiErrors.BAD_REQUEST("页码和每页数量必须为大于0的数字");
    }

    const bodyParts = await BodyPartTypeModel.find()
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("查询成功，找到身体部位类型数:", bodyParts.length);

    const total = await BodyPartTypeModel.countDocuments();

    const paginationInfo = createPagination(page, limit, total);

    return paginatedResponse(
      bodyParts,
      paginationInfo,
      "获取身体部位类型列表成功"
    );
  } catch (error) {
    console.error("获取身体部位类型列表出错:", error);
    throw error;
  }
});

/**
 * 创建身体部位类型
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest, useInfo: UserInfo | null) => {
  try {
    const bodyPartData = await parseRequestBody(req);

    // 参数验证
    RequestValidator.validateRequired(bodyPartData, ["name", "description"]);

    // 设置创建和更新时间
    const now = new Date();
    bodyPartData.createdAt = now;
    bodyPartData.updatedAt = now;

    // 如果是自定义部位，需要设置isCustom为true
    if (bodyPartData.userId) {
      bodyPartData.isCustom = true;
    }

    // 生成唯一ID
    bodyPartData.id = new mongoose.Types.ObjectId().toString();

    // 设置排序值，如果没有提供
    if (bodyPartData.order === undefined) {
      // 获取当前最大order值并加1
      const maxOrderRecord = await BodyPartTypeModel.findOne()
        .sort({ order: -1 })
        .limit(1);
      bodyPartData.order = maxOrderRecord ? maxOrderRecord.order + 1 : 1;
    }

    const saveBodyPartData = {
      ...bodyPartData,
      userId: useInfo?.userId,
    };

    const newBodyPart = await BodyPartTypeModel.create(saveBodyPartData);

    return successResponse(newBodyPart, "创建身体部位类型成功");
  } catch (error) {
    console.error("创建身体部位类型出错:", error);
    throw error;
  }
});

/**
 * 删除身体部位类型
 */
export const DELETE = unifiedInterfaceProcess(async (req: NextRequest, useInfo: UserInfo | null) => {
  const apiParams = createApiParams(req);
  const bodyPartId = apiParams.getString("id");

  // 参数验证
  if (!bodyPartId) {
    throw ApiErrors.BAD_REQUEST("缺少必要参数: id");
  }

  const userId = useInfo?.userId;
  const isAdmin = useInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能删除自己创建的自定义部位
  const query: BodyPartQuery = { _id: bodyPartId };
  if (isAdmin) {
    // 管理员可以删除任意数据
  } else {
    query.userId = userId;
    query.isCustom = true;
  }
  console.log('✅ ✅ ✅ ~  DELETE ~  query:', query);

  const result = await BodyPartTypeModel.deleteOne(query);

  if (result.deletedCount === 0) {
    throw ApiErrors.NOT_FOUND("未找到可删除的身体部位类型或无权限删除");
  }

  return successResponse({ success: true }, "删除身体部位类型成功");
});

/**
 * 更新身体部位类型
 */
export const PUT = unifiedInterfaceProcess(async (req: NextRequest) => {
  const bodyPartInfo = await parseRequestBody(req);

  RequestValidator.validateRequired(bodyPartInfo, ["id"]);
  const { id } = bodyPartInfo;

  // 构建查询条件，确保只能更新自己创建的自定义部位或管理员可更新所有
  const query: BodyPartQuery = { _id: id };

  // 更新时间
  bodyPartInfo.updatedAt = new Date();

  const bodyPart = await BodyPartTypeModel.findOneAndUpdate(
    query,
    { $set: bodyPartInfo },
    { new: true }
  );

  if (!bodyPart) {
    throw ApiErrors.NOT_FOUND("未找到可更新的身体部位类型或无权限更新");
  }

  return successResponse({ success: true, bodyPart }, "更新身体部位类型成功");
});
