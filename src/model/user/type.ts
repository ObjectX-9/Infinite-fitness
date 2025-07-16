/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = "ACTIVE", // 正常
  INACTIVE = "INACTIVE", // 未激活
  LOCKED = "LOCKED", // 锁定
}

/**
 * 用户基本信息接口
 */
export interface User {
  _id: string;
  username: string; // 用户名
  nickname?: string; // 昵称
  avatar?: string; // 头像URL
  email?: string; // 邮箱
  phone?: string; // 手机号
  password: string; // 密码(加密后)
  gender?: "male" | "female" | "other"; // 性别
  birthdate?: Date; // 出生日期
  status: UserStatus; // 用户状态
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
  lastLoginAt?: Date; // 最后登录时间
}
