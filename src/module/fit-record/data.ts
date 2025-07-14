// 健身时间线数据
import { TrainingPlan } from "./types";

export const timelineData = [
  {
    id: 1,
    date: "2024-09-02",
    type: "photo",
    content: {
      imageUrl: "https://placehold.co/300x400",
      caption: "今日状态不错，继续保持！",
    },
  },
  {
    id: 2,
    date: "2024-09-02",
    type: "workout",
    content: {
      workoutName: "胸肩臂训练",
      duration: 65, // 分钟
      exercises: [
        { name: "卧推", sets: 4, reps: "10,8,8,6", weight: "60,65,70,70" },
        { name: "肩推", sets: 4, reps: "12,10,10,8", weight: "40,45,45,50" },
        { name: "绳索下拉", sets: 3, reps: "15,12,12", weight: "25,30,30" },
      ],
      feeling: "great", // great, good, normal, tired, exhausted
      points: 120, // 打卡奖励积分
    },
  },
  {
    id: 3,
    date: "2024-09-01",
    type: "recovery",
    content: {
      sleepHours: 7.5,
      fatigue: "low", // none, low, medium, high
      soreMuscles: ["胸", "肱三头肌"],
      notes: "今天休息日，肌肉恢复良好",
    },
  },
  {
    id: 4,
    date: "2024-08-31",
    type: "workout",
    content: {
      workoutName: "腿部训练",
      duration: 75,
      exercises: [
        {
          name: "深蹲",
          sets: 5,
          reps: "10,8,8,6,6",
          weight: "80,90,100,100,100",
        },
        {
          name: "腿举",
          sets: 4,
          reps: "12,12,10,10",
          weight: "120,140,150,150",
        },
        { name: "腿弯举", sets: 3, reps: "12,12,10", weight: "50,55,60" },
      ],
      feeling: "tired",
      points: 135,
    },
  },
];

// 增长记录数据
export const growthData = {
  bodyMeasurements: [
    { date: "2024-06-01", chest: 95, waist: 80, hip: 98, thigh: 58, arm: 35 },
    { date: "2024-07-01", chest: 97, waist: 79, hip: 99, thigh: 59, arm: 36 },
    { date: "2024-08-01", chest: 98, waist: 78, hip: 99, thigh: 60, arm: 37 },
    { date: "2024-09-01", chest: 99, waist: 77, hip: 100, thigh: 61, arm: 38 },
  ],
  strengthProgress: [
    { date: "2024-06-01", benchPress: 70, squat: 100, deadlift: 120 },
    { date: "2024-07-01", benchPress: 75, squat: 110, deadlift: 130 },
    { date: "2024-08-01", benchPress: 80, squat: 120, deadlift: 140 },
    { date: "2024-09-01", benchPress: 85, squat: 130, deadlift: 150 },
  ],
  bodyComposition: [
    { date: "2024-06-01", weight: 75, bodyFat: 18, muscleMass: 58 },
    { date: "2024-07-01", weight: 76, bodyFat: 17, muscleMass: 59.5 },
    { date: "2024-08-01", weight: 77, bodyFat: 16, muscleMass: 61 },
    { date: "2024-09-01", weight: 78, bodyFat: 15, muscleMass: 62.5 },
  ],
};

// 训练计划数据
export const trainingPlans: TrainingPlan[] = [
  {
    id: 1,
    name: "增肌计划 - 中级",
    duration: "8周",
    targetMuscles: ["胸", "背", "腿", "肩", "手臂"],
    schedule: [
      {
        day: 1,
        focus: "胸/肱三头肌",
        exercises: [
          { name: "平板卧推", sets: 4, repsRange: "8-10", rest: "90秒" },
          { name: "上斜卧推", sets: 3, repsRange: "10-12", rest: "90秒" },
          { name: "飞鸟", sets: 3, repsRange: "12-15", rest: "60秒" },
          { name: "绳索下拉", sets: 4, repsRange: "10-12", rest: "60秒" },
          { name: "颈后臂屈伸", sets: 3, repsRange: "10-12", rest: "60秒" },
        ],
      },
      {
        day: 2,
        focus: "背/肱二头肌",
        exercises: [
          { name: "引体向上", sets: 4, repsRange: "最大次数", rest: "120秒" },
          { name: "坐姿划船", sets: 4, repsRange: "10-12", rest: "90秒" },
          { name: "俯身划船", sets: 3, repsRange: "8-10", rest: "90秒" },
          { name: "哑铃弯举", sets: 3, repsRange: "10-12", rest: "60秒" },
          { name: "锤式卷曲", sets: 3, repsRange: "12-15", rest: "60秒" },
        ],
      },
      {
        day: 3,
        focus: "休息",
        exercises: [],
      },
      {
        day: 4,
        focus: "腿/核心",
        exercises: [
          { name: "杠铃深蹲", sets: 5, repsRange: "6-8", rest: "120秒" },
          { name: "腿举", sets: 4, repsRange: "10-12", rest: "90秒" },
          { name: "腿弯举", sets: 3, repsRange: "10-12", rest: "90秒" },
          { name: "小腿提踵", sets: 4, repsRange: "15-20", rest: "60秒" },
          { name: "悬垂抬腿", sets: 3, repsRange: "12-15", rest: "60秒" },
          { name: "平板支撑", sets: 3, repsRange: "30-60秒", rest: "60秒" },
        ],
      },
      {
        day: 5,
        focus: "肩/手臂",
        exercises: [
          { name: "肩上推举", sets: 4, repsRange: "8-10", rest: "90秒" },
          { name: "侧平举", sets: 3, repsRange: "10-12", rest: "60秒" },
          { name: "前平举", sets: 3, repsRange: "10-12", rest: "60秒" },
          { name: "绳索面拉", sets: 3, repsRange: "12-15", rest: "60秒" },
          { name: "窄握卧推", sets: 3, repsRange: "8-10", rest: "90秒" },
          { name: "杠铃弯举", sets: 3, repsRange: "8-10", rest: "60秒" },
        ],
      },
      {
        day: 6,
        focus: "全身/核心",
        exercises: [
          { name: "硬拉", sets: 4, repsRange: "6-8", rest: "120秒" },
          { name: "推举", sets: 3, repsRange: "8-10", rest: "90秒" },
          { name: "引体向上", sets: 3, repsRange: "最大次数", rest: "90秒" },
          { name: "俯卧撑", sets: 3, repsRange: "最大次数", rest: "90秒" },
          { name: "仰卧卷腹", sets: 3, repsRange: "15-20", rest: "60秒" },
          { name: "俄罗斯转体", sets: 3, repsRange: "20-30", rest: "60秒" },
        ],
      },
      {
        day: 7,
        focus: "休息",
        exercises: [],
      },
    ],
    progressRate: "每周增加5%负重",
    completionPercentage: 65,
  },
  {
    id: 2,
    name: "减脂计划 - 中级",
    duration: "6周",
    targetMuscles: ["全身", "核心"],
    schedule: [
      {
        day: 1,
        focus: "HIIT训练",
        exercises: [
          {
            name: "30秒冲刺/30秒休息",
            sets: 10,
            repsRange: "-",
            rest: "完成后休息2分钟",
          },
          { name: "跳跃深蹲", sets: 3, repsRange: "20次", rest: "30秒" },
          { name: "波比跳", sets: 3, repsRange: "15次", rest: "30秒" },
          { name: "登山者", sets: 3, repsRange: "20次/每侧", rest: "30秒" },
          { name: "俯卧撑", sets: 3, repsRange: "最大次数", rest: "30秒" },
        ],
      },
      {
        day: 2,
        focus: "上肢+有氧",
        exercises: [
          {
            name: "超级组：俯卧撑+引体向上",
            sets: 4,
            repsRange: "最大次数",
            rest: "60秒",
          },
          {
            name: "超级组：肩上推举+侧平举",
            sets: 3,
            repsRange: "12-15",
            rest: "60秒",
          },
          {
            name: "超级组：窄握俯卧撑+哑铃弯举",
            sets: 3,
            repsRange: "12-15",
            rest: "60秒",
          },
          {
            name: "有氧训练(跑步/单车/椭圆机)",
            sets: 1,
            repsRange: "20-30分钟",
            rest: "-",
          },
        ],
      },
      {
        day: 3,
        focus: "核心+有氧",
        exercises: [
          { name: "平板支撑", sets: 3, repsRange: "60秒", rest: "30秒" },
          { name: "侧平板支撑", sets: 3, repsRange: "30秒/每侧", rest: "30秒" },
          { name: "仰卧卷腹", sets: 3, repsRange: "20次", rest: "30秒" },
          { name: "俄罗斯转体", sets: 3, repsRange: "20次", rest: "30秒" },
          {
            name: "有氧训练(跑步/单车/椭圆机)",
            sets: 1,
            repsRange: "30分钟",
            rest: "-",
          },
        ],
      },
      {
        day: 4,
        focus: "休息/轻度活动",
        exercises: [
          { name: "步行", sets: 1, repsRange: "30-45分钟", rest: "-" },
          { name: "拉伸", sets: 1, repsRange: "15-20分钟", rest: "-" },
        ],
      },
      {
        day: 5,
        focus: "下肢+有氧",
        exercises: [
          {
            name: "超级组：深蹲+箭步蹲",
            sets: 4,
            repsRange: "15次",
            rest: "60秒",
          },
          {
            name: "超级组：腿弯举+小腿提踵",
            sets: 3,
            repsRange: "15次",
            rest: "60秒",
          },
          {
            name: "超级组：箱式跳+深蹲跳",
            sets: 3,
            repsRange: "10次",
            rest: "60秒",
          },
          {
            name: "有氧训练(跑步/单车/椭圆机)",
            sets: 1,
            repsRange: "20-30分钟",
            rest: "-",
          },
        ],
      },
      {
        day: 6,
        focus: "全身循环训练",
        exercises: [
          {
            name: "循环：深蹲",
            sets: 3,
            repsRange: "15次",
            rest: "仅在完成整个循环后",
          },
          {
            name: "循环：俯卧撑",
            sets: 3,
            repsRange: "12次",
            rest: "仅在完成整个循环后",
          },
          {
            name: "循环：单臂划船",
            sets: 3,
            repsRange: "12次/每侧",
            rest: "仅在完成整个循环后",
          },
          {
            name: "循环：平板支撑",
            sets: 3,
            repsRange: "30秒",
            rest: "仅在完成整个循环后",
          },
          {
            name: "循环：跳绳",
            sets: 3,
            repsRange: "45秒",
            rest: "完成循环后休息2分钟",
          },
        ],
      },
      {
        day: 7,
        focus: "休息",
        exercises: [],
      },
    ],
    progressRate: "每周增加运动强度或减少休息时间",
    completionPercentage: 40,
  },
];
