import { NextRequest } from "next/server";
import { UserMembershipModel } from "@/model/user-member";
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

/**
 * 获取会员信息
 */
export const GET = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const apiParams = createApiParams(req);
    const page = apiParams.getNumber("page") ?? 1;
    const limit = apiParams.getNumber("limit") ?? 10;
    const skip = (page - 1) * limit;

    // 可选的用户ID过滤
    const userId = apiParams.getString("userId");

    // 参数验证
    if (page < 1 || limit < 1) {
      throw ApiErrors.BAD_REQUEST("页码和每页数量必须为大于0的数字");
    }

    // 构建查询条件
    const query = userId ? { userId } : {};

    // 查询数据
    const memberships = await UserMembershipModel.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserMembershipModel.countDocuments(query);

    const paginationInfo = createPagination(page, limit, total);

    // 如果是查询单个用户会员信息并且已找到，直接返回第一条记录
    if (userId && memberships.length > 0) {
      return successResponse(memberships[0], "获取会员信息成功");
    }

    return paginatedResponse(
      memberships,
      paginationInfo,
      "获取会员信息列表成功"
    );
  } catch (error) {
    console.error("获取会员信息出错:", error);
    throw error;
  }
});

/**
 * 创建会员信息
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const memberInfo = await parseRequestBody(req);

    RequestValidator.validateRequired(memberInfo, ["userId", "level", "startDate", "endDate"]);

    const { userId, level, startDate, endDate } = memberInfo;

    // 创建新会员信息
    const membership = await UserMembershipModel.create({
      userId,
      level,
      startDate,
      endDate,
    });

    return successResponse(membership, "会员信息保存成功");
  } catch (error) {
    console.error("创建会员信息出错:", error);
    throw error;
  }
});

/**
 * 更新会员信息
 */
export const PUT = unifiedInterfaceProcess(async (req: NextRequest) => {
  const memberInfo = await parseRequestBody(req);

  RequestValidator.validateRequired(memberInfo, ["userId", "level", "startDate", "endDate"]);

  const { userId, level, startDate, endDate } = memberInfo;
  
  const membership = await UserMembershipModel.findOneAndUpdate(
    { userId },
    { level, startDate, endDate },
    { new: true }
  );

  return successResponse(membership, "会员信息更新成功");
});

export const DELETE = unifiedInterfaceProcess(async (req: NextRequest) => {
  const apiParams = createApiParams(req);
  const userId = apiParams.getString("userId");

  await UserMembershipModel.deleteOne({ userId });

  return successResponse(null, "会员信息删除成功");
});