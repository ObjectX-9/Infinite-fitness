// 预设训练动作类型定义

// 主要肌肉群组
export type MuscleGroup =
  | "胸部"
  | "背部"
  | "肩部"
  | "手臂"
  | "腿部"
  | "臀部"
  | "核心"
  | "全身"
  | "有氧";

// 详细肌肉分类
export type SubMuscleGroup =
  // 胸部
  | "上胸"
  | "中胸"
  | "下胸"
  | "内胸"
  | "外胸"
  // 背部
  | "背阔肌"
  | "斜方肌"
  | "菱形肌"
  | "竖脊肌"
  | "下背部"
  | "背部深层肌群"
  // 肩部
  | "前束三角肌"
  | "中束三角肌"
  | "后束三角肌"
  | "斜方肌上部"
  | "肩袖肌群"
  // 手臂
  | "肱二头肌"
  | "肱三头肌"
  | "前臂屈肌"
  | "前臂伸肌"
  | "肱桡肌"
  // 腿部
  | "股四头肌"
  | "股二头肌"
  | "股内侧肌"
  | "小腿肌群"
  | "腘绳肌"
  | "大腿内收肌"
  // 臀部
  | "臀大肌"
  | "臀中肌"
  | "臀小肌"
  // 核心
  | "腹直肌"
  | "腹外斜肌"
  | "腹内斜肌"
  | "腹横肌"
  | "下腹"
  // 全身
  | "全身综合";

// 肌肉群组与子群组的映射关系
export const muscleGroupMapping: Record<MuscleGroup, SubMuscleGroup[]> = {
  胸部: ["上胸", "中胸", "下胸", "内胸", "外胸"],
  背部: ["背阔肌", "斜方肌", "菱形肌", "竖脊肌", "下背部", "背部深层肌群"],
  肩部: ["前束三角肌", "中束三角肌", "后束三角肌", "斜方肌上部", "肩袖肌群"],
  手臂: ["肱二头肌", "肱三头肌", "前臂屈肌", "前臂伸肌", "肱桡肌"],
  腿部: [
    "股四头肌",
    "股二头肌",
    "股内侧肌",
    "小腿肌群",
    "腘绳肌",
    "大腿内收肌",
  ],
  臀部: ["臀大肌", "臀中肌", "臀小肌"],
  核心: ["腹直肌", "腹外斜肌", "腹内斜肌", "腹横肌", "下腹"],
  全身: ["全身综合"],
  有氧: ["全身综合"],
};

export type EquipmentType =
  | "哑铃"
  | "杠铃"
  | "器械"
  | "绳索"
  | "壶铃"
  | "徒手"
  | "弹力带"
  | "其他";

export type DifficultyLevel = "初级" | "中级" | "高级";

export type FitnessGoal = "增肌" | "减脂" | "力量" | "耐力" | "灵活性" | "康复";

export type ExerciseSource = "preset" | "custom";

export interface BaseExerciseItem {
  // 基本信息
  id: string; // 唯一标识符
  name: string; // 动作名称
  description: string; // 动作简介
  videoUrl?: string; // 动作实操视频链接
  imageUrls?: string[]; // 动作图片链接数组
  source: ExerciseSource; // 动作来源：预设或自定义

  // 分类信息
  muscleGroup: MuscleGroup; // 主要锻炼部位
  subMuscleGroups: SubMuscleGroup[]; // 详细锻炼部位
  secondaryMuscles?: MuscleGroup[]; // 次要锻炼部位
  secondarySubMuscles?: SubMuscleGroup[]; // 次要详细锻炼部位
  equipmentType: EquipmentType; // 器械类型
  difficulty: DifficultyLevel; // 难度级别
  fitnessGoals: FitnessGoal[]; // 适合的健身目标

  // 训练指导
  recommendedSets?: number; // 推荐组数
  recommendedReps?: string; // 推荐次数(可能是范围，如"8-12")
  recommendedWeight?: string; // 推荐重量范围或描述

  // 额外信息
  tips?: string[]; // 动作注意事项
  commonMistakes?: string[]; // 常见错误
  alternatives?: string[]; // 替代动作
  caloriesBurned?: number; // 估计卡路里消耗(每组)
}

// 预设动作
export interface PresetExerciseItem extends BaseExerciseItem {
  source: "preset";
}

// 自定义动作
export interface CustomExerciseItem extends BaseExerciseItem {
  source: "custom";
  createdAt: Date; // 创建时间
  updatedAt?: Date; // 更新时间
  creatorId?: string; // 创建者ID
  notes?: string; // 个人笔记
}

// 通用动作类型
export type ExerciseItem = PresetExerciseItem | CustomExerciseItem;

// 预设动作库类型
export type ExerciseLibrary = Record<string, ExerciseItem>;
