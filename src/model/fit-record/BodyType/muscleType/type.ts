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
  /**
   * 胸大肌
   */
  PECTORALIS_MAJOR = "pectoralis_major",
  /**
   * 背阔肌
   */
  LATISSIMUS_DORSI = "latissimus_dorsi",
  /**
   * 二头肌
   */
  BICEPS = "biceps",
  /**
   * 三头肌
   */
  TRICEPS = "triceps",
  /**
   * 腹直肌
   */
  RECTUS_ABDOMINIS = "rectus_abdominis",
  /**
   * 股四头肌
   */
  QUADRICEPS = "quadriceps",
  /**
   * 腘绳肌
   */
  HAMSTRINGS = "hamstrings",
  /**
   * 小腿肌群
   */
  CALVES = "calves",
  /**
   * 三角肌
   */
  DELTOIDS = "deltoids",
  /**
   * 斜方肌
   */
  TRAPEZIUS = "trapezius",
}