import React from "react";
import { User, UserStatus } from "@/model/user/type";
import Link from "next/link";
import { Edit, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

/**
 * 用户表格组件：展示用户列表和操作按钮
 * @param props - 组件属性
 * @returns 用户表格组件
 */
interface UserTableProps {
  users: User[];
  loading: boolean;
  total: number;
  getStatusVariant: (status: UserStatus) => "default" | "destructive" | "outline" | "secondary";
  getMembershipInfo: (userId: string) => React.ReactNode;
  isAdmin: (userId: string) => boolean;
  handleDelete: (userId: string) => Promise<void>;
  openStatusDialog: (user: User) => void;
  openAdminDialog: (userId: string, isCurrentlyAdmin: boolean) => void;
}

export function UserTable({
  users,
  loading,
  total,
  getStatusVariant,
  getMembershipInfo,
  isAdmin,
  handleDelete,
  openStatusDialog,
  openAdminDialog,
}: UserTableProps) {
  /**
   * 生成用户名称首字母
   * @param name - 用户名称
   * @returns 用户名称的首字母
   */
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
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
              <TableCell colSpan={8} className="text-center py-10">
                正在加载数据...
              </TableCell>
            </TableRow>
          ) : users?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
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
  );
} 