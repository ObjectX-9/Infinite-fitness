/**
 * 训练目标
 */
export interface FitnessGoal {
  /**
   * 训练目标的唯一ID
   */
  _id: string;
  /**
   * 训练目标的名称
   */
  name: string;
  /**
   * 训练目标的描述
   */
  description: string;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
  /**
   * 图片URLs
   */
  imageUrls?: string[];
  /**
   * 是否为自定义目标
   */
  isCustom?: boolean;
  /**
   * 用户ID
   */
  userId?: string;
  /**
   * 排序
   */
  order: number;
}

/**
 * 训练目标分类枚举
 */
export enum EFitnessGoalCategory {
  /**
   * 增肌
   */
  MUSCLE_GAIN = "muscle_gain",
  /**
   * 减脂
   */
  FAT_LOSS = "fat_loss",
  /**
   * 塑形
   */
  BODY_SHAPING = "body_shaping",
  /**
   * 力量提升
   */
  STRENGTH = "strength",
  /**
   * 耐力提升
   */
  ENDURANCE = "endurance",
  /**
   * 灵活性提升
   */
  FLEXIBILITY = "flexibility",
}
