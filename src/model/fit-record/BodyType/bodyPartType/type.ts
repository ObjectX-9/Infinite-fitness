/**
 * 身体部位类型
 */

export interface BodyPartType {
  /**
   * 身体部位类型的唯一ID
   */
  _id: string;
  /**
   * 身体部位类型的名称
   */
  name: EBodyPartTypeCategory | string;
  /**
   * 身体部位类型的描述
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
   * 是否为自定义部位
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
}

export enum EBodyPartTypeCategory {
  /**
   * 胸部
   */
  CHEST = "chest",
  /**
   * 背部
   */
  BACK = "back",
  /**
   * 手臂
   */
  ARM = "arm",
  /**
   * 腿部
   */
  LEG = "leg",
  /**
   * 腹部
   */
  ABDOMEN = "abdomen",
  /**
   * 臀部
   */
  HIPS = "hips",
  /**
   * 颈部
   */
  NECK = "neck",
  /**
   * 肩部
   */
  SHOULDER = "shoulder",
}
