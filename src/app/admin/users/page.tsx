"use client";

import { useState, useEffect } from "react";
import { userBusiness } from "@/app/business/user";
import { membershipBusiness } from "@/app/business/membership";
import { User, UserStatus } from "@/model/user/type";
import { UserMembership, MembershipLevel } from "@/model/user-member/type";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Edit, MoreVertical } from "lucide-react";
import { UserModal } from "@/components/admin/users/UserModal";

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

  // 加载用户数据
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

  // 加载会员信息
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

  // 搜索用户
  const handleSearch = () => {
    setPage(1); // 搜索时重置页码
    loadUsers();
  };

  // 删除用户
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

  // 修改用户状态
  const openStatusDialog = (user: User) => {
    setCurrentUser(user);
    setNewStatus(user.status);
    setShowStatusDialog(true);
  };

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

  // 设置/取消管理员权限
  const openAdminDialog = (userId: string, isCurrentlyAdmin: boolean) => {
    setSelectedUserId(userId);
    setIsSettingAdmin(!isCurrentlyAdmin); // 如果当前是管理员，则操作为取消管理员
    setShowAdminDialog(true);
  };

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
        userId: user._id.toString(), // 确保是字符串
        level: newLevel,
        startDate: now,
        endDate: endDate,
      };

      console.log("提交会员数据:", membershipData);

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

  // 获取状态标签变体
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

  // 获取会员信息展示
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

  // 判断用户是否为管理员
  const isAdmin = (userId: string) => {
    const membership = memberships[userId];
    return membership && membership.level === MembershipLevel.ADMIN;
  };

  // 生成分页项
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5; // 最多显示5个页码

    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // 第一页
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
        </PaginationItem>
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // 页码
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // 最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // 生成用户名称首字母
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
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
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户名、邮箱或电话"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-8"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value: UserStatus | "all") => setStatus(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value={UserStatus.ACTIVE}>正常</SelectItem>
                <SelectItem value={UserStatus.INACTIVE}>未激活</SelectItem>
                <SelectItem value={UserStatus.LOCKED}>已锁定</SelectItem>
                <SelectItem value={UserStatus.DELETED}>已删除</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>搜索</Button>
          </div>

          {/* 用户表格 */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>电话</TableHead>
                  <TableHead>会员</TableHead>
                  <TableHead>管理员</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      正在加载数据...
                    </TableCell>
                  </TableRow>
                ) : users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      暂无用户数据
                    </TableCell>
                  </TableRow>
                ) : (
                  users?.map((user) => (
                    <TableRow key={user._id?.toString()}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback>
                              {getInitials(user.nickname || user.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.nickname || user.username}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email || "-"}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>{getMembershipInfo(user._id || "")}</TableCell>
                      <TableCell>
                        {isAdmin(user._id || "") ? (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 border-yellow-300"
                          >
                            是
                          </Badge>
                        ) : (
                          <span className="text-gray-400">否</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() =>
                            openAdminDialog(
                              user._id || "",
                              isAdmin(user._id || "")
                            )
                          }
                        >
                          {isAdmin(user._id || "") ? "取消" : "设置"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">操作</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/${user._id}`}>
                                <Edit className="mr-2 h-4 w-4" /> 编辑
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openStatusDialog(user)}
                            >
                              修改状态
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive"
                                >
                                  删除用户
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    确定要删除此用户吗？
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    删除后将无法恢复，用户数据将被标记为已删除状态。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDelete(user._id?.toString() || "")
                                    }
                                  >
                                    确认删除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableCaption>共 {total} 条记录</TableCaption>
            </Table>
          </div>

          {/* 分页 */}
          <div className="mt-4 flex justify-between">
            <div className="flex items-center gap-2">
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(parseInt(value))}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  aria-disabled={page === 1}
                />
                {renderPaginationItems()}
                <PaginationNext
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  aria-disabled={page === totalPages}
                />
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* 修改状态的弹窗 */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改用户状态</DialogTitle>
            <DialogDescription>
              更改用户 {currentUser?.username} 的状态
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-status" className="text-right">
                当前状态
              </Label>
              <div className="col-span-3">
                {currentUser && (
                  <Badge variant={getStatusVariant(currentUser.status)}>
                    {currentUser.status}
                  </Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-status" className="text-right">
                新状态
              </Label>
              <Select
                value={newStatus}
                onValueChange={(value: UserStatus) => setNewStatus(value)}
              >
                <SelectTrigger className="col-span-3" id="new-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserStatus.ACTIVE}>正常</SelectItem>
                  <SelectItem value={UserStatus.INACTIVE}>未激活</SelectItem>
                  <SelectItem value={UserStatus.LOCKED}>已锁定</SelectItem>
                  <SelectItem value={UserStatus.DELETED}>已删除</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              取消
            </Button>
            <Button onClick={handleStatusChange}>确认修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 设置/取消管理员的弹窗 */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isSettingAdmin ? "设置为管理员" : "取消管理员权限"}
            </DialogTitle>
            <DialogDescription>
              {isSettingAdmin
                ? "确定要将该用户设置为系统管理员吗？管理员拥有所有系统权限。"
                : "确定要取消该用户的管理员权限吗？"}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdminDialog(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              onClick={handleAdminChange}
              disabled={loading}
              variant={isSettingAdmin ? "default" : "destructive"}
            >
              {loading ? "处理中..." : isSettingAdmin ? "确认设置" : "确认取消"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
