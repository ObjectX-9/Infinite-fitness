import mongoose, { Schema } from "mongoose";
import { PaymentRecord } from "./type";

// 支付记录Schema
const paymentRecordSchema = new Schema<PaymentRecord>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  createdAt: { type: Date, required: true, default: Date.now },
  duration: { type: Number, required: true },
});

// 创建模型 - 防止热重载时重复定义模型
export const PaymentRecordModel =
  mongoose.models.PaymentRecord ||
  mongoose.model<PaymentRecord>("PaymentRecord", paymentRecordSchema);
