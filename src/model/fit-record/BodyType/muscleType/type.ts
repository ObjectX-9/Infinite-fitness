/**
 * 肌肉类型
 */

export interface MuscleType {
  /**
   * 肌肉类型的唯一ID
   */
  _id: string;
  /**
   * 肌肉类型的名称
   */
  name: EMuscleTypeCategory | string;
  /**
   * 肌肉类型的描述
   */
  description: string;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
  /**
   * 是否为自定义肌肉
   */
  isCustom?: boolean;
  /**
   * 用户ID
   */
  userId?: string;
  /**
   * 图片URLs
   */
  imageUrls: string[];
  /**
   * 视频URLs
   */
  videoUrls: string[];
  /**
   * 排序
   */
  order: number;
  /**
   * 关联的身体部位ID
   */
  bodyPartId?: string;
}

export enum EMuscleTypeCategory {
  // ============肩膀============
  // 前（前）三角肌：前束
  SHOULDER_FRONT = "SHOULDER_FRONT",
  // 横向三角肌：中束
  SHOULDER_MIDDLE = "SHOULDER_MIDDLE",
  // 后（后）三角肌：后束
  SHOULDER_BACK = "SHOULDER_BACK",

  // ============胸部============
  // 胸大肌
  CHEST_MAJOR = "CHEST_MAJOR",
  // 小胸大肌
  CHEST_MINOR = "CHEST_MINOR",

  // ============腹部============
  // 腹直肌
  ABDOMEN_RECTUS = "ABDOMEN_RECTUS",
  // 腹斜肌
  ABDOMEN_OBLEQUE = "ABDOMEN_OBLEQUE",

  // ============腿部============
  // 股四头肌
  LEG_QUADRICEPS = "LEG_QUADRICEPS",
  // 小腿三头肌
  LEG_TRICEPS = "LEG_TRICEPS",
  // 腘绳肌
  LEG_HAMSTRINGS = "LEG_HAMSTRINGS",

  // ============手臂============
  // 肱二头肌
  ARM_BICEP = "ARM_BICEP",
  // 肱三头肌
  ARM_TRICEP = "ARM_TRICEP",
  // 前臂
  ARM_FOREARM = "ARM_FOREARM",

  // ============臀部============
  // 臀部
  HIP_GLUTEUS = "HIP_GLUTEUS",

  // ============背部============
  // 斜方肌
  BACK_SCAPULARIS = "BACK_SCAPULARIS",
  // 后背中部斜方肌
  BACK_MIDDLE_SCAPULARIS = "BACK_MIDDLE_SCAPULARIS",
  // 背阔肌
  BACK_BICEP = "BACK_BICEP",
  // 竖脊肌
  BACK_LUMBARIS = "BACK_LUMBARIS",
}
