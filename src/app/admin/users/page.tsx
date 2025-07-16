"use client";

import { useState, useEffect } from "react";
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
import { UserStatusDialog } from "@/components/admin/users/UserStatusDialog";
import { AdminRoleDialog } from "@/components/admin/users/AdminRoleDialog";

/**
 * 用户管理页面：管理系统用户、会员和权限
 * @returns 用户管理页面组件
 */
export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [memberships, setMemberships] = useState<
    Record<string, UserMembership>
  >({});
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newStatus, setNewStatus] = useState<UserStatus>(UserStatus.ACTIVE);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isSettingAdmin, setIsSettingAdmin] = useState(false);

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
      const membershipsData: Record<string, UserMembership> = {};

      // 对每个用户并行请求会员信息
      const membershipPromises = userList.map(async (user) => {
        if (user._id) {
          const membership = await membershipBusiness.getMembershipByUserId(
            user._id
          );
          if (membership) {
            membershipsData[user._id] = membership;
          }
        }
      });

      await Promise.all(membershipPromises);
      setMemberships(membershipsData);
    } catch (error) {
      console.error("获取会员信息失败:", error);
    }
  };

  // 首次加载和参数变化时重新获取数据
  useEffect(() => {
    loadUsers();
  }, [page, limit, status]);

  /**
   * 搜索用户
   */
  const handleSearch = () => {
    setPage(1); // 搜索时重置页码
    loadUsers();
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
   * 打开状态修改弹窗
   * @param user - 要修改的用户
   */
  const openStatusDialog = (user: User) => {
    setCurrentUser(user);
    setNewStatus(user.status);
    setShowStatusDialog(true);
  };

  /**
   * 修改用户状态
   */
  const handleStatusChange = async () => {
    if (!currentUser) return;

    try {
      const userId = currentUser._id;
      await userBusiness.changeUserStatus(userId, newStatus);
      toast.success("状态更新成功", {
        description: "用户状态已成功更新",
      });
      setShowStatusDialog(false);
      loadUsers();
    } catch (error) {
      toast.error("状态更新失败", {
        description: "无法更新用户状态，请稍后再试",
      });
      console.error(error);
    }
  };

  /**
   * 打开管理员权限弹窗
   * @param userId - 用户ID
   * @param isCurrentlyAdmin - 是否当前已是管理员
   */
  const openAdminDialog = (userId: string, isCurrentlyAdmin: boolean) => {
    setSelectedUserId(userId);
    setIsSettingAdmin(!isCurrentlyAdmin); // 如果当前是管理员，则操作为取消管理员
    setShowAdminDialog(true);
  };

  /**
   * 修改管理员权限
   */
  const handleAdminChange = async () => {
    if (!selectedUserId) return;

    setLoading(true);
    try {
      const user = users.find((u) => u._id === selectedUserId);
      if (!user) return;

      const membership = memberships[selectedUserId];
      const now = new Date();
      let endDate = new Date();
      endDate.setFullYear(now.getFullYear() + 10); // 默认设置10年有效期

      if (membership) {
        // 如果已有会员信息，保留原有到期日期
        if (new Date(membership.endDate) > now) {
          endDate = new Date(membership.endDate);
        }
      }

      // 设置新的会员级别
      const newLevel = isSettingAdmin
        ? MembershipLevel.ADMIN
        : MembershipLevel.MEMBER;

      // 确保userId是字符串且有值
      if (!user._id) {
        throw new Error("用户ID无效");
      }

      // 打印出提交的完整数据，检查userId是否正确
      const membershipData = {
        userId: user._id,
        level: newLevel,
        startDate: now,
        endDate: endDate,
      };

      await membershipBusiness.createOrUpdateMembership(membershipData);

      // 刷新会员信息
      await loadUsers();

      toast.success(isSettingAdmin ? "已成功设为管理员" : "已取消管理员权限");
      setShowAdminDialog(false);
    } catch (error) {
      toast.error("操作失败", {
        description: "无法更改管理员权限，请稍后再试",
      });
      console.error("错误详情:", error);
    } finally {
      setLoading(false);
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
      case UserStatus.DELETED:
        return "outline";
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
    const membership = memberships[userId];
    if (!membership) {
      return <span className="text-gray-400">非会员</span>;
    }

    if (membership.level === MembershipLevel.FREE) {
      return <span className="text-gray-400">免费用户</span>;
    }

    // 检查会员是否有效
    const now = new Date();
    const endDate = new Date(membership.endDate);
    const isActive = endDate > now;

    if (!isActive) {
      return <span className="text-gray-400">已过期</span>;
    }

    // 格式化到期日期
    const formattedDate = endDate.toLocaleDateString();

    // 管理员和普通会员统一只显示会员信息和到期日期
    return (
      <div>
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-300"
        >
          会员
        </Badge>
        <div className="text-xs mt-1">到期: {formattedDate}</div>
      </div>
    );
  };

  /**
   * 判断用户是否为管理员
   * @param userId - 用户ID
   * @returns 是否为管理员
   */
  const isAdmin = (userId: string) => {
    const membership = memberships[userId];
    return membership && membership.level === MembershipLevel.ADMIN;
  };

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
            setKeyword={setKeyword}
            status={status}
            setStatus={setStatus}
            onSearch={handleSearch}
          />

          {/* 用户表格 */}
          <UserTable
            users={users}
            loading={loading}
            total={total}
            getStatusVariant={getStatusVariant}
            getMembershipInfo={getMembershipInfo}
            isAdmin={isAdmin}
            handleDelete={handleDelete}
            openStatusDialog={openStatusDialog}
            openAdminDialog={openAdminDialog}
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

      {/* 修改状态的弹窗 */}
      <UserStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        currentUser={currentUser}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onStatusChange={handleStatusChange}
        getStatusVariant={getStatusVariant}
      />

      {/* 设置/取消管理员的弹窗 */}
      <AdminRoleDialog
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
        isSettingAdmin={isSettingAdmin}
        onAdminChange={handleAdminChange}
        loading={loading}
      />
    </div>
  );
}
