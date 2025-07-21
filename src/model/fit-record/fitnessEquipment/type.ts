/**
 * 器械类别
 */
export enum EquipmentCategory {
  // 力量训练
  STRENGTH = "strength",
  // 有氧训练
  CARDIO = "cardio",
  // 功能性训练
  FUNCTIONAL = "functional",
  // 康复训练
  REHABILITATION = "rehabilitation",
  // 拉伸辅助
  STRETCHING = "stretching",
  // 其他
  OTHER = "other",
}

/**
 * 健身器械接口
 */
export interface FitnessEquipment {
  /**
   * 唯一标识符
   */
  _id: string;

  /**
   * 器械名称
   */
  name: string;

  /**
   * 器械描述
   */
  description: string;

  /**
   * 器械图片链接数组
   */
  imageUrls: string[];

  /**
   * 器械视频链接数组
   */
  videoUrls: string[];

  /**
   * 器械类别
   */
  category: EquipmentCategory;

  /**
   * 主要锻炼肌群ID数组
   */
  targetMusclesIds: string[];

  /**
   * 适合的健身目标ID数组
   */
  fitnessGoalsIds: string[];

  /**
   * 使用场景ID数组
   */
  usageScenariosIds: string[];

  /**
   * 使用指南
   */
  usageInstructions: string[];

  /**
   * 安全提示
   */
  safetyTips: string[];

  /**
   * 推荐的训练动作ID列表
   */
  recommendedExercisesIds?: string[];

  /**
   * 替代器械ID列表
   */
  alternativesIds?: string[];

  /**
   * 特点和优势
   */
  featuresAndBenefits?: string[];

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 更新时间
   */
  updatedAt: Date;

  /**
   * 是否为自定义器械
   */
  isCustom?: boolean;

  /**
   * 创建用户ID
   */
  userId?: string;

  /**
   * 备注
   */
  notes?: string;

  /**
   * 排序
   */
  order: number;
}
// 器械库类型
export type EquipmentLibrary = Record<string, FitnessEquipment>;
