import React, { useState } from "react";
import { User, UserStatus } from "@/model/user/type";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserEditModal } from "./UserEditModal";
import { MembershipLevel, UserMembership } from "@/model/user-member/type";

/**
 * 用户表格组件：展示用户列表和操作按钮
 * @param props - 组件属性
 * @returns 用户表格组件
 */
interface UserTableProps {
  users: User[];
  membersShip: UserMembership[];
  loading: boolean;
  total: number;
  getStatusVariant: (status: UserStatus) => "default" | "destructive" | "outline" | "secondary";
  getMembershipInfo: (userId: string) => React.ReactNode;
  getMembershipEndDate: (userId: string) => string;
  checkoutIsAdmin: (userId: string) => boolean;
  handleDelete: (userId: string) => Promise<void>;
  loadUsers: () => void;
}

export function UserTable({
  users,
  membersShip,
  loading,
  total,
  getStatusVariant,
  getMembershipInfo,
  getMembershipEndDate,
  checkoutIsAdmin,
  handleDelete,
  loadUsers
}: UserTableProps) {
  // 用于控制编辑弹窗的状态
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<UserMembership | null>(null);

  /**
   * 生成用户名称首字母
   * @param name - 用户名称
   * @returns 用户名称的首字母
   */
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  /**
   * 打开编辑用户弹窗
   * @param user - 要编辑的用户
   */
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setSelectedMembership(getMembership(user._id));
    setEditModalOpen(true);
  };

  const getMembership = (userId: string) => {
    if (!membersShip) {
      return null;
    }
    const membership = membersShip?.find((item) => item.userId === userId);
    if (!membership) { 
      return {
        level: MembershipLevel.FREE,
        startDate: new Date(),
        endDate: new Date(),
      } as UserMembership;
    }
    return membership;
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
            <TableHead>到期时间</TableHead>
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
              <TableRow key={user._id}>
                {/* 头像 */}
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>
                        {getInitials(user.nickname || user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-600">
                        {user.username}
                      </div>
                    </div>
                  </div>
                </TableCell>
                {/* 邮箱 */}
                <TableCell>{user.email || "-"}</TableCell>
                {/* 电话 */}
                <TableCell>{user.phone || "-"}</TableCell>
                {/* 会员 */}
                <TableCell>{getMembershipInfo(user._id || "")}</TableCell>
                {/* 到期时间 */}
                <TableCell>{getMembershipEndDate(user._id || "")}</TableCell>
                {/* 管理员 */}
                <TableCell>
                  {checkoutIsAdmin(user._id || "") ? (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-300"
                    >
                      是
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800 border-gray-300"
                    >
                      否
                    </Badge>
                  )}
                </TableCell>
                {/* 状态 */}
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                {/* 注册时间 */}
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                {/* 操作 */}
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0"
                    onClick={() => openEditModal(user)}
                  >
                    <Edit className="h-2 w-3 mr-1 text-gray-600" />
                    <span className="text-sm text-gray-600">编辑</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableCaption>共 {total} 条记录</TableCaption>
      </Table>

      {/* 用户编辑弹窗 */}
      {selectedUser && selectedMembership && (
        <UserEditModal
          user={selectedUser}
          membership={selectedMembership}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSuccess={() => {
            loadUsers();
            setEditModalOpen(false);
          }}
          handleDelete={handleDelete}
          getMembershipInfo={getMembershipInfo}
          getMembershipEndDate={getMembershipEndDate}
        />
      )}
    </div>
  );
} 