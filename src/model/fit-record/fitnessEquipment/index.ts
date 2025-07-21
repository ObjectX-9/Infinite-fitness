import mongoose, { Schema } from "mongoose";
import { FitnessEquipment } from "./type";

// 健身器械Schema
const fitnessEquipmentSchema = new Schema<FitnessEquipment>({
  name: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  imageUrls: { type: [String], default: [] },
  videoUrls: { type: [String], default: [] },
  category: { type: String, required: true },
  targetMusclesIds: { type: [String], default: [] },
  fitnessGoalsIds: { type: [String], default: [] },
  usageInstructions: { type: [String], default: [] },
  safetyTips: { type: [String], default: [] },
  usageScenariosIds: { type: [String], default: [] },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  isCustom: { type: Boolean, default: false },
  userId: { type: String },
  order: { type: Number, required: true },
});

// 创建模型 - 防止热重载时重复定义模型
export const FitnessEquipmentModel =
  mongoose.models.FitnessEquipment ||
  mongoose.model<FitnessEquipment>("FitnessEquipment", fitnessEquipmentSchema);
