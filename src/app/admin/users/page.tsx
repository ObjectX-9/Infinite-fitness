"use client";

import { useEffect, useState } from "react";
import { userBusiness } from "@/app/business/user";
import { membershipBusiness } from "@/app/business/membership";
import { User, UserStatus } from "@/model/user/type";
import { UserMembership, MembershipLevel } from "@/model/user-member/type";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserModal } from "@/components/admin/users/UserModal";
import { UserSearchBar } from "@/components/admin/users/UserSearchBar";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserPagination } from "@/components/admin/users/UserPagination";

/**
 * 用户管理页面：管理系统用户、会员和权限
 * @returns 用户管理页面组件
 */
export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [memberships, setMemberships] = useState<UserMembership[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * 加载用户数据
   */
  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      if (keyword) params.keyword = keyword;
      if (status !== "all") params.status = status;

      const result = await userBusiness.getUserList(params);
      setUsers(result.items);
      setFilteredUsers(result.items);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);

      // 加载所有用户的会员信息
      await loadMembershipInfo(result.items);
    } catch (error) {
      toast.error("获取用户列表失败", {
        description: "请稍后再试或联系管理员",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载会员信息
   * @param userList - 用户列表
   */
  const loadMembershipInfo = async (userList: User[]) => {
    try {
      const membershipsData: UserMembership[] = [];

      // 对每个用户并行请求会员信息
      const membershipPromises = userList.map(async (user) => {
        if (user._id) {
          const membership = await membershipBusiness.getMembershipByUserId(
            user._id
          );
          if (membership) {
            membershipsData.push(membership);
          }
        }
      });



      await Promise.all(membershipPromises);
      setMemberships(membershipsData);
    } catch (error) {
      console.error("获取会员信息失败:", error);
    }
  };

  const filterUserByKeyword = (users: User[], keyword: string) => {
    if (!keyword) {
      return users;
    } else {
      return users.filter((user) => {
        return user.username?.includes(keyword)
          || user.email?.includes(keyword)
          || user.phone?.includes(keyword)
      });
    }
  };

  const filterUserByStatus = (users: User[], status: UserStatus | "all") => {
    if (status === "all") {
      return users;
    } else {
      return users.filter((user) => {
        return user.status === status;
      });
    }
  };

  const dealFilterUser = (keyword: string, status: UserStatus | "all") => {
    const filteredUsersByKeyword = filterUserByKeyword(users, keyword);
    const filteredUsersByStatus = filterUserByStatus(filteredUsersByKeyword, status);
    setFilteredUsers(filteredUsersByStatus);
    setTotal(filteredUsersByStatus.length);
    setTotalPages(Math.ceil(filteredUsersByStatus.length / limit));
  };

  /**
   * 搜索用户
   */
  const handleSearch = (keyword: string, status: UserStatus | "all") => {
    setKeyword(keyword);
    setStatus(status);
    dealFilterUser(keyword, status);
  };

  /**
   * 删除用户
   * @param userId - 用户ID
   */
  const handleDelete = async (userId: string) => {
    try {
      await userBusiness.deleteUser(userId);
      toast.success("删除成功", {
        description: "用户已被成功删除",
      });
      loadUsers();
    } catch (error) {
      toast.error("删除失败", {
        description: "无法删除用户，请稍后再试",
      });
      console.error(error);
    }
  };

  /**
   * 获取状态标签变体
   * @param status - 用户状态
   * @returns 状态标签变体
   */
  const getStatusVariant = (
    status: UserStatus
  ): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "secondary";
      case UserStatus.INACTIVE:
        return "secondary";
      case UserStatus.LOCKED:
        return "destructive";
      default:
        return "default";
    }
  };

  /**
   * 获取会员信息展示
   * @param userId - 用户ID
   * @returns 会员信息展示组件
   */
  const getMembershipInfo = (userId: string) => {
    const membership = memberships.find((item) => item.userId === userId);
    if (!membership) {
      return <Badge
        variant="secondary"
        className="bg-gray-100 text-gray-800 border-gray-300"
      >
        非会员
      </Badge>;
    }

    if (membership.level === MembershipLevel.FREE) {
      return <Badge
        variant="secondary"
        className="bg-gray-100 text-gray-800 border-gray-300"
      >
        免费用户
      </Badge>;
    }

    // 检查会员是否有效
    const now = new Date();
    const endDate = new Date(membership.endDate);
    const isActive = endDate > now;

    if (!isActive) {
      return <Badge
        variant="secondary"
        className="bg-red-100 text-red-800 border-red-300"
      >
        已过期
      </Badge>;
    }


    // 管理员和普通会员统一只显示会员信息和到期日期
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-400"
        >
          会员
        </Badge>
      </div>
    );
  };

  /**
   * 获取会员到期时间
   * @param userId - 用户ID
   * @returns 会员到期时间
   */
  const getMembershipEndDate = (userId: string) => {
    const membership = memberships.find((item) => item.userId === userId);
    if (!membership) {
      return "-";
    }
    return new Date(membership.endDate).toLocaleDateString();
  };

  /**
   * 判断用户是否为管理员
   * @param userId - 用户ID
   * @returns 是否为管理员
   */
  const checkoutIsAdmin = (userId: string) => {
    const membership = memberships.find((item) => item.userId === userId);
    return membership?.level === MembershipLevel.ADMIN;
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>用户管理</CardTitle>
              <CardDescription>管理系统中的所有用户账户</CardDescription>
            </div>
            <UserModal onSuccess={() => loadUsers()} />
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索区域 */}
          <UserSearchBar
            keyword={keyword}
            status={status}
            onSearch={handleSearch}
          />

          {/* 用户表格 */}
          <UserTable
            users={filteredUsers}
            membersShip={memberships}
            loading={loading}
            total={total}
            getStatusVariant={getStatusVariant}
            getMembershipInfo={getMembershipInfo}
            getMembershipEndDate={getMembershipEndDate}
            checkoutIsAdmin={checkoutIsAdmin}
            handleDelete={handleDelete}
            loadUsers={loadUsers}
          />

          {/* 分页 */}
          <UserPagination
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalPages={totalPages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
