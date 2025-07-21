
export enum DifficultyLevel {
  /**
   * 简单
   */
  EASY = "easy",
  /**
   * 中等
   */
  MEDIUM = "medium",
  /**
   * 困难
   */
  HARD = "hard",
}

export interface BaseExerciseItem {
  // 基本信息
  _id: string; // 唯一标识符
  name: string; // 动作名称
  description: string; // 动作简介
  videoUrl?: string; // 动作实操视频链接
  imageUrls?: string[]; // 动作图片链接数组

  // 分类信息
  muscleTypeIds: string[]; // 肌肉类型ID数组
  equipmentTypeId: string; // 器械类型ID
  difficulty: DifficultyLevel; // 难度级别
  fitnessGoalsIds: string[]; // 适合的健身目标
  usageScenariosIds: string[]; // 使用场景

  // 训练指导
  recommendedSets?: number; // 推荐组数
  recommendedReps?: string; // 推荐次数(可能是范围，如"8-12")
  recommendedWeight?: string; // 推荐重量范围或描述
  recommendedRestTime?: string; // 推荐休息时间
  duration?: string; // 动作时长
  

  // 额外信息
  tips?: string[]; // 动作注意事项
  commonMistakes?: string[]; // 常见错误
  alternativeExerciseItemIds?: string[]; // 替代动作
  caloriesBurned?: number; // 估计卡路里消耗(每组)


  /**
   * 自定义数据
   */
  isCustom?: boolean;
  createdAt: Date; // 创建时间
  updatedAt?: Date; // 更新时间
  userId?: string; // 创建者ID
}




// 预设动作库类型
export type ExerciseLibrary = Record<string, BaseExerciseItem>;
