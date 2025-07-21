import mongoose, { Schema } from "mongoose";
import { BaseExerciseItem, DifficultyLevel } from "./type";

/**
 * 创建ExerciseItem模式定义
 */
const exerciseItemSchema = new Schema<BaseExerciseItem>({
  // 基本信息
  name: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: false },
  imageUrls: { type: [String], required: false },

  // 分类信息
  muscleTypeIds: { type: [String], required: true },
  equipmentTypeId: { type: String, required: true },
  difficulty: {
    type: String,
    enum: Object.values(DifficultyLevel),
    required: true,
  },
  fitnessGoalsIds: { type: [String], required: true },
  usageScenariosIds: { type: [String], required: true },

  // 训练指导
  recommendedSets: { type: Number, required: false },
  recommendedReps: { type: String, required: false },
  recommendedWeight: { type: String, required: false },
  recommendedRestTime: { type: String, required: false },
  duration: { type: String, required: false },

  // 额外信息
  tips: { type: [String], required: false },
  commonMistakes: { type: [String], required: false },
  alternativeExerciseItemIds: { type: [String], required: false },
  caloriesBurned: { type: Number, required: false },

  // 自定义数据
  isCustom: { type: Boolean, default: false },
  userId: { type: String, required: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
}, {
  timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
});

/**
 * ExerciseItem模型
 */
export const ExerciseItemModel =
  mongoose.models.ExerciseItem ||
  mongoose.model<BaseExerciseItem>("ExerciseItem", exerciseItemSchema);