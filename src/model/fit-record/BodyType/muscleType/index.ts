import mongoose, { Schema } from "mongoose";
import { MuscleType } from "./type";

// 肌肉类型Schema
const muscleTypeSchema = new Schema<MuscleType>({
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
  videoUrls: { type: [String], default: [] },
  order: { type: Number, required: true },
  bodyPartId: { type: String },
});

// 创建模型 - 防止热重载时重复定义模型
export const MuscleTypeModel =
  mongoose.models.MuscleType ||
  mongoose.model<MuscleType>("MuscleType", muscleTypeSchema);
