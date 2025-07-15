import { NextRequest } from 'next/server';
import { UserModel } from '@/model/user';
import { ApiErrors, withErrorHandler, paginatedResponse } from '@/utils/api-helpers';

/**
 * 获取所有用户列表
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // 参数验证
    if (page < 1 || limit < 1) {
      throw ApiErrors.BAD_REQUEST('页码和每页数量必须为大于0的数字');
    }
    
    console.log('准备查询用户列表，参数:', { page, limit, skip });
    
    const users = await UserModel.find()
      .sort({ 'user.createdAt': -1 })
      .skip(skip)
      .limit(limit);
    
    console.log('查询成功，找到用户数:', users);

    const total = await UserModel.countDocuments();

    return paginatedResponse(
      users,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      },
      '获取用户列表成功'
    );
  } catch (error) {
    console.error('获取用户列表出错:', error);
    throw error;
  }
});
