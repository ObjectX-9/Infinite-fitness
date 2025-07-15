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
   * 创建或更新会员信息
   */
  async createOrUpdateMembership(membershipData: {
    userId: string;
    level: MembershipLevel;
    startDate: Date;
    endDate: Date;
  }): Promise<UserMembership> {
    const response = await request.post<MembershipResponse>(
      "memberships",
      membershipData
    );
    return response.data.membership;
  }

  /**
   * 获取会员列表
   */
  async getMembershipList(options: {
    page?: number;
    limit?: number;
    userId?: string;
  }): Promise<MembershipListResponse> {
    const response = await request.get<MembershipListResponse>(
      "memberships",
      options
    );
    return response.data;
  }

  /**
   * 检查用户会员是否有效
   */
  async checkActiveMembership(userId: string): Promise<boolean> {
    try {
      const membership = await this.getMembershipByUserId(userId);
      if (!membership) {
        return false;
      }

      // 检查会员级别非免费且未过期
      const now = new Date();
      return (
        membership.level !== MembershipLevel.FREE &&
        new Date(membership.endDate) > now
      );
    } catch {
      return false;
    }
  }

  /**
   * 延长会员有效期
   */
  async extendMembership(
    userId: string,
    months: number
  ): Promise<UserMembership> {
    const membership = await this.getMembershipByUserId(userId);
    const now = new Date();

    let startDate: Date;
    let endDate: Date;

    if (membership && new Date(membership.endDate) > now) {
      // 如果现有会员未过期，从原到期日开始延长
      startDate = new Date(membership.startDate);
      endDate = new Date(membership.endDate);
      endDate.setMonth(endDate.getMonth() + months);
    } else {
      // 如果不存在会员或已过期，从当前日期开始计算
      startDate = now;
      endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + months);
    }

    return this.createOrUpdateMembership({
      userId,
      level: MembershipLevel.MEMBER, // 默认为普通会员
      startDate,
      endDate,
    });
  }
}

export const membershipBusiness = new MembershipBusiness();
