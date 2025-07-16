"use client";

import { useState, useEffect } from "react";
import { User, UserStatus } from "@/model/user/type";
import { MembershipLevel, UserMembership } from "@/model/user-member/type";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { userBusiness } from "@/app/business/user";
import { membershipBusiness } from "@/app/business/membership";
import { 
  isValidEmail, 
  isValidChinaPhone, 
  isEmpty 
} from "@/utils/dataVerify";

/**
 * 用户编辑弹窗属性接口
 */
interface UserEditModalProps {
  user: User;
  membership: UserMembership;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  handleDelete: (userId: string) => Promise<void>;
  getMembershipInfo?: (userId: string) => React.ReactNode;
  getMembershipEndDate?: (userId: string) => string;
}

/**
 * 用户编辑弹窗组件：支持修改用户基本信息、会员信息以及删除功能
 * @param props - 组件属性
 * @returns 用户编辑弹窗组件
 */
export function UserEditModal({
  user,
  membership,
  open,
  onOpenChange,
  onSuccess,
  handleDelete,
  getMembershipInfo,
  getMembershipEndDate
}: UserEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // 用户基本信息表单数据
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    email: "",
    phone: "",
    status: UserStatus.ACTIVE as UserStatus,
  });

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<{
    email?: string | null;
    phone?: string | null;
  }>({});

  // 会员信息表单数据
  const [membershipData, setMembershipData] = useState({
    level: membership.level as MembershipLevel,
    duration: new Date(membership.endDate).getTime() - new Date(membership.startDate).getTime(), // 会员时长（月）
  });

  // 会员表单错误状态
  const [membershipErrors, setMembershipErrors] = useState<{
    duration?: string | null;
  }>({});

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        nickname: user.nickname || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || UserStatus.ACTIVE,
      });
    }
  }, [user]);

  /**
   * 验证基本信息字段
   * @param field - 字段名
   * @param value - 字段值
   * @returns 错误信息，无错误返回null
   */
  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case "email":
        if (!isEmpty(value) && !isValidEmail(value)) 
          return "邮箱格式不正确";
        return null;
      case "phone":
        if (!isEmpty(value) && !isValidChinaPhone(value)) 
          return "请输入正确的手机号码";
        return null;
      default:
        return null;
    }
  };

  /**
   * 验证会员字段
   * @param field - 字段名
   * @param value - 字段值
   * @param level - 当前会员等级
   * @returns 错误信息，无错误返回null
   */
  const validateMembershipField = (
    field: string, 
    value: number, 
    level: MembershipLevel
  ): string | null => {
    switch (field) {
      case "duration":
        if (level === MembershipLevel.MEMBER && (!value || value <= 0)) 
          return "会员时长必须大于0";
        return null;
      default:
        return null;
    }
  };

  /**
   * 处理基本信息字段变更
   * @param field - 表单字段名
   * @param value - 表单字段值
   */
  const handleChange = (field: string, value: string) => {
    // 验证字段
    if (field === "email" || field === "phone") {
      const errorMessage = validateField(field, value);
      
      // 更新错误状态
      setFormErrors(prev => ({
        ...prev,
        [field]: errorMessage
      }));
    }
    
    // 更新表单数据
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * 处理会员信息字段变更
   * @param field - 会员字段名
   * @param value - 会员字段值
   */
  const handleMembershipChange = (
    field: "level" | "duration",
    value: MembershipLevel | number
  ) => {
    // 验证会员时长
    if (field === "duration" && typeof value === "number") {
      const errorMessage = validateMembershipField(
        "duration", 
        value, 
        membershipData.level
      );
      
      // 更新错误状态
      setMembershipErrors(prev => ({
        ...prev,
        duration: errorMessage
      }));
    }
    
    // 如果更改了会员级别，也需要检查时长
    if (field === "level" && value === MembershipLevel.MEMBER) {
      const errorMessage = validateMembershipField(
        "duration", 
        membershipData.duration, 
        value as MembershipLevel
      );
      
      setMembershipErrors(prev => ({
        ...prev,
        duration: errorMessage
      }));
    }
    
    // 更新表单数据
    setMembershipData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * 验证基本信息表单
   * @returns 表单是否有效
   */
  const validateBasicForm = (): boolean => {
    const errors: Record<string, string | null> = {};
    
    // 验证非空字段
    if (!isEmpty(formData.email)) {
      errors.email = validateField("email", formData.email);
    }
    
    if (!isEmpty(formData.phone)) {
      errors.phone = validateField("phone", formData.phone);
    }
    
    setFormErrors(errors);
    
    // 检查是否有错误
    return !Object.values(errors).some(error => error !== null);
  };

  /**
   * 验证会员信息表单
   * @returns 表单是否有效
   */
  const validateMembershipForm = (): boolean => {
    const errors: Record<string, string | null> = {};
    
    // 只在会员级别为普通会员时验证时长
    if (membershipData.level === MembershipLevel.MEMBER) {
      errors.duration = validateMembershipField(
        "duration", 
        membershipData.duration, 
        membershipData.level
      );
    }
    
    setMembershipErrors(errors);
    
    // 检查是否有错误
    return !Object.values(errors).some(error => error !== null);
  };

  /**
   * 提交更新用户基本信息
   */
  const handleUpdateBasicInfo = async () => {
    if (!user._id) {
      toast.error("用户ID无效");
      return;
    }

    // 验证表单
    if (!validateBasicForm()) {
      toast.error("表单验证失败", {
        description: "请检查表单中的错误信息",
      });
      return;
    }

    setLoading(true);
    try {
      await userBusiness.updateUser(user._id, {
        username: formData.username,
        nickname: formData.nickname,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
      });

      toast.success("用户信息更新成功");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("更新用户信息失败:", error);
      toast.error("更新用户信息失败", {
        description: "请检查表单信息并重试",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 提交更新会员信息
   */
  const handleUpdateMembership = async () => {
    if (!user._id) {
      toast.error("用户ID无效");
      return;
    }

    // 验证表单
    if (!validateMembershipForm()) {
      toast.error("表单验证失败", {
        description: "请检查表单中的错误信息",
      });
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      let endDate: Date;

      // 管理员设置长期有效期（10年）
      if (membershipData.level === MembershipLevel.ADMIN) {
        const adminEndDate = new Date(now);
        adminEndDate.setFullYear(now.getFullYear() + 10); // 管理员默认10年有效期
        endDate = adminEndDate;
      } else if (membershipData.level === MembershipLevel.MEMBER) {
        // 普通会员需要检查时长是否设置
        if (membershipData.duration <= 0) {
          throw new Error("普通会员必须设置会员时长");
        }
        const memberEndDate = new Date(now);
        memberEndDate.setMonth(now.getMonth() + membershipData.duration);
        endDate = memberEndDate;
      } else {
        // 免费用户设置结束时间为当前时间
        endDate = now;
      }

      await membershipBusiness.updateMembership({
        userId: user._id,
        level: membershipData.level,
        startDate: now,
        endDate: endDate,
      });

      toast.success("会员信息更新成功");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("更新会员信息失败:", error);
      toast.error("更新会员信息失败", {
        description: error instanceof Error ? error.message : "请检查表单信息并重试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>编辑用户 - {user?.username}</DialogTitle>
          <DialogDescription>修改用户信息，会员信息或删除用户</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="membership">会员信息</TabsTrigger>
          </TabsList>

          {/* 基本信息表单 */}
          <TabsContent value="basic">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  用户名
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nickname" className="text-right">
                  昵称
                </Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => handleChange("nickname", e.target.value)}
                  className="col-span-3"
                  placeholder="请输入昵称"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  邮箱
                </Label>
                <div className="col-span-3">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={formErrors.email ? "border-red-500" : ""}
                    placeholder="请输入邮箱"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  电话
                </Label>
                <div className="col-span-3">
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={formErrors.phone ? "border-red-500" : ""}
                    placeholder="请输入电话号码"
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  状态
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: UserStatus) =>
                    handleChange("status", value)
                  }
                >
                  <SelectTrigger className="col-span-3" id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserStatus.ACTIVE}>正常</SelectItem>
                    <SelectItem value={UserStatus.INACTIVE}>未激活</SelectItem>
                    <SelectItem value={UserStatus.LOCKED}>已锁定</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button 
                onClick={handleUpdateBasicInfo} 
                disabled={loading}
              >
                {loading ? "保存中..." : "保存修改"}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* 会员信息表单 */}
          <TabsContent value="membership">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current-level" className="text-right">
                  当前会员
                </Label>
                <div className="col-span-3">
                  {getMembershipInfo ? getMembershipInfo(user._id) : "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right">
                  到期时间
                </Label>
                <div className="col-span-3">
                  {getMembershipEndDate ? getMembershipEndDate(user._id) : "-"}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="membership-level" className="text-right">
                  会员等级
                </Label>
                <Select
                  value={membershipData.level}
                  onValueChange={(value: MembershipLevel) =>
                    handleMembershipChange("level", value)
                  }
                >
                  <SelectTrigger className="col-span-3" id="membership-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MembershipLevel.FREE}>免费用户</SelectItem>
                    <SelectItem value={MembershipLevel.MEMBER}>普通会员</SelectItem>
                    <SelectItem value={MembershipLevel.ADMIN}>管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {membershipData.level === MembershipLevel.MEMBER && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    时间(月)
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={membershipData.duration}
                      onChange={(e) => handleMembershipChange("duration", parseInt(e.target.value) || 0)}
                      className={membershipErrors.duration ? "border-red-500" : ""}
                      placeholder="请输入会员时长（月）"
                    />
                    {membershipErrors.duration && (
                      <p className="text-xs text-red-500 mt-1">{membershipErrors.duration}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button 
                onClick={handleUpdateMembership} 
                disabled={loading}
              >
                {loading ? "保存中..." : "保存修改"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center border-t pt-4 mt-4">
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">删除用户</Button>
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
                  <AlertDialogAction
                    onClick={() => {
                      handleDelete(user._id?.toString() || "");
                      onOpenChange(false);
                    }}
                  >
                    确认删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 