import { NextRequest } from 'next/server';
import { UserModel } from '@/model/user';
import { UserStatus } from '@/model/user/type';
import bcrypt from 'bcryptjs';
import { ApiErrors, parseRequestBody, RequestValidator, successResponse, withErrorHandler } from '@/utils/api-helpers';

/**
 * 用户注册
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  // 参数验证
  const useInfo = await parseRequestBody(req);
  RequestValidator.validateRequired(useInfo, ['username', 'password']);
  
  const { username, password, email, phone, nickname } = useInfo;

  // 检查用户名是否已存在
  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    throw ApiErrors.DUPLICATE_ENTRY('用户名已存在');
  }

  // 检查邮箱是否已存在
  if (email) {
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      throw ApiErrors.DUPLICATE_ENTRY('邮箱已被使用');
    }
  }

  // 创建新用户
  const now = new Date();
  
  // 对密码进行哈希处理
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // 创建基本用户信息
  const newUser = {
    username,
    password: hashedPassword,
    email,
    phone,
    nickname,
    status: UserStatus.ACTIVE,
    createdAt: now,
    updatedAt: now,
  };

  const createdUser = await UserModel.create(newUser);

  // 移除密码字段后返回用户信息
  const userResponse = {
    ...createdUser.toObject(),
    password: undefined
  };

  return successResponse({ user: userResponse }, '用户注册成功', 201);
}); 