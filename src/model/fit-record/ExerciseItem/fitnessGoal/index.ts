import mongoose, { Schema } from "mongoose";
import { FitnessGoal } from "./type";

// 训练目标Schema
const fitnessGoalSchema = new Schema<FitnessGoal>({
  name: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  isCustom: { type: Boolean, default: false },
  userId: { type: String },
  imageUrls: { type: [String], default: [] },
  order: { type: Number, required: true },
});

// 创建模型 - 防止热重载时重复定义模型
export const FitnessGoalModel =
  mongoose.models.FitnessGoal ||
  mongoose.model<FitnessGoal>("FitnessGoal", fitnessGoalSchema);
