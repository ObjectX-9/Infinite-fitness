import { PaymentRecord } from "@/model/user-payment/type";
import { request } from "@/utils/request";

interface PaymentResponse {
  payment: PaymentRecord;
}

interface PaymentListResponse {
  items: PaymentRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class PaymentBusiness {
  /**
   * 创建支付记录
   */
  async createPayment(paymentData: {
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status?: "pending" | "completed" | "failed" | "refunded";
    duration: number;
  }): Promise<PaymentRecord> {
    const response = await request.post<PaymentResponse>("payments", {
      ...paymentData,
      status: paymentData.status || "pending",
    });
    return response.data.payment;
  }

  /**
   * 获取用户支付记录列表
   */
  async getUserPayments(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: "pending" | "completed" | "failed" | "refunded";
    } = {}
  ): Promise<PaymentListResponse> {
    const response = await request.get<PaymentListResponse>("payments", {
      ...options,
      userId,
    });
    return response.data;
  }

  /**
   * 获取所有支付记录列表（管理员使用）
   */
  async getAllPayments(
    options: {
      page?: number;
      limit?: number;
      status?: "pending" | "completed" | "failed" | "refunded";
      userId?: string;
    } = {}
  ): Promise<PaymentListResponse> {
    const response = await request.get<PaymentListResponse>(
      "payments",
      options
    );
    return response.data;
  }

  /**
   * 更新支付记录状态
   */
  async updatePaymentStatus(
    paymentId: string,
    status: "pending" | "completed" | "failed" | "refunded"
  ): Promise<PaymentRecord> {
    const response = await request.patch<PaymentResponse>(
      `payments/${paymentId}/status`,
      {
        status,
      }
    );
    return response.data.payment;
  }

  /**
   * 处理支付成功
   * 更新支付状态并延长会员期限
   */
  async processSuccessfulPayment(
    paymentId: string
  ): Promise<{ success: boolean }> {
    const response = await request.post<{ success: boolean }>(
      `payments/${paymentId}/success`,
      {}
    );
    return response.data;
  }

  /**
   * 查询指定时间范围内的付款记录（用于统计）
   */
  async getPaymentStats(options: {
    startDate: Date;
    endDate: Date;
    status?: "pending" | "completed" | "failed" | "refunded";
  }): Promise<{
    totalAmount: number;
    count: number;
    records: PaymentRecord[];
  }> {
    const response = await request.get<{
      totalAmount: number;
      count: number;
      records: PaymentRecord[];
    }>("payments/stats", options);
    return response.data;
  }

  /**
   * 获取单个支付记录详情
   */
  async getPaymentById(paymentId: string): Promise<PaymentRecord | null> {
    try {
      const response = await request.get<PaymentResponse>(
        `payments/${paymentId}`
      );
      return response.data.payment;
    } catch {
      return null;
    }
  }
}

export const paymentBusiness = new PaymentBusiness();
