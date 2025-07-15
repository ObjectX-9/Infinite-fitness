'use client';

import { useState, useEffect } from 'react';
import { userBusiness } from '@/app/business/user';
import { User, UserStatus } from '@/model/user/type';
import Link from 'next/link';
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
import { UserModal } from '@/components/UserModal';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  console.log('✅ ✅ ✅ ~  UserManagement ~  users:', users);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<UserStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newStatus, setNewStatus] = useState<UserStatus>(UserStatus.ACTIVE);

  // 加载用户数据
  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      if (keyword) params.keyword = keyword;
      if (status !== 'all') params.status = status;

      const result = await userBusiness.getUserList(params);
      setUsers(result.items);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      toast.error("获取用户列表失败", {
        description: "请稍后再试或联系管理员"
      });
      console.error(error);
    } finally {
      setLoading(false);
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
        description: "用户已被成功删除"
      });
      loadUsers();
    } catch (error) {
      toast.error("删除失败", {
        description: "无法删除用户，请稍后再试"
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
        description: "用户状态已成功更新"
      });
      setShowStatusDialog(false);
      loadUsers();
    } catch (error) {
      toast.error("状态更新失败", {
        description: "无法更新用户状态，请稍后再试"
      });
      console.error(error);
    }
  };

  // 获取状态标签变体
  const getStatusVariant = (status: UserStatus): "default" | "destructive" | "outline" | "secondary" => {
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
          <PaginationLink 
            isActive={page === i} 
            onClick={() => setPage(i)}
          >
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-8"
              />
            </div>
            <Select value={status} onValueChange={(value: UserStatus | 'all') => setStatus(value)}>
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
                            <AvatarFallback>{getInitials(user.nickname || user.username)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.nickname || user.username}</div>
                            <div className="text-xs text-muted-foreground">{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email || "-"}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      
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
                            <DropdownMenuItem onClick={() => openStatusDialog(user)}>
                              修改状态
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                  删除用户
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>确定要删除此用户吗？</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    删除后将无法恢复，用户数据将被标记为已删除状态。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(user._id?.toString() || "")}>
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
              <TableCaption>
                共 {total} 条记录
              </TableCaption>
            </Table>
          </div>

          {/* 分页 */}
          <div className="mt-4 flex justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">每页显示:</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
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
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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
              <Select value={newStatus} onValueChange={(value: UserStatus) => setNewStatus(value)}>
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
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              取消
            </Button>
            <Button onClick={handleStatusChange}>确认修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}