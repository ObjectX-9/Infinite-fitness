import {
  FitnessEquipment,
  EquipmentLibrary,
  UsageScenario,
  MuscleGroup,
} from "./type";

// 健身器械数据
const fitnessEquipments: Record<string, FitnessEquipment> = {
  // 哑铃
  dumbbell: {
    id: "dumbbell",
    name: "哑铃",
    description: "可调节重量的经典力量训练器械，适用于多种肌群训练",
    imageUrls: [
      "https://example.com/images/equipment/dumbbell-1.jpg",
      "https://example.com/images/equipment/dumbbell-2.jpg",
      "https://example.com/images/equipment/dumbbell-3.jpg",
    ],
    brand: "专业健身",
    model: "DB-Pro 5-50KG",
    category: "自由重量",
    targetMuscles: ["胸部", "背部", "肩部", "手臂", "腿部"],
    fitnessGoals: ["增肌", "力量", "耐力"],
    size: "中型",
    weight: 50,
    dimensions: {
      length: 40,
      width: 20,
      height: 20,
    },
    usageInstructions: [
      "选择适合自己的重量",
      "确保握持稳固",
      "动作过程中保持控制",
    ],
    safetyTips: [
      "避免突然放下重物",
      "使用适合自己能力的重量",
      "保持正确姿势避免受伤",
    ],
    maintenanceTips: ["定期检查锁紧装置", "保持器械干燥", "避免剧烈碰撞"],
    usageScenarios: ["健身房", "家庭"],
    priceRange: "中价",
    purchaseLink: "https://example.com/shop/dumbbell",
    recommendedExercises: ["bench-press", "shoulder-press", "custom-1"],
    alternatives: ["壶铃", "杠铃"],
    featuresAndBenefits: [
      "可调节重量，一器多用",
      "便于存放",
      "适合多种训练动作",
    ],
    userRating: 4.8,
  },

  // 划船机
  "rowing-machine": {
    id: "rowing-machine",
    name: "划船机",
    description: "全身性有氧训练器械，模拟划船动作，锻炼多个肌群",
    imageUrls: [
      "https://example.com/images/equipment/rowing-machine-1.jpg",
      "https://example.com/images/equipment/rowing-machine-2.jpg",
    ],
    brand: "FitRow",
    model: "R-500",
    category: "有氧训练",
    targetMuscles: ["背部", "手臂", "腿部", "核心"],
    fitnessGoals: ["减脂", "耐力", "力量"],
    size: "大型",
    weight: 35,
    dimensions: {
      length: 240,
      width: 60,
      height: 80,
    },
    usageInstructions: [
      "调整脚踏板位置",
      "保持背部挺直",
      "先蹬腿，再拉臂，最后收腰",
    ],
    safetyTips: [
      "避免驼背划船",
      "控制好划船速度和力度",
      "使用后放回手柄，避免反弹",
    ],
    maintenanceTips: [
      "定期检查滑轨是否顺滑",
      "保持链条或皮带适当张力",
      "检查脚踏板固定装置是否牢固",
    ],
    usageScenarios: ["健身房", "家庭"],
    priceRange: "高价",
    purchaseLink: "https://example.com/shop/rowing-machine",
    recommendedExercises: ["pull-up"],
    alternatives: ["椭圆机", "动感单车"],
    featuresAndBenefits: [
      "低冲击有氧训练",
      "全身性锻炼",
      "可折叠设计便于存放",
      "数字显示屏追踪训练数据",
    ],
    userRating: 4.6,
  },

  // 弹力带
  "resistance-band": {
    id: "resistance-band",
    name: "弹力带",
    description: "轻便灵活的训练器械，通过不同阻力提供多样化训练",
    imageUrls: [
      "https://example.com/images/equipment/resistance-band-1.jpg",
      "https://example.com/images/equipment/resistance-band-2.jpg",
    ],
    brand: "FlexFit",
    model: "Pro Bands Set",
    category: "功能性训练",
    targetMuscles: ["胸部", "背部", "肩部", "手臂", "腿部", "臀部"],
    fitnessGoals: ["力量", "灵活性", "康复"],
    size: "小型",
    weight: 0.5,
    usageInstructions: [
      "选择适合训练的阻力级别",
      "确保弹力带固定牢固",
      "保持张力进行训练动作",
    ],
    safetyTips: [
      "使用前检查弹力带是否有损坏",
      "避免过度拉伸",
      "注意弹力回弹可能造成的伤害",
    ],
    maintenanceTips: ["避免阳光直射", "保持干燥", "使用后轻轻擦拭"],
    usageScenarios: ["健身房", "家庭", "户外", "办公室", "旅行"],
    priceRange: "低价",
    purchaseLink: "https://example.com/shop/resistance-band",
    recommendedExercises: ["custom-2"],
    alternatives: ["小哑铃", "拉力器"],
    featuresAndBenefits: [
      "便携轻巧",
      "多种阻力可选",
      "适合多种训练动作",
      "适合各种健身水平",
    ],
    userRating: 4.7,
    userNotes: "旅行必备的训练装备，几乎不占空间",
  },

  // 卧推架
  "bench-press-rack": {
    id: "bench-press-rack",
    name: "卧推架",
    description: "用于安全进行卧推训练的固定器械",
    imageUrls: [
      "https://example.com/images/equipment/bench-press-rack-1.jpg",
      "https://example.com/images/equipment/bench-press-rack-2.jpg",
    ],
    brand: "PowerLift",
    model: "BP-1000",
    category: "固定器械",
    targetMuscles: ["胸部", "肩部", "手臂"],
    fitnessGoals: ["增肌", "力量"],
    size: "大型",
    weight: 80,
    dimensions: {
      length: 200,
      width: 120,
      height: 180,
    },
    usageInstructions: [
      "调整适合的高度",
      "确保杠铃放置稳固",
      "训练时必须有保护人员在场",
    ],
    safetyTips: ["使用安全挡杆", "不要超过自身能力负重", "确保器械稳定放置"],
    maintenanceTips: [
      "定期检查螺丝是否松动",
      "检查焊接处是否完好",
      "保持垫子清洁",
    ],
    usageScenarios: ["健身房"],
    priceRange: "高价",
    purchaseLink: "https://example.com/shop/bench-press-rack",
    recommendedExercises: ["bench-press"],
    alternatives: ["史密斯机"],
    featuresAndBenefits: ["可调节高度", "安全保护设计", "稳固结构"],
    userRating: 4.5,
  },

  // 深蹲架
  "squat-rack": {
    id: "squat-rack",
    name: "深蹲架",
    description: "用于安全进行深蹲和其他杠铃训练的固定器械",
    imageUrls: [
      "https://example.com/images/equipment/squat-rack-1.jpg",
      "https://example.com/images/equipment/squat-rack-2.jpg",
    ],
    brand: "PowerLift",
    model: "SR-2000",
    category: "固定器械",
    targetMuscles: ["腿部", "臀部", "核心"],
    fitnessGoals: ["增肌", "力量"],
    size: "大型",
    weight: 100,
    dimensions: {
      length: 180,
      width: 140,
      height: 220,
    },
    usageInstructions: [
      "调整适合的高度",
      "确保杠铃放置稳固",
      "深蹲时注意保持正确姿势",
    ],
    safetyTips: ["使用安全挡杆", "不要超过自身能力负重", "保持稳定站姿"],
    maintenanceTips: [
      "定期检查螺丝是否松动",
      "检查焊接处是否完好",
      "保持J钩完好无损",
    ],
    usageScenarios: ["健身房"],
    priceRange: "高价",
    purchaseLink: "https://example.com/shop/squat-rack",
    recommendedExercises: ["squat"],
    alternatives: ["史密斯机", "腿举机"],
    featuresAndBenefits: ["可调节高度", "安全保护设计", "多功能训练站"],
    userRating: 4.7,
  },
};

// 导出器械数据
export const equipmentData: EquipmentLibrary = fitnessEquipments;

// 导出所有器械列表
export const equipmentList = Object.values(fitnessEquipments);

// 按类别分组的器械
export const equipmentByCategory = (category: string): FitnessEquipment[] => {
  return Object.values(equipmentData).filter(
    (equipment) => equipment.category === category
  );
};

// 按目标肌群查找器械
export const equipmentByMuscleGroup = (
  muscleGroup: string
): FitnessEquipment[] => {
  return Object.values(equipmentData).filter((equipment) =>
    equipment.targetMuscles.includes(muscleGroup as MuscleGroup)
  );
};

// 按价格范围查找器械
export const equipmentByPriceRange = (
  priceRange: string
): FitnessEquipment[] => {
  return Object.values(equipmentData).filter(
    (equipment) => equipment.priceRange === priceRange
  );
};

// 按使用场景查找器械
export const equipmentByUsageScenario = (
  scenario: string
): FitnessEquipment[] => {
  return Object.values(equipmentData).filter((equipment) =>
    equipment.usageScenarios.includes(scenario as UsageScenario)
  );
};
