import mongoose, { Schema } from "mongoose";
import { MembershipLevel, UserMembership } from "./type";

// 会员信息Schema
const userMembershipSchema = new Schema<UserMembership>({
  userId: { type: String, required: true },
  level: {
    type: String,
    required: true,
    enum: Object.values(MembershipLevel),
    default: MembershipLevel.FREE,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

// 创建模型 - 防止热重载时重复定义模型
export const UserMembershipModel =
  mongoose.models.UserMembership ||
  mongoose.model<UserMembership>("UserMembership", userMembershipSchema);
