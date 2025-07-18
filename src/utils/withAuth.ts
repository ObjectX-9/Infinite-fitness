import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

/**
 * 用户信息接口定义
 */
export interface UserInfo {
  userId: string;
  username: string;
  membershipLevel: string;
}

/**
 * 不需要进行token校验的路径白名单
 */
export const AUTH_WHITELIST = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

/**
 * 检查请求路径是否在白名单中
 * @param path 请求路径
 * @returns 是否在白名单中
 */
export function isInWhitelist(path: string): boolean {
  return AUTH_WHITELIST.some(whitePath => path.startsWith(whitePath));
}

/**
 * 解析JWT令牌并提取用户信息
 * @param req 请求对象
 * @returns 用户信息或null
 */
export async function withAuth(req: NextRequest): Promise<UserInfo | null> {
  try {
    // 获取请求路径
    const path = req.nextUrl.pathname;
    
    // 检查是否在白名单中
    if (isInWhitelist(path)) {
      // 白名单路径不需要验证token
      return null;
    }
    
    // 从请求头中获取Authorization
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // 如果没有token或格式不正确，抛出错误
      throw new Error("未提供有效的Authorization令牌");
    }
    
    // 提取token
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET 

    if (!secret) {
      throw new Error("JWT_SECRET 未配置");
    }
    
    try {
      // 验证并解析token
      const decoded = jwt.verify(token, secret) as {
        userId: string;
        username: string;
        membershipLevel: string;
      };

      // 直接使用token中的信息，不再调用业务层方法
      return {
        userId: decoded.userId,
        username: decoded.username,
        membershipLevel: decoded.membershipLevel
      };
      
    } catch (jwtError) {
      // JWT验证失败
      console.error("Token验证失败:", jwtError);
      return null;
    }
  } catch (error) {
    // 其他错误
    console.error("授权处理过程中发生错误:", error);
    return null;
  }
}

/**
 * 验证用户是否具有特定角色
 * @param userInfo 用户信息
 * @param roles 允许的角色列表
 * @returns 是否有权限
 */
export function checkRole(userInfo: UserInfo | null, roles: string[]): boolean {
  // 如果没有用户信息，表示未登录
  if (!userInfo) {
    return false;
  }
  
  // 检查用户角色是否在允许的角色列表中
  return roles.includes(userInfo.membershipLevel);
}
