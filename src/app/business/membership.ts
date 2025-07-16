import { MembershipLevel, UserMembership } from "@/model/user-member/type";
import { request } from "@/utils/request";

interface MembershipResponse {
  membership: UserMembership;
}

interface MembershipListResponse {
  items: UserMembership[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class MembershipBusiness {
  /**
   * 获取指定用户的会员信息
   */
  async getMembershipByUserId(userId: string): Promise<UserMembership | null> {
    try {
      const response = await request.get<MembershipListResponse>(
        `memberships`,
        { userId }
      );
      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 创建会员信息
   */
  async createMembership(membershipData: Partial<UserMembership>): Promise<UserMembership> {
    const response = await request.post<MembershipResponse>(
      "memberships",
      membershipData
    );
    return response.data.membership;
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
      const response = await request.put<MembershipResponse>(
        "memberships",
        membershipData
      );
      return response?.data?.membership;
    } else {
      // 如果不存在会员信息，则创建
      const response = await request.post<MembershipResponse>(
        "memberships",
        membershipData
      );
      return response.data.membership;
    }
  }
}

export const membershipBusiness = new MembershipBusiness();
