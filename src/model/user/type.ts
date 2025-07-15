/**
 * 会员等级枚举
 */
export enum MembershipLevel {
  FREE = 'FREE',           // 免费用户
  MEMBER = 'MEMBER',       // 会员用户
  ADMIN = 'ADMIN'          // 管理员
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',       // 正常
  INACTIVE = 'INACTIVE',   // 未激活
  LOCKED = 'LOCKED',       // 锁定
  DELETED = 'DELETED'      // 已删除
}

/**
 * 用户基本信息接口
 */
export interface User {
  _id: string;
  username: string;        // 用户名
  nickname?: string;       // 昵称
  avatar?: string;         // 头像URL
  email?: string;          // 邮箱
  phone?: string;          // 手机号
  password: string;        // 密码(加密后)
  gender?: 'male' | 'female' | 'other';  // 性别
  birthdate?: Date;        // 出生日期
  status: UserStatus;      // 用户状态
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 更新时间
  lastLoginAt?: Date;      // 最后登录时间
}

/**
 * 会员信息接口
 */
export interface UserMembership {
  userId: string;          // 关联的用户ID
  level: MembershipLevel;  // 会员等级
  startDate: Date;         // 会员开始日期
  endDate: Date;           // 会员到期日期
  paymentHistory: PaymentRecord[]; // 支付记录
}

/**
 * 支付记录接口
 */
export interface PaymentRecord {
  userId: string;          // 用户ID
  amount: number;          // 支付金额
  currency: string;        // 货币单位
  paymentMethod: string;   // 支付方式
  status: 'pending' | 'completed' | 'failed' | 'refunded'; // 支付状态
  createdAt: Date;         // 创建时间
  membershipLevel: MembershipLevel; // 购买的会员等级
  duration: number;        // 购买时长(月)
}