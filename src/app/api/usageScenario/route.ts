import { NextRequest } from "next/server";
import { UsageScenarioModel } from "@/model/fit-record/ExerciseItem/usageScenarios";
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
interface UsageScenarioQuery {
  _id?: string;
  userId?: string;
  isCustom?: boolean;
  $or?: Array<{ name?: { $regex: string, $options: string } } | { description?: { $regex: string, $options: string } }>;
}

/**
 * 获取所有使用场景列表
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
    const query: UsageScenarioQuery = {};
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const usageScenarios = await UsageScenarioModel.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("查询成功，找到使用场景数:", usageScenarios.length);

    const total = await UsageScenarioModel.countDocuments(query);

    const paginationInfo = createPagination(page, limit, total);

    return paginatedResponse(
      usageScenarios,
      paginationInfo,
      "获取使用场景列表成功"
    );
  } catch (error) {
    console.error("获取使用场景列表出错:", error);
    throw error;
  }
});

/**
 * 创建使用场景
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  try {
    const usageScenarioData = await parseRequestBody(req);

    // 参数验证
    RequestValidator.validateRequired(usageScenarioData, ["name", "description"]);

    // 设置创建和更新时间
    const now = new Date();
    usageScenarioData.createdAt = now;
    usageScenarioData.updatedAt = now;

    // 如果是自定义场景，需要设置isCustom为true
    if (usageScenarioData.userId) {
      usageScenarioData.isCustom = true;
    }

    // 生成唯一ID
    usageScenarioData.id = new mongoose.Types.ObjectId().toString();

    // 设置排序值，如果没有提供
    if (usageScenarioData.order === undefined) {
      // 获取当前最大order值并加1
      const maxOrderRecord = await UsageScenarioModel.findOne()
        .sort({ order: -1 })
        .limit(1);
      usageScenarioData.order = maxOrderRecord ? maxOrderRecord.order + 1 : 1;
    }

    const saveUsageScenarioData = {
      ...usageScenarioData,
      userId: userInfo?.userId,
    };

    const newUsageScenario = await UsageScenarioModel.create(saveUsageScenarioData);

    return successResponse(newUsageScenario, "创建使用场景成功");
  } catch (error) {
    console.error("创建使用场景出错:", error);
    throw error;
  }
});

/**
 * 删除使用场景
 */
export const DELETE = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  const apiParams = createApiParams(req);
  const usageScenarioId = apiParams.getString("id");

  // 参数验证
  if (!usageScenarioId) {
    throw ApiErrors.BAD_REQUEST("缺少必要参数: id");
  }

  const userId = userInfo?.userId;
  const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能删除自己创建的自定义场景
  const query: UsageScenarioQuery = { _id: usageScenarioId };
  if (isAdmin) {
    // 管理员可以删除任意数据
  } else {
    query.userId = userId;
    query.isCustom = true;
  }

  const result = await UsageScenarioModel.deleteOne(query);

  if (result.deletedCount === 0) {
    throw ApiErrors.NOT_FOUND("未找到可删除的使用场景或无权限删除");
  }

  return successResponse({ success: true }, "删除使用场景成功");
});

/**
 * 更新使用场景
 */
export const PUT = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  const usageScenarioInfo = await parseRequestBody(req);

  RequestValidator.validateRequired(usageScenarioInfo, ["id"]);
  const { id } = usageScenarioInfo;

  const userId = userInfo?.userId;
  const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能更新自己创建的自定义场景或管理员可更新所有
  const query: UsageScenarioQuery = { _id: id };
  if (!isAdmin) {
    query.userId = userId;
    query.isCustom = true;
  }

  // 更新时间
  usageScenarioInfo.updatedAt = new Date();

  const usageScenario = await UsageScenarioModel.findOneAndUpdate(
    query,
    { $set: usageScenarioInfo },
    { new: true }
  );

  if (!usageScenario) {
    throw ApiErrors.NOT_FOUND("未找到可更新的使用场景或无权限更新");
  }

  return successResponse({ success: true, usageScenario }, "更新使用场景成功");
}); 