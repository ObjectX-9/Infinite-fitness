/**
 * 使用场景
 */
export interface UsageScenario {
  /**
   * 使用场景的唯一ID
   */
  _id: string;
  /**
   * 使用场景的名称
   */
  name: string;
  /**
   * 使用场景的描述
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
   * 图片URLs
   */
  imageUrls?: string[];
  /**
   * 是否为自定义场景
   */
  isCustom?: boolean;
  /**
   * 用户ID
   */
  userId?: string;
  /**
   * 排序
   */
  order: number;
}

/**
 * 使用场景分类枚举
 */
export enum EUsageScenarioCategory {
  /**
   * 家庭场景
   */
  HOME = "home",
  /**
   * 健身房场景
   */
  GYM = "gym",
  /**
   * 办公场景
   */
  OFFICE = "office",
  /**
   * 户外场景
   */
  OUTDOOR = "outdoor",
  /**
   * 旅行场景
   */
  TRAVEL = "travel",
}