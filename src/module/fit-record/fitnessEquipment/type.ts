// 健身器械类型定义

import {
  MuscleGroup as ImportedMuscleGroup,
  FitnessGoal,
} from "../ExerciseItem/type";

// 重新导出需要的类型
export type MuscleGroup = ImportedMuscleGroup;

// 器械类别
export type EquipmentCategory =
  | "力量训练"
  | "有氧训练"
  | "功能性训练"
  | "自由重量"
  | "固定器械"
  | "康复训练"
  | "拉伸辅助"
  | "家用器械";

// 器械尺寸范围
export type SizeRange = "小型" | "中型" | "大型" | "超大型";

// 价格范围
export type PriceRange = "低价" | "中价" | "高价" | "专业级";

// 使用场景
export type UsageScenario = "健身房" | "家庭" | "户外" | "办公室" | "旅行";

// 健身器械接口
export interface FitnessEquipment {
  // 基本信息
  id: string; // 唯一标识符
  name: string; // 器械名称
  description: string; // 器械描述
  imageUrls: string[]; // 器械图片链接数组
  brand?: string; // 品牌
  model?: string; // 型号

  // 分类信息
  category: EquipmentCategory; // 器械类别
  targetMuscles: MuscleGroup[]; // 主要锻炼肌群
  fitnessGoals: FitnessGoal[]; // 适合的健身目标

  // 物理特性
  size?: SizeRange; // 器械尺寸范围
  weight?: number; // 器械重量(kg)
  dimensions?: {
    // 尺寸（厘米）
    length: number;
    width: number;
    height: number;
  };

  // 使用信息
  usageInstructions: string[]; // 使用指南
  safetyTips: string[]; // 安全提示
  maintenanceTips?: string[]; // 维护建议
  usageScenarios: UsageScenario[]; // 使用场景

  // 购买信息
  priceRange?: PriceRange; // 价格范围
  purchaseLink?: string; // 购买链接

  // 相关信息
  recommendedExercises?: string[]; // 推荐的训练动作ID列表
  alternatives?: string[]; // 替代器械
  featuresAndBenefits?: string[]; // 特点和优势

  // 用户信息
  userRating?: number; // 用户评分(1-5)
  userNotes?: string; // 用户笔记
  purchaseDate?: Date; // 购买日期(如果是用户自己的器械)
  isFavorite?: boolean; // 是否收藏
}

// 器械库类型
export type EquipmentLibrary = Record<string, FitnessEquipment>;
