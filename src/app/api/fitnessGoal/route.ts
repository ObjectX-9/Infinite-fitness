import { NextRequest } from "next/server";
import { FitnessGoalModel } from "@/model/fit-record/ExerciseItem/fitnessGoal";
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
interface FitnessGoalQuery {
  _id?: string;
  userId?: string;
  isCustom?: boolean;
  $or?: Array<{ name?: { $regex: string, $options: string } } | { description?: { $regex: string, $options: string } }>;
}

/**
 * 获取所有训练目标列表
 */
export const GET = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const apiParams = createApiParams(req);
    const page = apiParams.getNumber("page") ?? 1;
    const limit = apiParams.getNumber("limit") ?? 10;
    const keyword = apiParams.getString("keyword");
    const skip = (page - 1) * limit;

    // 参数验证
    if (page < 1 || limit < 1) {
      throw ApiErrors.BAD_REQUEST("页码和每页数量必须为大于0的数字");
    }

    // 构建查询条件
    const query: FitnessGoalQuery = {};
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const fitnessGoals = await FitnessGoalModel.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("查询成功，找到训练目标数:", fitnessGoals.length);

    const total = await FitnessGoalModel.countDocuments(query);

    const paginationInfo = createPagination(page, limit, total);

    return paginatedResponse(
      fitnessGoals,
      paginationInfo,
      "获取训练目标列表成功"
    );
  } catch (error) {
    console.error("获取训练目标列表出错:", error);
    throw error;
  }
});

/**
 * 创建训练目标
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  try {
    const fitnessGoalData = await parseRequestBody(req);

    // 参数验证
    RequestValidator.validateRequired(fitnessGoalData, ["name", "description"]);

    // 设置创建和更新时间
    const now = new Date();
    fitnessGoalData.createdAt = now;
    fitnessGoalData.updatedAt = now;

    // 如果是自定义目标，需要设置isCustom为true
    if (fitnessGoalData.userId) {
      fitnessGoalData.isCustom = true;
    }

    // 生成唯一ID
    fitnessGoalData.id = new mongoose.Types.ObjectId().toString();

    // 设置排序值，如果没有提供
    if (fitnessGoalData.order === undefined) {
      // 获取当前最大order值并加1
      const maxOrderRecord = await FitnessGoalModel.findOne()
        .sort({ order: -1 })
        .limit(1);
      fitnessGoalData.order = maxOrderRecord ? maxOrderRecord.order + 1 : 1;
    }

    const saveFitnessGoalData = {
      ...fitnessGoalData,
      userId: userInfo?.userId,
    };

    const newFitnessGoal = await FitnessGoalModel.create(saveFitnessGoalData);

    return successResponse(newFitnessGoal, "创建训练目标成功");
  } catch (error) {
    console.error("创建训练目标出错:", error);
    throw error;
  }
});

/**
 * 删除训练目标
 */
export const DELETE = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  const apiParams = createApiParams(req);
  const fitnessGoalId = apiParams.getString("id");

  // 参数验证
  if (!fitnessGoalId) {
    throw ApiErrors.BAD_REQUEST("缺少必要参数: id");
  }

  const userId = userInfo?.userId;
  const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能删除自己创建的自定义目标
  const query: FitnessGoalQuery = { _id: fitnessGoalId };
  if (isAdmin) {
    // 管理员可以删除任意数据
  } else {
    query.userId = userId;
    query.isCustom = true;
  }

  const result = await FitnessGoalModel.deleteOne(query);

  if (result.deletedCount === 0) {
    throw ApiErrors.NOT_FOUND("未找到可删除的训练目标或无权限删除");
  }

  return successResponse({ success: true }, "删除训练目标成功");
});

/**
 * 更新训练目标
 */
export const PUT = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  const fitnessGoalInfo = await parseRequestBody(req);

  RequestValidator.validateRequired(fitnessGoalInfo, ["id"]);
  const { id } = fitnessGoalInfo;

  const userId = userInfo?.userId;
  const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能更新自己创建的自定义目标或管理员可更新所有
  const query: FitnessGoalQuery = { _id: id };
  if (!isAdmin) {
    query.userId = userId;
    query.isCustom = true;
  }

  // 更新时间
  fitnessGoalInfo.updatedAt = new Date();

  const fitnessGoal = await FitnessGoalModel.findOneAndUpdate(
    query,
    { $set: fitnessGoalInfo },
    { new: true }
  );

  if (!fitnessGoal) {
    throw ApiErrors.NOT_FOUND("未找到可更新的训练目标或无权限更新");
  }

  return successResponse({ success: true, fitnessGoal }, "更新训练目标成功");
}); 