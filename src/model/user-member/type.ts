/**
 * 会员信息接口
 */
export interface UserMembership {
  userId: string; // 关联的用户ID
  level: MembershipLevel; // 会员等级
  startDate: Date; // 会员开始日期
  endDate: Date; // 会员到期日期
}

/**
 * 会员等级枚举
 */
export enum MembershipLevel {
  FREE = "FREE", // 免费用户
  MEMBER = "MEMBER", // 会员用户
  ADMIN = "ADMIN", // 管理员
}
