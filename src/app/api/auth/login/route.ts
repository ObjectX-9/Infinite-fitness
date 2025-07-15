import { NextRequest } from 'next/server';
import { UserModel } from '@/model/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiErrors, successResponse, withErrorHandler, parseRequestBody, RequestValidator } from '@/utils/api-helpers';

/**
 * 用户登录
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  // 参数验证
  const useInfo = await parseRequestBody(req);

  RequestValidator.validateRequired(useInfo, ['username', 'password']);
  
  const { username, password } = useInfo;

  // 查找用户
  const user = await UserModel.findOne({ username });
  
  // 用户不存在
  if (!user) {
    throw ApiErrors.UNAUTHORIZED('用户名或密码错误');
  }

  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw ApiErrors.UNAUTHORIZED('用户名或密码错误');
  }

  // 生成JWT令牌
  const secret = process.env.JWT_SECRET || 'your-default-secret';
  const token = jwt.sign(
    { 
      userId: user._id,
      username: user.username,
      role: user.role || 'user'
    }, 
    secret, 
    { expiresIn: '7d' }
  );

  // 更新最后登录时间
  await UserModel.findByIdAndUpdate(user._id, { 
    $set: { lastLoginAt: new Date() } 
  });

  return successResponse({
    token,
    user: {
      _id: user._id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      email: user.email,
      phone: user.phone,
      status: user.status,
    }
  }, '登录成功');
}); 