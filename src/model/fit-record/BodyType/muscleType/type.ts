export interface MuscleType {
  /**
   * 肌肉类型的唯一ID
   */
  id: string;
  /**
   * 肌肉类型的名称
   */
  name: string;
  /**
   * 肌肉类型的描述
   */
  description: string;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;

  /**
   * 肌肉类型的分类
   */
  bodyPartTypeCategoryId: string;

  /**
   * 主要功能
   */
  primaryFunction: string;

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
  imageUrls?: string[];

  /**
   * 排序
   */
  order?: number;
}