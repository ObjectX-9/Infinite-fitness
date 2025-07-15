/**
 * 支付记录接口
 */
export interface PaymentRecord {
  userId: string; // 用户ID
  amount: number; // 支付金额
  currency: string; // 货币单位
  paymentMethod: string; // 支付方式
  status: "pending" | "completed" | "failed" | "refunded"; // 支付状态
  createdAt: Date; // 创建时间
  duration: number; // 购买时长(月)
}
