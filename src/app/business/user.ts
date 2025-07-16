import { UserStatus, User } from "@/model/user/type";
import { request } from "@/utils/request";
import { membershipBusiness } from "./membership";

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
   * 更新用户信息
   */
  async updateUser(
    userId: string,
    updateData: Partial<User>
  ): Promise<User> {
    const response = await request.put<UserResponse>(
      `users`,
      {
        userId,
        ...updateData,
      }
    );
    return response.data.user;
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
    const response = await request.get<UserListResponse>("users", options);
    return response.data;
  }

  /**
   * 删除用户(逻辑删除)
   */
  async deleteUser(userId: string): Promise<{ success: boolean }> {
    // 删除用户时，删除用户会员信息
    await membershipBusiness.deleteMembership(userId);
    // 删除用户
    const response = await request.delete<{ success: boolean }>(`users`, {
      params: {
        userId,
      },
    });
    return response.data;
  }

  /**
   * 更改用户状态
   */
  async changeUserStatus(
    userId: string,
    status: UserStatus
  ): Promise<{ success: boolean }> {
    const response = await request.patch<{ success: boolean }>(
      `users/${userId}/status`,
      {
        status,
      }
    );
    return response.data;
  }
}

export const userBusiness = new UserBusiness();
