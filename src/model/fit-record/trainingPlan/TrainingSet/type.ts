/**
 * 单个项目的基本信息
 */
export interface BaseSet {
  id: string;
  weight?: number; // 重量（公斤/千克）
  reps?: number;   // 次数
  restTime?: number; // 休息时间（秒）
  isPaused?: boolean; // 是否暂停
  isCompleted?: boolean; // 是否完成
  startTime?: string; // 开始时间
  endTime?: string; // 结束时间

  /**
   * 自定义数据
   */
  isCustom?: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  notes?: string;
}

/**
 * 训练组的类型
 */
export enum SetType {
  /**
   * 常规组
   */
  NORMAL = 'normal',
  /**
   * 递减组
   */
  DROP_SET = 'drop-set',
  /**
   * 金字塔递增组
   */
  PYRAMID_UP = 'pyramid-up',
  /**
   * 金字塔递减组
   */
  PYRAMID_DOWN = 'pyramid-down',
  /**
   * 全金字塔组
   */
  PYRAMID_FULL = 'pyramid-full', // 先递增后递减
  /**
   * 超级组
   */
  SUPER_SET = 'super-set',
  /**
   * 自定义组
   */
  CUSTOM = 'custom',
}

/**
 * 训练组结构
 */
export interface TrainingSet {
  id: string;
  type: SetType;
  sets: BaseSet[];
  notes?: string;
  muscleTypeIds?: string[]; // 肌肉类型ID数组
  fitnessGoalId?: string; // 健身目标ID
  exerciseItemId?: string; // 训练动作ID
  usageScenariosIds?: string[]; // 使用场景ID数组
  equipmentTypeId?: string; // 器械类型ID
}

/**
 * 常规组
 */
export interface NormalSet extends TrainingSet {
  type: SetType.NORMAL;
}


/**
 * 递减组（重量逐渐减少）
 */
export interface DropSet extends TrainingSet {
  type: SetType.DROP_SET;
}

/**
 * 金字塔递增组（重量逐渐增加）
 */
export interface PyramidUpSet extends TrainingSet {
  type: SetType.PYRAMID_UP;
}

/**
 * 金字塔递减组（重量逐渐减少）
 */
export interface PyramidDownSet extends TrainingSet {
  type: SetType.PYRAMID_DOWN;
}

/**
 * 全金字塔组（先递增后递减）
 */
export interface FullPyramidSet extends TrainingSet {
  type: SetType.PYRAMID_FULL;
}

/**
 * 超级组（多个动作连续进行）
 */
export interface SuperSet {
  id: string;
  type: SetType.SUPER_SET;
  exerciseSequence: Array<{
    exerciseId: string;
    trainingSetId: string[];
  }>;
}
