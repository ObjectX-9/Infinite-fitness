import { NextRequest } from "next/server";
import { UserMembershipModel } from "@/model/user-member";
import {
  ApiErrors,
  unifiedInterfaceProcess,
  paginatedResponse,
  createPagination,
  createApiParams,
  successResponse,
} from "@/utils/api-helpers";

/**
 * 获取所有会员信息列表
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

    console.log("准备查询会员信息列表，参数:", { page, limit, skip, userId });

    // 构建查询条件
    const query = userId ? { userId } : {};

    const memberships = await UserMembershipModel.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);

    console.log("查询成功，找到会员记录数:", memberships.length);

    const total = await UserMembershipModel.countDocuments(query);

    const paginationInfo = createPagination(page, limit, total);

    return paginatedResponse(
      memberships,
      paginationInfo,
      "获取会员信息列表成功"
    );
  } catch (error) {
    console.error("获取会员信息列表出错:", error);
    throw error;
  }
});

/**
 * 创建会员信息
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { userId, level, startDate, endDate } = body;

    console.log("接收到的会员数据:", body);

    // 参数验证
    if (!userId || !level || !startDate || !endDate) {
      console.error("会员信息不完整:", { userId, level, startDate, endDate });
      throw ApiErrors.BAD_REQUEST("会员信息不完整");
    }

    // 检查用户是否已有会员信息
    const existingMembership = await UserMembershipModel.findOne({ userId });

    let membership;

    if (existingMembership) {
      // 更新现有会员信息
      membership = await UserMembershipModel.findOneAndUpdate(
        { userId },
        { level, startDate, endDate },
        { new: true }
      );
    } else {
      // 创建新会员信息
      membership = await UserMembershipModel.create({
        userId,
        level,
        startDate,
        endDate,
      });
    }

    return successResponse(membership, "会员信息保存成功");
  } catch (error) {
    console.error("创建会员信息出错:", error);
    throw error;
  }
});
