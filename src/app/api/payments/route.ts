import { NextRequest } from "next/server";
import { PaymentRecordModel } from "@/model/user-payment";
import {
  ApiErrors,
  unifiedInterfaceProcess,
  paginatedResponse,
  createPagination,
  createApiParams,
  successResponse,
} from "@/utils/api-helpers";

/**
 * 获取支付记录列表
 */
export const GET = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const apiParams = createApiParams(req);
    const page = apiParams.getNumber("page") ?? 1;
    const limit = apiParams.getNumber("limit") ?? 10;
    const skip = (page - 1) * limit;

    // 可选的用户ID过滤
    const userId = apiParams.getString("userId");
    // 可选的支付状态过滤
    const status = apiParams.getString("status");

    // 参数验证
    if (page < 1 || limit < 1) {
      throw ApiErrors.BAD_REQUEST("页码和每页数量必须为大于0的数字");
    }

    console.log("准备查询支付记录列表，参数:", {
      page,
      limit,
      skip,
      userId,
      status,
    });

    // 构建查询条件
    const query: Record<string, string> = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;

    const payments = await PaymentRecordModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("查询成功，找到支付记录数:", payments.length);

    const total = await PaymentRecordModel.countDocuments(query);

    const paginationInfo = createPagination(page, limit, total);

    return paginatedResponse(payments, paginationInfo, "获取支付记录列表成功");
  } catch (error) {
    console.error("获取支付记录列表出错:", error);
    throw error;
  }
});

/**
 * 创建支付记录
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { userId, amount, currency, paymentMethod, status, duration } = body;

    // 参数验证
    if (!userId || !amount || !currency || !paymentMethod || !duration) {
      throw ApiErrors.BAD_REQUEST("支付信息不完整");
    }

    // 创建新支付记录
    const payment = await PaymentRecordModel.create({
      userId,
      amount,
      currency,
      paymentMethod,
      status: status || "pending",
      createdAt: new Date(),
      duration,
    });

    return successResponse(payment, "支付记录创建成功");
  } catch (error) {
    console.error("创建支付记录出错:", error);
    throw error;
  }
});
