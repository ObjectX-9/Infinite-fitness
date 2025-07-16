import mongoose, { Schema } from "mongoose";
import { BodyPartType, EBodyPartTypeCategory } from "./type";

// 身体部位类型Schema
const bodyPartTypeSchema = new Schema<BodyPartType>(
  {
    id: { type: String, required: true, unique: true },
    name: { 
      type: String, 
      required: true,
      enum: Object.values(EBodyPartTypeCategory)
    },
    description: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    isCustom: { type: Boolean, default: false },
    userId: { type: String },
    imageUrls: { type: [String], default: [] },
    order: { type: Number, required: true }
  },
);

// 创建模型 - 防止热重载时重复定义模型
export const BodyPartTypeModel = mongoose.models.BodyPartType || mongoose.model<BodyPartType>('BodyPartType', bodyPartTypeSchema);
