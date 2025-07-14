import {
  Exercise,
  TrainingDay,
  TrainingPlan,
  TrainingRecord,
  TrainingStatistics,
} from "./type";

// 模拟训练内容数据
export const mockExercises: Record<string, Exercise> = {
  benchPress: {
    id: "ex-001",
    name: "卧推",
    sets: 4,
    reps: 10,
    weight: 60,
    notes: "控制动作，保持稳定",
  },
  squat: {
    id: "ex-002",
    name: "深蹲",
    sets: 5,
    reps: 8,
    weight: 80,
    notes: "髋关节下沉，保持核心稳定",
  },
  deadlift: {
    id: "ex-003",
    name: "硬拉",
    sets: 3,
    reps: 6,
    weight: 100,
    notes: "保持背部平直",
  },
  pullUp: {
    id: "ex-004",
    name: "引体向上",
    sets: 3,
    reps: 8,
    notes: "全程控制动作",
  },
  pushUp: {
    id: "ex-005",
    name: "俯卧撑",
    sets: 4,
    reps: 15,
    notes: "胸部触地",
  },
  plank: {
    id: "ex-006",
    name: "平板支撑",
    sets: 3,
    reps: 1,
    duration: 60,
    notes: "保持核心稳定",
  },
  sitUp: {
    id: "ex-007",
    name: "仰卧起坐",
    sets: 3,
    reps: 20,
    notes: "控制动作，不要用力过猛",
  },
  run: {
    id: "ex-008",
    name: "跑步",
    sets: 1,
    reps: 1,
    duration: 30,
    notes: "保持匀速",
  },
};

// 模拟训练日数据
export const mockTrainingDays: TrainingDay[] = [
  {
    id: "day-001",
    name: "胸部训练日",
    dayOfWeek: 1, // 周一
    isRestDay: false,
    exercises: [
      mockExercises.benchPress,
      mockExercises.pushUp,
      mockExercises.sitUp,
    ],
    color: "#FF5733",
  },
  {
    id: "day-002",
    name: "腿部训练日",
    dayOfWeek: 3, // 周三
    isRestDay: false,
    exercises: [mockExercises.squat, mockExercises.deadlift],
    color: "#33FF57",
  },
  {
    id: "day-003",
    name: "背部训练日",
    dayOfWeek: 5, // 周五
    isRestDay: false,
    exercises: [mockExercises.pullUp, mockExercises.deadlift],
    color: "#3357FF",
  },
  {
    id: "day-004",
    name: "有氧训练日",
    dayOfWeek: 6, // 周六
    isRestDay: false,
    exercises: [mockExercises.run, mockExercises.plank],
    color: "#F3FF33",
  },
  {
    id: "day-005",
    name: "休息日",
    dayOfWeek: 0, // 周日
    isRestDay: true,
    exercises: [],
    color: "#CCCCCC",
  },
  {
    id: "day-006",
    name: "休息日",
    dayOfWeek: 2, // 周二
    isRestDay: true,
    exercises: [],
    color: "#CCCCCC",
  },
  {
    id: "day-007",
    name: "休息日",
    dayOfWeek: 4, // 周四
    isRestDay: true,
    exercises: [],
    color: "#CCCCCC",
  },
];

// 模拟训练计划数据
export const mockTrainingPlans: TrainingPlan[] = [
  {
    id: "plan-001",
    name: "增肌训练计划",
    description: "专注于提升肌肉体积和力量的训练计划",
    days: mockTrainingDays,
    startDate: new Date(2023, 0, 1), // 2023年1月1日
    active: true,
    createdAt: new Date(2022, 11, 25), // 2022年12月25日
    updatedAt: new Date(2023, 0, 1), // 2023年1月1日
  },
  {
    id: "plan-002",
    name: "减脂训练计划",
    description: "专注于燃烧脂肪和提高代谢的训练计划",
    days: [
      // 可以定制不同的训练日
      {
        id: "day-008",
        name: "有氧+核心训练",
        dayOfWeek: 1, // 周一
        isRestDay: false,
        exercises: [
          mockExercises.run,
          mockExercises.plank,
          mockExercises.sitUp,
        ],
        color: "#FF5733",
      },
      {
        id: "day-009",
        name: "全身力量训练",
        dayOfWeek: 3, // 周三
        isRestDay: false,
        exercises: [
          mockExercises.squat,
          mockExercises.benchPress,
          mockExercises.pullUp,
        ],
        color: "#33FF57",
      },
      {
        id: "day-010",
        name: "间歇训练",
        dayOfWeek: 5, // 周五
        isRestDay: false,
        exercises: [
          mockExercises.run,
          mockExercises.pushUp,
          mockExercises.sitUp,
        ],
        color: "#3357FF",
      },
      {
        id: "day-011",
        name: "休息日",
        dayOfWeek: 0, // 周日
        isRestDay: true,
        exercises: [],
        color: "#CCCCCC",
      },
      {
        id: "day-012",
        name: "休息日",
        dayOfWeek: 2, // 周二
        isRestDay: true,
        exercises: [],
        color: "#CCCCCC",
      },
      {
        id: "day-013",
        name: "休息日",
        dayOfWeek: 4, // 周四
        isRestDay: true,
        exercises: [],
        color: "#CCCCCC",
      },
      {
        id: "day-014",
        name: "休息日",
        dayOfWeek: 6, // 周六
        isRestDay: true,
        exercises: [],
        color: "#CCCCCC",
      },
    ],
    startDate: new Date(2023, 2, 1), // 2023年3月1日
    endDate: new Date(2023, 5, 1), // 2023年6月1日
    active: false,
    createdAt: new Date(2023, 1, 15), // 2023年2月15日
    updatedAt: new Date(2023, 2, 1), // 2023年3月1日
  },
];

// 模拟训练记录数据
export const mockTrainingRecords: TrainingRecord[] = [
  {
    id: "record-001",
    trainingPlanId: "plan-001",
    trainingDayId: "day-001",
    date: new Date(2023, 0, 2), // 2023年1月2日
    completedExercises: [
      {
        exerciseId: "ex-001", // 卧推
        sets: [
          {
            reps: 10,
            weight: 60,
            completed: true,
          },
          {
            reps: 10,
            weight: 60,
            completed: true,
          },
          {
            reps: 8,
            weight: 60,
            completed: true,
          },
          {
            reps: 6,
            weight: 60,
            completed: true,
          },
        ],
      },
      {
        exerciseId: "ex-005", // 俯卧撑
        sets: [
          {
            reps: 15,
            completed: true,
          },
          {
            reps: 15,
            completed: true,
          },
          {
            reps: 12,
            completed: true,
          },
          {
            reps: 10,
            completed: true,
          },
        ],
      },
    ],
    notes: "感觉良好，能量充沛",
    createdAt: new Date(2023, 0, 2, 19, 30), // 2023年1月2日 19:30
  },
  {
    id: "record-002",
    trainingPlanId: "plan-001",
    trainingDayId: "day-002",
    date: new Date(2023, 0, 4), // 2023年1月4日
    completedExercises: [
      {
        exerciseId: "ex-002", // 深蹲
        sets: [
          {
            reps: 8,
            weight: 80,
            completed: true,
          },
          {
            reps: 8,
            weight: 85,
            completed: true,
          },
          {
            reps: 6,
            weight: 85,
            completed: true,
          },
          {
            reps: 6,
            weight: 80,
            completed: true,
          },
          {
            reps: 5,
            weight: 80,
            completed: true,
          },
        ],
      },
      {
        exerciseId: "ex-003", // 硬拉
        sets: [
          {
            reps: 6,
            weight: 100,
            completed: true,
          },
          {
            reps: 6,
            weight: 100,
            completed: true,
          },
          {
            reps: 4,
            weight: 100,
            completed: false,
          },
        ],
      },
    ],
    notes: "腿部感到疲劳，硬拉最后一组未能完成",
    createdAt: new Date(2023, 0, 4, 18, 45), // 2023年1月4日 18:45
  },
];

// 模拟训练统计数据
export const mockTrainingStatistics: TrainingStatistics = {
  userId: "user-001",
  totalWorkouts: 15,
  totalExercises: 65,
  streak: 3, // 连续训练3天
  weeklyWorkouts: 4,
  mostFrequentExercise: "深蹲",
  averageWorkoutDuration: 68, // 平均68分钟
  progressByExercise: {
    "ex-001": {
      // 卧推
      exerciseId: "ex-001",
      exerciseName: "卧推",
      initialWeight: 50,
      currentWeight: 65,
      weightProgress: 30, // 提升30%
      initialReps: 8,
      currentReps: 10,
      repsProgress: 25, // 提升25%
    },
    "ex-002": {
      // 深蹲
      exerciseId: "ex-002",
      exerciseName: "深蹲",
      initialWeight: 60,
      currentWeight: 85,
      weightProgress: 41.67, // 提升约41.67%
      initialReps: 6,
      currentReps: 8,
      repsProgress: 33.33, // 提升约33.33%
    },
  },
  lastUpdated: new Date(2023, 0, 15), // 2023年1月15日
};

// 常用颜色列表，用于训练日的颜色
export const dayColors = [
  "#FF5733", // 红色
  "#33FF57", // 绿色
  "#3357FF", // 蓝色
  "#F3FF33", // 黄色
  "#FF33F3", // 粉色
  "#33FFF3", // 青色
  "#FF8C33", // 橙色
  "#CCCCCC", // 灰色(休息日)
];

// 常见训练类型
export const trainingTypes = [
  "胸部训练",
  "背部训练",
  "腿部训练",
  "肩部训练",
  "手臂训练",
  "核心训练",
  "有氧训练",
  "全身训练",
  "休息日",
];

// 获取当前激活的训练计划
export const getActiveTrainingPlan = (): TrainingPlan | undefined => {
  return mockTrainingPlans.find((plan) => plan.active);
};

// 获取特定日期的训练日
export const getTrainingDayForDate = (
  date: Date,
  plan?: TrainingPlan
): TrainingDay | undefined => {
  const activePlan = plan || getActiveTrainingPlan();
  if (!activePlan) return undefined;

  const dayOfWeek = date.getDay(); // 0-6，对应周日至周六
  return activePlan.days.find((day) => day.dayOfWeek === dayOfWeek);
};

// 获取特定日期的训练记录
export const getTrainingRecordForDate = (
  date: Date
): TrainingRecord | undefined => {
  const dateString = date.toDateString();
  return mockTrainingRecords.find(
    (record) => record.date.toDateString() === dateString
  );
};
