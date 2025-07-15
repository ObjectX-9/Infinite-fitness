/**
 * 训练日接口
 * 定义一周中每一天的训练安排
 */
export interface TrainingDay {
  /**
   * 训练日ID
   */
  id: string;

  /**
   * 是否为休息日
   */
  isRestDay: boolean; // 是否为休息日

  /**
   * 训练计划ID
   */
  planItemId: string; // 训练计划ID
  
  /**
   * 训练时间[周一至周日]
   */
  planTime: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'; // 训练时间

  /**
   * 创建时间
   */
  createdAt: Date;
  
  /**
   * 更新时间
   */
  updatedAt: Date;

  /**
   * 用户ID
   */
  userId?: string;
}

/**
 * 训练计划接口
 * 定义一个完整的训练计划，包含一周七天的安排
 */
export interface TrainingPlan {
  id: string;
  name: string; // 计划名称，如"增肌计划"、"减脂计划"
  description?: string; // 计划描述
  days: TrainingDay[]; // 包含7个训练日，对应周一到周日
  startDate: Date; // 计划开始日期
  endDate?: Date; // 可选，计划结束日期，不设置表示无限期
  active: boolean; // 是否为当前激活的计划
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}





