/**
 * 训练内容接口
 * 定义单个训练动作的属性
 */
export interface Exercise {
  id: string;
  name: string; // 训练名称，如"卧推"、"深蹲"等
  sets: number; // 组数
  reps: number; // 每组次数
  weight?: number; // 可选，重量(kg)
  duration?: number; // 可选，时长(分钟)
  notes?: string; // 备注信息
}

/**
 * 训练日接口
 * 定义一周中每一天的训练安排
 */
export interface TrainingDay {
  id: string;
  name: string; // 如"胸部日"、"腿部日"、"休息日"
  dayOfWeek: number; // 0-6，对应周日至周六
  isRestDay: boolean; // 是否为休息日
  exercises: Exercise[]; // 训练日的训练内容，休息日为空数组
  color?: string; // 可选，用于UI展示的颜色
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

/**
 * 训练记录接口
 * 记录用户完成的训练内容
 */
export interface TrainingRecord {
  id: string;
  trainingPlanId: string; // 关联的训练计划ID
  trainingDayId: string; // 关联的训练日ID
  date: Date; // 完成训练的日期
  completedExercises: CompletedExercise[]; // 已完成的训练内容
  notes?: string; // 训练记录备注
  createdAt: Date;
}

/**
 * 已完成的训练内容
 * 记录用户实际完成的训练，可能与计划有所不同
 */
export interface CompletedExercise {
  exerciseId: string; // 关联的训练内容ID
  sets: CompletedSet[]; // 实际完成的组数和详情
}

/**
 * 已完成的训练组
 * 记录每组训练的实际完成情况
 */
export interface CompletedSet {
  reps: number; // 实际完成的次数
  weight?: number; // 实际使用的重量
  duration?: number; // 实际花费的时间
  completed: boolean; // 是否完成
}

/**
 * 训练统计接口
 * 统计用户的训练数据
 */
export interface TrainingStatistics {
  userId: string;
  totalWorkouts: number; // 总训练次数
  totalExercises: number; // 总训练动作数
  streak: number; // 连续训练天数
  weeklyWorkouts: number; // 每周训练次数
  mostFrequentExercise: string; // 最常训练的动作
  averageWorkoutDuration: number; // 平均训练时长(分钟)
  progressByExercise: Record<string, ExerciseProgress>; // 按训练动作的进步记录
  lastUpdated: Date; // 最后更新时间
}

/**
 * 训练动作进步记录
 */
export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  initialWeight?: number; // 初始重量
  currentWeight?: number; // 当前重量
  weightProgress?: number; // 重量提升百分比
  initialReps?: number; // 初始次数
  currentReps?: number; // 当前次数
  repsProgress?: number; // 次数提升百分比
}
