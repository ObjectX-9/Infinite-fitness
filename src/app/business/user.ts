import { UserStatus, User } from "@/model/user/type";
import { request } from "@/utils/request";

interface UserResponse {
  user: User;
}

interface UserListResponse {
  items: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


class UserBusiness {
  /**
   * 获取用户详情
   */
  async getUserById(userId: string): Promise<User> {
    const response = await request.get<UserResponse>(`users/${userId}`);
    return response.data.user;
  }

  /**
   * 查找用户(通过用户名)
   */
  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const response = await request.get<UserResponse>('users/search', { username });
      return response.data.user;
    } catch {
      // 用户不存在时返回null，不抛出错误
      return null;
    }
  }

  /**
   * 查找用户(通过邮箱)
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await request.get<UserResponse>('users/search', { email });
      return response.data.user;
    } catch {
      // 用户不存在时返回null，不抛出错误
      return null;
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(userId: string, updateData: {
    nickname?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    gender?: 'male' | 'female' | 'other';
    birthdate?: Date;
  }): Promise<User> {
    const response = await request.put<UserResponse>(`users/${userId}`, updateData);
    return response.data.user;
  }

  /**
   * 修改密码
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{success: boolean}> {
    const response = await request.post<{success: boolean}>(`users/${userId}/password`, {
      oldPassword,
      newPassword
    });
    return response.data;
  }

  /**
   * 重置密码
   */
  async resetPassword(email: string): Promise<{success: boolean}> {
    const response = await request.post<{success: boolean}>('auth/reset-password', { email });
    return response.data;
  }

  /**
   * 获取用户分页列表
   */
  async getUserList(options: {
    page?: number;
    limit?: number;
    status?: UserStatus;
    keyword?: string;
  }): Promise<UserListResponse> {
    const response = await request.get<UserListResponse>('users', options);
    return response.data;
  }

  /**
   * 删除用户(逻辑删除)
   */
  async deleteUser(userId: string): Promise<{success: boolean}> {
    const response = await request.delete<{success: boolean}>(`users/${userId}`);
    return response.data;
  }

  /**
   * 更改用户状态
   */
  async changeUserStatus(userId: string, status: UserStatus): Promise<{success: boolean}> {
    const response = await request.patch<{success: boolean}>(`users/${userId}/status`, { 
      status 
    });
    return response.data;
  }
}

export const userBusiness = new UserBusiness();
