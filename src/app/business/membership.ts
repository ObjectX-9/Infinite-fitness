import { MembershipLevel, UserMembership } from "@/model/user-member/type";
import { PaginatedResponse } from "@/utils/api-helpers";
import { request } from "@/utils/request";



class MembershipBusiness {
  /**
   * 获取指定用户的会员信息
   */
  async getMembershipByUserId(userId: string): Promise<UserMembership | null> {
    try {
      const response = await request.get<UserMembership>(`memberships?userId=${userId}`);
      return response.data;
    } catch {
      return null;
    }
  }

  /**
   * 获取会员信息列表
   * @param page 页码
   * @param limit 每页数量
   * @returns 会员信息列表
   */
  async getMembershipList(page: number, limit: number): Promise<PaginatedResponse<UserMembership>> {
    const response = await request.get<PaginatedResponse<UserMembership>>(`memberships?page=${page}&limit=${limit}`);
    return response.data;
  }

  /**
   * 创建会员信息
   */
  async createMembership(membershipData: Partial<UserMembership>): Promise<UserMembership> {
    const response = await request.post<UserMembership>(
      "memberships",
      membershipData
    );
    return response.data;
  }

  async deleteMembership(userId: string): Promise<void> {
    await request.delete(`memberships`, { params: { userId } });
  }

  /**
   * 更新会员信息，若会员信息不存在则创建
   */
  async updateMembership(membershipData: Partial<UserMembership>): Promise<UserMembership> {
    // 检查用户是否已有会员信息
    const existingMembership = await this.getMembershipByUserId(membershipData.userId as string);

    // 如果会员等级为免费，则删除会员信息
    if (membershipData.level === MembershipLevel.FREE) {
      if (existingMembership) {
        await this.deleteMembership(membershipData.userId as string);
      }
      
      return {
        userId: membershipData.userId,
        level: MembershipLevel.FREE,
        startDate: new Date(),
        endDate: new Date(),
      } as UserMembership;
    }

    // 如果已有会员信息则更新，否则创建
    if (existingMembership) {
      const response = await request.put<UserMembership>(
        "memberships",
        membershipData
      );
      return response?.data;
    } else {
      // 如果不存在会员信息，则创建
      const response = await request.post<UserMembership>(
        "memberships",
        membershipData
      );
      return response.data;
    }
  }
}

export const membershipBusiness = new MembershipBusiness();
