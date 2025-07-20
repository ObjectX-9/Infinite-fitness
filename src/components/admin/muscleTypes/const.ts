import { EMuscleTypeCategory } from "@/model/fit-record/BodyType/muscleType/type";

/**
 * 获取肌肉类型中文名称
 * @param category 肌肉类型枚举值或字符串
 * @returns 对应的中文名称
 */
export const getMuscleTypeLabel = (category: EMuscleTypeCategory | string) => {
  const categoryMap = {
    // 肩部
    [EMuscleTypeCategory.SHOULDER_FRONT]: "前三角肌",
    [EMuscleTypeCategory.SHOULDER_MIDDLE]: "中三角肌",
    [EMuscleTypeCategory.SHOULDER_BACK]: "后三角肌",

    // 胸部
    [EMuscleTypeCategory.CHEST_MAJOR]: "胸大肌",
    [EMuscleTypeCategory.CHEST_MINOR]: "胸小肌",

    // 腹部
    [EMuscleTypeCategory.ABDOMEN_RECTUS]: "腹直肌",
    [EMuscleTypeCategory.ABDOMEN_OBLEQUE]: "腹斜肌",

    // 腿部
    [EMuscleTypeCategory.LEG_QUADRICEPS]: "股四头肌",
    [EMuscleTypeCategory.LEG_TRICEPS]: "小腿三头肌",
    [EMuscleTypeCategory.LEG_HAMSTRINGS]: "腘绳肌",

    // 手臂
    [EMuscleTypeCategory.ARM_BICEP]: "肱二头肌",
    [EMuscleTypeCategory.ARM_TRICEP]: "肱三头肌",
    [EMuscleTypeCategory.ARM_FOREARM]: "前臂",

    // 臀部
    [EMuscleTypeCategory.HIP_GLUTEUS]: "臀部",

    // 背部
    [EMuscleTypeCategory.BACK_SCAPULARIS]: "斜方肌",
    [EMuscleTypeCategory.BACK_MIDDLE_SCAPULARIS]: "后背中部斜方肌",
    [EMuscleTypeCategory.BACK_BICEP]: "背阔肌",
    [EMuscleTypeCategory.BACK_LUMBARIS]: "竖脊肌",
  };
  return categoryMap[category as EMuscleTypeCategory] || category;
};
