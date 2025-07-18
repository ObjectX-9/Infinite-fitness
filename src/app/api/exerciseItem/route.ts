import { NextRequest } from "next/server";
import { ExerciseItemModel } from "@/model/fit-record/ExerciseItem";
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
interface ExerciseItemQuery {
  _id?: string;
  userId?: string;
  isCustom?: boolean;
  muscleTypeIds?: { $in: string[] };
  equipmentTypeId?: string;
  difficulty?: string;
  fitnessGoalsIds?: { $in: string[] };
  usageScenariosIds?: { $in: string[] };
  $or?: Array<{ name?: { $regex: string, $options: string } } | { description?: { $regex: string, $options: string } }>;
}

/**
 * 获取所有训练动作列表
 */
export const GET = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const apiParams = createApiParams(req);
    const page = apiParams.getNumber("page") ?? 1;
    const limit = apiParams.getNumber("limit") ?? 10;
    const keyword = apiParams.getString("keyword");
    // 处理数组参数，将逗号分隔的字符串转换为数组
    const muscleTypeIdsStr = apiParams.getString("muscleTypeIds");
    const muscleTypeIds = muscleTypeIdsStr ? muscleTypeIdsStr.split(',') : [];
    const equipmentTypeId = apiParams.getString("equipmentTypeId");
    const difficulty = apiParams.getString("difficulty");
    // 处理数组参数，将逗号分隔的字符串转换为数组
    const fitnessGoalsIdsStr = apiParams.getString("fitnessGoalsIds");
    const fitnessGoalsIds = fitnessGoalsIdsStr ? fitnessGoalsIdsStr.split(',') : [];
    // 处理数组参数，将逗号分隔的字符串转换为数组
    const usageScenariosIdsStr = apiParams.getString("usageScenariosIds");
    const usageScenariosIds = usageScenariosIdsStr ? usageScenariosIdsStr.split(',') : [];
    const skip = (page - 1) * limit;

    // 参数验证
    if (page < 1 || limit < 1) {
      throw ApiErrors.BAD_REQUEST("页码和每页数量必须为大于0的数字");
    }

    // 构建查询条件
    const query: ExerciseItemQuery = {};
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (muscleTypeIds && muscleTypeIds.length > 0) {
      query.muscleTypeIds = { $in: muscleTypeIds };
    }

    if (equipmentTypeId) {
      query.equipmentTypeId = equipmentTypeId;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (fitnessGoalsIds && fitnessGoalsIds.length > 0) {
      query.fitnessGoalsIds = { $in: fitnessGoalsIds };
    }

    if (usageScenariosIds && usageScenariosIds.length > 0) {
      query.usageScenariosIds = { $in: usageScenariosIds };
    }

    const exerciseItems = await ExerciseItemModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("查询成功，找到训练动作数:", exerciseItems.length);

    const total = await ExerciseItemModel.countDocuments(query);

    const paginationInfo = createPagination(page, limit, total);

    return paginatedResponse(
      exerciseItems,
      paginationInfo,
      "获取训练动作列表成功"
    );
  } catch (error) {
    console.error("获取训练动作列表出错:", error);
    throw error;
  }
});

/**
 * 创建训练动作
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  try {
    const exerciseItemData = await parseRequestBody(req);

    // 参数验证
    RequestValidator.validateRequired(exerciseItemData, [
      "name", 
      "description", 
      "muscleTypeIds", 
      "equipmentTypeId", 
      "difficulty", 
      "fitnessGoalsIds", 
      "usageScenariosIds"
    ]);

    // 设置创建和更新时间
    const now = new Date();
    exerciseItemData.createdAt = now;
    exerciseItemData.updatedAt = now;

    // 如果是自定义动作，需要设置isCustom为true
    if (userInfo?.userId) {
      exerciseItemData.isCustom = true;
      exerciseItemData.userId = userInfo.userId;
    }

    // 生成唯一ID
    exerciseItemData.id = new mongoose.Types.ObjectId().toString();

    const newExerciseItem = await ExerciseItemModel.create(exerciseItemData);

    return successResponse(newExerciseItem, "创建训练动作成功");
  } catch (error) {
    console.error("创建训练动作出错:", error);
    throw error;
  }
});

/**
 * 删除训练动作
 */
export const DELETE = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  const apiParams = createApiParams(req);
  const exerciseItemId = apiParams.getString("id");

  // 参数验证
  if (!exerciseItemId) {
    throw ApiErrors.BAD_REQUEST("缺少必要参数: id");
  }

  const userId = userInfo?.userId;
  const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能删除自己创建的自定义动作
  const query: ExerciseItemQuery = { _id: exerciseItemId };
  if (isAdmin) {
    // 管理员可以删除任意数据
  } else {
    query.userId = userId;
    query.isCustom = true;
  }

  const result = await ExerciseItemModel.deleteOne(query);

  if (result.deletedCount === 0) {
    throw ApiErrors.NOT_FOUND("未找到可删除的训练动作或无权限删除");
  }

  return successResponse({ success: true }, "删除训练动作成功");
});

/**
 * 更新训练动作
 */
export const PUT = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  const exerciseItemInfo = await parseRequestBody(req);

  RequestValidator.validateRequired(exerciseItemInfo, ["id"]);
  const { id } = exerciseItemInfo;

  const userId = userInfo?.userId;
  const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能更新自己创建的自定义动作或管理员可更新所有
  const query: ExerciseItemQuery = { _id: id };
  if (!isAdmin) {
    query.userId = userId;
    query.isCustom = true;
  }

  // 更新时间
  exerciseItemInfo.updatedAt = new Date();

  const exerciseItem = await ExerciseItemModel.findOneAndUpdate(
    query,
    { $set: exerciseItemInfo },
    { new: true }
  );

  if (!exerciseItem) {
    throw ApiErrors.NOT_FOUND("未找到可更新的训练动作或无权限更新");
  }

  return successResponse({ success: true, exerciseItem }, "更新训练动作成功");
}); 