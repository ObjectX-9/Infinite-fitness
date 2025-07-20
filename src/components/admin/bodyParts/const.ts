import { EBodyPartTypeCategory } from "@/model/fit-record/BodyType/bodyPartType/type";

/**
 * 获取类别中文名称
 */
export const getCategoryLabel = (category: EBodyPartTypeCategory | string) => {
  const categoryMap = {
    [EBodyPartTypeCategory.CHEST]: "胸部",
    [EBodyPartTypeCategory.BACK]: "背部",
    [EBodyPartTypeCategory.ARM]: "手臂",
    [EBodyPartTypeCategory.LEG]: "腿部",
    [EBodyPartTypeCategory.ABDOMEN]: "腹部",
    [EBodyPartTypeCategory.HIPS]: "臀部",
    [EBodyPartTypeCategory.NECK]: "颈部",
    [EBodyPartTypeCategory.SHOULDER]: "肩部",
  };
  return categoryMap[category as EBodyPartTypeCategory] || category;
};
