/**
 * 训练动作项，扩展了基础动作并添加训练组信息
 */
export interface PlanExerciseItem  {
  /**
   * 计划训练动作项的ID
   */
  id: string;

  /**
   * 关联的基础训练项目ID
   */
  exerciseItemId: string;

  /**
   * 训练日ID
   */
  trainingDayId: string;

  /**
   * 训练组信息
   */
  trainingSetsIds: string[]; // 训练组信息
  
  /**
   * 训练动作项的备注信息
   */
  notes?: string; // 备注信息

  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 结束时间
   */
  endTime?: string;

  /**
   * 创建时间
   */
  createdAt: string;

  /**
   * 更新时间
   */
  updatedAt: string;

  /**
   * 用户ID
   */
  userId?: string;
}

/**
 * 训练组接口
 * 定义一个训练动作的具体训练组信息
 */
export interface TrainingSet {
  /**
   * 训练组ID
   */
  id: string;
  
  /**
   * 所属训练动作项ID
   */
  planExerciseItemId: string;
  
  /**
   * 组号
   */
  setNumber: number;
  
  /**
   * 重量（kg）
   */
  weight?: number;
  
  /**
   * 次数
   */
  reps?: number;
  
  /**
   * 持续时间（秒）
   */
  duration?: number;
  
  /**
   * 距离（米）
   */
  distance?: number;
  
  /**
   * 是否已完成
   */
  isCompleted: boolean;
  
  /**
   * 创建时间
   */
  createdAt: string;
  
  /**
   * 更新时间
   */
  updatedAt: string;

  /**
   * 用户ID
   */
  userId?: string;
}