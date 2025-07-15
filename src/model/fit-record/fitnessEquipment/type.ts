
// 器械类别
export type EquipmentCategory =
  // 力量训练
  | "strength"
  // 有氧训练
  | "cardio"
  // 功能性训练
  | "functional"
  // 康复训练
  | "rehabilitation"
  // 拉伸辅助
  | "stretching"
  // 其他
  | "other";

// 健身器械接口
export interface FitnessEquipment {
  // 基本信息
  id: string; // 唯一标识符
  name: string; // 器械名称
  description: string; // 器械描述
  imageUrls: string[]; // 器械图片链接数组

  // 分类信息
  category: EquipmentCategory; // 器械类别
  targetMusclesIds: string[]; // 主要锻炼肌群
  fitnessGoalsIds: string[]; // 适合的健身目标

  // 使用信息
  usageInstructions: string[]; // 使用指南
  safetyTips: string[]; // 安全提示
  usageScenariosIds: string[]; // 使用场景


  // 相关信息
  recommendedExercisesIds?: string[]; // 推荐的训练动作ID列表
  alternativesIds?: string[]; // 替代器械
  featuresAndBenefits?: string[]; // 特点和优势

  // 自定义数据
  createdAt: string;
  updatedAt: string;
  isCustom?: boolean;
  userId?: string;
  notes?: string;
}
// 器械库类型
export type EquipmentLibrary = Record<string, FitnessEquipment>;

