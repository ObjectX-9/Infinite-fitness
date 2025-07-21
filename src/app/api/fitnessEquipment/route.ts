import { NextRequest } from "next/server";
import { FitnessEquipmentModel } from "@/model/fit-record/fitnessEquipment";
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
interface FitnessEquipmentQuery {
  _id?: string;
  userId?: string;
  isCustom?: boolean;
  category?: string;
  targetMusclesIds?: { $in: string[] };
  fitnessGoalsIds?: { $in: string[] };
  usageScenariosIds?: { $in: string[] };
  $or?: Array<{ name?: { $regex: string, $options: string } } | { description?: { $regex: string, $options: string } }>;
}

/**
 * 获取所有健身器械列表
 */
export const GET = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const apiParams = createApiParams(req);
    const page = apiParams.getNumber("page") ?? 1;
    const limit = apiParams.getNumber("limit") ?? 10;
    const keyword = apiParams.getString("keyword");
    const category = apiParams.getString("category");
    const targetMuscleId = apiParams.getString("targetMuscleId");
    const fitnessGoalId = apiParams.getString("fitnessGoalId");
    const usageScenarioId = apiParams.getString("usageScenarioId");
    const skip = (page - 1) * limit;

    // 参数验证
    if (page < 1 || limit < 1) {
      throw ApiErrors.BAD_REQUEST("页码和每页数量必须为大于0的数字");
    }

    // 构建查询条件
    const query: FitnessEquipmentQuery = {};
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (targetMuscleId) {
      query.targetMusclesIds = { $in: [targetMuscleId] };
    }

    if (fitnessGoalId) {
      query.fitnessGoalsIds = { $in: [fitnessGoalId] };
    }

    if (usageScenarioId) {
      query.usageScenariosIds = { $in: [usageScenarioId] };
    }

    const fitnessEquipments = await FitnessEquipmentModel.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("查询成功，找到健身器械数:", fitnessEquipments.length);

    const total = await FitnessEquipmentModel.countDocuments(query);

    const paginationInfo = createPagination(page, limit, total);

    return paginatedResponse(
      fitnessEquipments,
      paginationInfo,
      "获取健身器械列表成功"
    );
  } catch (error) {
    console.error("获取健身器械列表出错:", error);
    throw error;
  }
});

/**
 * 创建健身器械
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  try {
    const fitnessEquipmentData = await parseRequestBody(req);

    // 参数验证
    RequestValidator.validateRequired(fitnessEquipmentData, ["name", "description", "category"]);

    // 设置创建和更新时间
    const now = new Date();
    fitnessEquipmentData.createdAt = now;
    fitnessEquipmentData.updatedAt = now;

    // 如果是自定义器械，需要设置isCustom为true
    if (fitnessEquipmentData.userId) {
      fitnessEquipmentData.isCustom = true;
    }

    // 生成唯一ID
    fitnessEquipmentData.id = new mongoose.Types.ObjectId().toString();

    // 设置排序值，如果没有提供
    if (fitnessEquipmentData.order === undefined) {
      // 获取当前最大order值并加1
      const maxOrderRecord = await FitnessEquipmentModel.findOne()
        .sort({ order: -1 })
        .limit(1);
      fitnessEquipmentData.order = maxOrderRecord ? maxOrderRecord.order + 1 : 1;
    }

    // 确保videoUrls存在
    if (!fitnessEquipmentData.videoUrls) {
      fitnessEquipmentData.videoUrls = [];
    }

    const saveFitnessEquipmentData = {
      ...fitnessEquipmentData,
      userId: userInfo?.userId,
    };

    const newFitnessEquipment = await FitnessEquipmentModel.create(saveFitnessEquipmentData);

    return successResponse(newFitnessEquipment, "创建健身器械成功");
  } catch (error) {
    console.error("创建健身器械出错:", error);
    throw error;
  }
});

/**
 * 删除健身器械
 */
export const DELETE = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  const apiParams = createApiParams(req);
  const fitnessEquipmentId = apiParams.getString("id");

  // 参数验证
  if (!fitnessEquipmentId) {
    throw ApiErrors.BAD_REQUEST("缺少必要参数: id");
  }

  const userId = userInfo?.userId;
  const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能删除自己创建的自定义器械
  const query: FitnessEquipmentQuery = { _id: fitnessEquipmentId };
  if (isAdmin) {
    // 管理员可以删除任意数据
  } else {
    query.userId = userId;
    query.isCustom = true;
  }

  const result = await FitnessEquipmentModel.deleteOne(query);

  if (result.deletedCount === 0) {
    throw ApiErrors.NOT_FOUND("未找到可删除的健身器械或无权限删除");
  }

  return successResponse({ success: true }, "删除健身器械成功");
});

/**
 * 更新健身器械
 */
export const PUT = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  try {
    const fitnessEquipmentInfo = await parseRequestBody(req);


    RequestValidator.validateRequired(fitnessEquipmentInfo, ["id"]);
    const { id } = fitnessEquipmentInfo;

    const userId = userInfo?.userId;
    const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

    // 构建查询条件，确保只能更新自己创建的自定义器械或管理员可更新所有
    const query: FitnessEquipmentQuery = { _id: id };
    if (!isAdmin) {
      query.userId = userId;
      query.isCustom = true;
    }

    // 更新时间
    fitnessEquipmentInfo.updatedAt = new Date();

    // 确保videoUrls存在
    if (!fitnessEquipmentInfo.videoUrls) {
      fitnessEquipmentInfo.videoUrls = [];
    }


    const fitnessEquipment = await FitnessEquipmentModel.findOneAndUpdate(
      query,
      { $set: fitnessEquipmentInfo },
      { new: true }
    );

    if (!fitnessEquipment) {
      throw ApiErrors.NOT_FOUND("未找到可更新的健身器械或无权限更新");
    }

    return successResponse({ success: true, fitnessEquipment }, "更新健身器械成功");
  } catch (error) {
    console.error("更新健身器械出错:", error);
    throw error;
  }
}); 