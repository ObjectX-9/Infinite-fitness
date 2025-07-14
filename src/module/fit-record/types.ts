// 训练计划相关类型定义
export interface Exercise {
  name: string;
  sets: number;
  repsRange: string;
  rest?: string;
}

export interface Schedule {
  day?: number;
  focus: string;
  exercises: Exercise[];
}

export interface TrainingPlan {
  id: number;
  name: string;
  duration: string;
  targetMuscles: string[];
  schedule: Schedule[];
  progressRate: string;
  completionPercentage: number;
}
