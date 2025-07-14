import {
  ExerciseItem,
  PresetExerciseItem,
  CustomExerciseItem,
  ExerciseLibrary,
} from "./type";

// 预设动作数据
const presetExercises: Record<string, PresetExerciseItem> = {
  // 胸部训练
  "bench-press": {
    id: "bench-press",
    name: "卧推",
    description: "经典的胸肌训练动作，主要锻炼胸大肌",
    videoUrl: "https://example.com/videos/bench-press.mp4",
    imageUrls: [
      "https://example.com/images/bench-press-1.jpg",
      "https://example.com/images/bench-press-2.jpg",
      "https://example.com/images/bench-press-3.jpg",
    ],
    source: "preset",
    muscleGroup: "胸部",
    subMuscleGroups: ["中胸", "外胸"],
    secondaryMuscles: ["肩部", "手臂"],
    secondarySubMuscles: ["前束三角肌", "肱三头肌"],
    equipmentType: "杠铃",
    difficulty: "中级",
    fitnessGoals: ["增肌", "力量"],
    recommendedSets: 4,
    recommendedReps: "8-12",
    recommendedWeight: "根据个人能力，确保最后两次重复有挑战性",
    tips: [
      "保持肩胛骨收紧并固定在卧推凳上",
      "双脚平稳放在地面上",
      "下放杠铃时控制速度，触碰胸部但不要让杠铃压在胸部上",
    ],
    commonMistakes: ["将臀部抬离凳面", "手腕弯曲", "不完整的动作范围"],
    alternatives: ["哑铃卧推", "器械卧推", "俯卧撑"],
    caloriesBurned: 8,
  },

  "incline-bench-press": {
    id: "incline-bench-press",
    name: "上斜卧推",
    description: "针对上胸肌的训练动作",
    videoUrl: "https://example.com/videos/incline-bench-press.mp4",
    imageUrls: [
      "https://example.com/images/incline-bench-press-1.jpg",
      "https://example.com/images/incline-bench-press-2.jpg",
    ],
    source: "preset",
    muscleGroup: "胸部",
    subMuscleGroups: ["上胸"],
    secondaryMuscles: ["肩部", "手臂"],
    secondarySubMuscles: ["前束三角肌", "中束三角肌", "肱三头肌"],
    equipmentType: "杠铃",
    difficulty: "中级",
    fitnessGoals: ["增肌", "力量"],
    recommendedSets: 3,
    recommendedReps: "8-12",
    recommendedWeight: "比平板卧推略轻",
    tips: ["斜度通常设置在30-45度", "保持肩膀向后下沉", "控制动作，避免反弹"],
    commonMistakes: ["角度过陡", "手肘外展过大", "肩膀前倾"],
    alternatives: ["哑铃上斜卧推", "器械上斜卧推", "上斜俯卧撑"],
    caloriesBurned: 7,
  },

  "push-up": {
    id: "push-up",
    name: "俯卧撑",
    description: "无需器械的基础胸部训练动作",
    videoUrl: "https://example.com/videos/push-up.mp4",
    imageUrls: [
      "https://example.com/images/push-up-1.jpg",
      "https://example.com/images/push-up-2.jpg",
    ],
    source: "preset",
    muscleGroup: "胸部",
    subMuscleGroups: ["中胸", "下胸"],
    secondaryMuscles: ["肩部", "手臂", "核心"],
    secondarySubMuscles: ["前束三角肌", "肱三头肌", "腹直肌"],
    equipmentType: "徒手",
    difficulty: "初级",
    fitnessGoals: ["增肌", "力量", "耐力"],
    recommendedSets: 3,
    recommendedReps: "10-20",
    tips: ["保持身体成一直线", "手臂与地面垂直", "控制下降速度"],
    commonMistakes: ["臀部过高或过低", "肩膀耸起", "不完全伸展或降低"],
    alternatives: ["跪姿俯卧撑", "上斜俯卧撑", "窄距俯卧撑"],
    caloriesBurned: 5,
  },

  // 背部训练
  "pull-up": {
    id: "pull-up",
    name: "引体向上",
    description: "经典的上背部训练动作，强化背阔肌和手臂",
    videoUrl: "https://example.com/videos/pull-up.mp4",
    imageUrls: [
      "https://example.com/images/pull-up-1.jpg",
      "https://example.com/images/pull-up-2.jpg",
      "https://example.com/images/pull-up-3.jpg",
      "https://example.com/images/pull-up-4.jpg",
    ],
    source: "preset",
    muscleGroup: "背部",
    subMuscleGroups: ["背阔肌", "斜方肌"],
    secondaryMuscles: ["手臂", "肩部"],
    secondarySubMuscles: ["肱二头肌", "前臂屈肌", "后束三角肌"],
    equipmentType: "器械",
    difficulty: "中级",
    fitnessGoals: ["增肌", "力量"],
    recommendedSets: 4,
    recommendedReps: "6-12",
    tips: ["握距比肩宽稍宽", "完全伸展手臂下降", "控制整个动作过程"],
    commonMistakes: ["使用惯性摆动身体", "不完全下降", "抓杆过紧导致前臂疲劳"],
    alternatives: ["辅助引体向上", "反向划船", "拉力带辅助引体向上"],
    caloriesBurned: 10,
  },

  "barbell-row": {
    id: "barbell-row",
    name: "杠铃划船",
    description: "强化背部中部和下部肌群的复合动作",
    videoUrl: "https://example.com/videos/barbell-row.mp4",
    imageUrls: [
      "https://example.com/images/barbell-row-1.jpg",
      "https://example.com/images/barbell-row-2.jpg",
    ],
    source: "preset",
    muscleGroup: "背部",
    subMuscleGroups: ["背阔肌", "菱形肌", "竖脊肌"],
    secondaryMuscles: ["手臂", "肩部", "核心"],
    secondarySubMuscles: ["肱二头肌", "后束三角肌", "腹直肌"],
    equipmentType: "杠铃",
    difficulty: "中级",
    fitnessGoals: ["增肌", "力量"],
    recommendedSets: 4,
    recommendedReps: "8-12",
    tips: ["保持背部平直", "将杠铃拉向腹部下方", "肘部保持贴近身体"],
    commonMistakes: [
      "背部过度弯曲",
      "使用过大的摆动惯性",
      "拉力不足导致动作幅度小",
    ],
    alternatives: ["哑铃划船", "T杠划船", "坐姿绳索划船"],
    caloriesBurned: 9,
  },

  // 腿部训练
  squat: {
    id: "squat",
    name: "深蹲",
    description: "全身性强化训练，重点锻炼下肢力量",
    videoUrl: "https://example.com/videos/squat.mp4",
    imageUrls: [
      "https://example.com/images/squat-1.jpg",
      "https://example.com/images/squat-2.jpg",
    ],
    source: "preset",
    muscleGroup: "腿部",
    subMuscleGroups: ["股四头肌", "股二头肌", "臀大肌"],
    secondaryMuscles: ["臀部", "核心"],
    secondarySubMuscles: ["臀中肌", "腹直肌", "腹横肌"],
    equipmentType: "杠铃",
    difficulty: "中级",
    fitnessGoals: ["增肌", "力量"],
    recommendedSets: 4,
    recommendedReps: "8-12",
    recommendedWeight: "根据个人能力调整",
    tips: ["保持胸部挺起", "膝盖与脚尖方向一致", "下蹲时臀部向后推"],
    commonMistakes: ["膝盖内扣", "脊柱弯曲", "重心前移"],
    alternatives: ["哑铃深蹲", "杯式深蹲", "分腿蹲"],
    caloriesBurned: 12,
  },

  "leg-extension": {
    id: "leg-extension",
    name: "腿部伸展",
    description: "专注于训练股四头肌的单关节动作",
    videoUrl: "https://example.com/videos/leg-extension.mp4",
    imageUrls: [
      "https://example.com/images/leg-extension-1.jpg",
      "https://example.com/images/leg-extension-2.jpg",
    ],
    source: "preset",
    muscleGroup: "腿部",
    subMuscleGroups: ["股四头肌"],
    secondaryMuscles: [],
    secondarySubMuscles: [],
    equipmentType: "器械",
    difficulty: "初级",
    fitnessGoals: ["增肌", "力量"],
    recommendedSets: 3,
    recommendedReps: "10-15",
    tips: [
      "调整座椅使膝关节与机器枢轴对齐",
      "避免背部用力或离开靠背",
      "控制动作，特别是下放重量时",
    ],
    commonMistakes: [
      "用力过猛导致身体上抬",
      "动作过快失去控制",
      "膝盖过度伸展",
    ],
    alternatives: ["保加利亚分腿蹲", "腿举机", "正步走"],
    caloriesBurned: 6,
  },

  // 肩部训练
  "shoulder-press": {
    id: "shoulder-press",
    name: "肩上推举",
    description: "综合性肩部训练，着重发展三角肌",
    videoUrl: "https://example.com/videos/shoulder-press.mp4",
    imageUrls: [
      "https://example.com/images/shoulder-press-1.jpg",
      "https://example.com/images/shoulder-press-2.jpg",
    ],
    source: "preset",
    muscleGroup: "肩部",
    subMuscleGroups: ["前束三角肌", "中束三角肌"],
    secondaryMuscles: ["手臂", "胸部"],
    secondarySubMuscles: ["肱三头肌", "上胸"],
    equipmentType: "哑铃",
    difficulty: "中级",
    fitnessGoals: ["增肌", "力量"],
    recommendedSets: 3,
    recommendedReps: "8-12",
    recommendedWeight: "根据个人能力选择合适的重量",
    tips: ["保持核心收紧", "避免过度弓背", "控制下放重量的速度"],
    commonMistakes: [
      "使用过重的重量导致姿势不正确",
      "动作过快失去控制",
      "手腕角度不当",
    ],
    alternatives: ["杠铃肩推", "器械肩推", "站姿推举"],
    caloriesBurned: 7,
  },

  "lateral-raise": {
    id: "lateral-raise",
    name: "侧平举",
    description: "针对肩部中束三角肌的孤立训练动作",
    videoUrl: "https://example.com/videos/lateral-raise.mp4",
    imageUrls: [
      "https://example.com/images/lateral-raise-1.jpg",
      "https://example.com/images/lateral-raise-2.jpg",
    ],
    source: "preset",
    muscleGroup: "肩部",
    subMuscleGroups: ["中束三角肌"],
    secondaryMuscles: ["肩部"],
    secondarySubMuscles: ["斜方肌上部"],
    equipmentType: "哑铃",
    difficulty: "初级",
    fitnessGoals: ["增肌", "力量"],
    recommendedSets: 3,
    recommendedReps: "12-15",
    recommendedWeight: "轻重量，注重控制和感受",
    tips: ["肘部微屈", "控制动作，避免使用惯性", "哑铃与地面保持平行"],
    commonMistakes: ["肩膀耸起", "手臂举得过高", "摇摆身体产生惯性"],
    alternatives: ["绳索侧平举", "单臂侧平举", "器械侧平举"],
    caloriesBurned: 5,
  },

  // 核心训练
  plank: {
    id: "plank",
    name: "平板支撑",
    description: "稳定核心肌群的基础训练动作",
    videoUrl: "https://example.com/videos/plank.mp4",
    imageUrls: [
      "https://example.com/images/plank-1.jpg",
      "https://example.com/images/plank-2.jpg",
    ],
    source: "preset",
    muscleGroup: "核心",
    subMuscleGroups: ["腹直肌", "腹横肌", "腹外斜肌"],
    secondaryMuscles: ["肩部", "手臂"],
    secondarySubMuscles: ["肩袖肌群", "肱三头肌"],
    equipmentType: "徒手",
    difficulty: "初级",
    fitnessGoals: ["力量", "耐力"],
    recommendedSets: 3,
    recommendedReps: "30-60秒",
    tips: ["保持身体成一直线", "肩膀位于手肘正上方", "收紧腹部肌肉"],
    commonMistakes: ["臀部过高或过低", "颈部紧张", "脊柱弯曲"],
    alternatives: ["侧平板支撑", "上平板支撑", "动态平板支撑"],
    caloriesBurned: 4,
  },

  "russian-twist": {
    id: "russian-twist",
    name: "俄罗斯转体",
    description: "针对腹斜肌的旋转核心训练",
    videoUrl: "https://example.com/videos/russian-twist.mp4",
    imageUrls: [
      "https://example.com/images/russian-twist-1.jpg",
      "https://example.com/images/russian-twist-2.jpg",
    ],
    source: "preset",
    muscleGroup: "核心",
    subMuscleGroups: ["腹外斜肌", "腹内斜肌"],
    secondaryMuscles: ["腿部"],
    secondarySubMuscles: ["下背部"],
    equipmentType: "徒手",
    difficulty: "初级",
    fitnessGoals: ["力量", "耐力", "减脂"],
    recommendedSets: 3,
    recommendedReps: "15-20次(每侧)",
    tips: ["保持背部挺直", "从腰部旋转而不是肩部", "可以提起双脚增加难度"],
    commonMistakes: ["背部弯曲", "动作过快失去控制", "旋转幅度不足"],
    alternatives: ["站姿旋转", "药球旋转", "电缆旋转"],
    caloriesBurned: 6,
  },

  // 有氧训练
  running: {
    id: "running",
    name: "跑步",
    description: "基础有氧训练，提升心肺功能",
    videoUrl: "https://example.com/videos/running.mp4",
    imageUrls: [
      "https://example.com/images/running-1.jpg",
      "https://example.com/images/running-2.jpg",
      "https://example.com/images/running-3.jpg",
    ],
    source: "preset",
    muscleGroup: "有氧",
    subMuscleGroups: ["全身综合"],
    secondaryMuscles: ["腿部", "核心"],
    secondarySubMuscles: ["下背部"],
    equipmentType: "徒手",
    difficulty: "初级",
    fitnessGoals: ["减脂", "耐力"],
    recommendedSets: 1,
    recommendedReps: "20-30分钟",
    tips: ["保持正确的姿势", "根据自身情况控制强度", "注意呼吸节奏"],
    commonMistakes: ["步幅过大", "着地方式不当", "呼吸不协调"],
    alternatives: ["快走", "椭圆机", "游泳"],
    caloriesBurned: 10,
  },
};

// 自定义动作示例
const customExercises: Record<string, CustomExerciseItem> = {
  "custom-1": {
    id: "custom-1",
    name: "单臂哑铃划船变式",
    description: "个人改良的背部训练动作，增加稳定性挑战",
    videoUrl: "https://example.com/videos/custom-row.mp4",
    imageUrls: [
      "https://example.com/images/custom-row-1.jpg",
      "https://example.com/images/custom-row-2.jpg",
    ],
    source: "custom",
    muscleGroup: "背部",
    subMuscleGroups: ["背部深层肌群"],
    secondaryMuscles: ["手臂", "核心"],
    secondarySubMuscles: ["下背部"],
    equipmentType: "哑铃",
    difficulty: "中级",
    fitnessGoals: ["增肌", "力量"],
    recommendedSets: 4,
    recommendedReps: "10-15",
    recommendedWeight: "中等重量，保持良好姿势",
    tips: ["保持背部挺直", "控制重量，避免惯性摆动"],
    commonMistakes: ["躯干过度旋转", "手臂外展过大"],
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-06-02"),
    creatorId: "user123",
    notes: "这是我自己设计的动作，特别适合增强背部肌肉的稳定性",
  },

  "custom-2": {
    id: "custom-2",
    name: "复合式弹力带训练",
    description: "结合多个肌群的弹力带训练，适合在家进行",
    imageUrls: ["https://example.com/images/custom-band-1.jpg"],
    source: "custom",
    muscleGroup: "全身",
    subMuscleGroups: ["全身综合"],
    secondaryMuscles: ["腿部", "核心"],
    secondarySubMuscles: ["下背部"],
    equipmentType: "弹力带",
    difficulty: "初级",
    fitnessGoals: ["力量", "灵活性"],
    recommendedSets: 3,
    recommendedReps: "15-20",
    tips: ["保持弹力带张力", "动作缓慢控制"],
    createdAt: new Date("2023-08-20"),
    creatorId: "user123",
    notes: "旅行时的便携训练方案",
  },
};

// 合并所有动作数据
export const exerciseData: ExerciseLibrary = {
  ...presetExercises,
  ...customExercises,
};

// 导出所有预设动作列表
export const presetExerciseList = Object.values(presetExercises);

// 导出所有自定义动作列表
export const customExerciseList = Object.values(customExercises);

// 按肌肉部位分组的动作
export const exercisesByMuscle = (muscleGroup: string): ExerciseItem[] => {
  return Object.values(exerciseData).filter(
    (exercise) => exercise.muscleGroup === muscleGroup
  );
};

// 按难度分组的动作
export const exercisesByDifficulty = (difficulty: string): ExerciseItem[] => {
  return Object.values(exerciseData).filter(
    (exercise) => exercise.difficulty === difficulty
  );
};

// 按器械类型分组的动作
export const exercisesByEquipment = (equipmentType: string): ExerciseItem[] => {
  return Object.values(exerciseData).filter(
    (exercise) => exercise.equipmentType === equipmentType
  );
};
