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
  createUpdateFields,
} from "@/utils/api-helpers";
import mongoose from "mongoose";

/**
 * 定义查询条件接口
 */
interface BodyPartQuery {
  id?: string;
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
    const userId = apiParams.getString("userId");
    const isAdmin = apiParams.getBoolean("isAdmin");

    // 参数验证
    if (page < 1 || limit < 1) {
      throw ApiErrors.BAD_REQUEST("页码和每页数量必须为大于0的数字");
    }

    console.log("准备查询身体部位类型列表，参数:", {
      page,
      limit,
      skip,
      userId,
      isAdmin,
    });

    // 构建查询条件
    const query: BodyPartQuery = {};
    if (isAdmin) {
      // 管理员查询所有数据
      // 不设置任何过滤条件
    } else if (userId) {
      // 查询系统预设的和用户自定义的
      query.$or = [{ userId }, { isCustom: false }];
    } else {
      // 只查询系统预设的
      query.isCustom = false;
    }

    const bodyParts = await BodyPartTypeModel.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("查询成功，找到身体部位类型数:", bodyParts.length);

    const total = await BodyPartTypeModel.countDocuments(query);

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
export const POST = unifiedInterfaceProcess(async (req: NextRequest) => {
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

    const newBodyPart = new BodyPartTypeModel(bodyPartData);
    await newBodyPart.save();

    return successResponse(newBodyPart, "创建身体部位类型成功");
  } catch (error) {
    console.error("创建身体部位类型出错:", error);
    throw error;
  }
});

/**
 * 删除身体部位类型
 */
export const DELETE = unifiedInterfaceProcess(async (req: NextRequest) => {
  const apiParams = createApiParams(req);
  const bodyPartId = apiParams.getString("id");
  const userId = apiParams.getString("userId");

  // 参数验证
  if (!bodyPartId) {
    throw ApiErrors.BAD_REQUEST("缺少必要参数: id");
  }

  // 构建查询条件，确保只能删除自己创建的自定义部位
  const query: BodyPartQuery = { id: bodyPartId };
  if (userId) {
    query.userId = userId;
    query.isCustom = true;
  }

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
  const { id, userId } = bodyPartInfo;

  // 构建查询条件，确保只能更新自己创建的自定义部位或管理员可更新所有
  const query: BodyPartQuery = { id };
  if (userId) {
    query.userId = userId;
    query.isCustom = true;
  }

  // 更新时间
  bodyPartInfo.updatedAt = new Date();

  // 使用公用方法自动创建更新字段对象
  const updateFields = createUpdateFields(bodyPartInfo);

  const bodyPart = await BodyPartTypeModel.findOneAndUpdate(
    query,
    { $set: updateFields },
    { new: true }
  );

  if (!bodyPart) {
    throw ApiErrors.NOT_FOUND("未找到可更新的身体部位类型或无权限更新");
  }

  return successResponse({ success: true, bodyPart }, "更新身体部位类型成功");
});
