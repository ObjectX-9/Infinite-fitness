"use client";

import { useState } from "react";
import { UserStatus } from "@/model/user/type";
import { MembershipLevel } from "@/model/user-member/type";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlus } from "lucide-react";
import { loginBusiness } from "@/app/business/login";
import { membershipBusiness } from "@/app/business/membership";
import { 
  isValidEmail, 
  isValidChinaPhone, 
  isValidUsername, 
  isValidPassword,
  isEmpty 
} from "@/utils/dataVerify";

interface UserModalProps {
  onSuccess?: () => void;
}

export function UserModal({ onSuccess }: UserModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    nickname: "",
    status: UserStatus.ACTIVE as UserStatus,
  });

  const [formErrors, setFormErrors] = useState<{
    username?: string | null;
    password?: string | null;
    email?: string | null;
    phone?: string | null;
  }>({});

  const [membershipData, setMembershipData] = useState({
    level: MembershipLevel.FREE as MembershipLevel,
    duration: 0, // 会员时长（月）
  });

  /**
   * 验证表单字段
   * @param field - 字段名
   * @param value - 字段值
   * @returns 错误信息，无错误返回null
   */
  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case "username":
        if (isEmpty(value)) return "用户名不能为空";
        if (!isValidUsername(value)) return "用户名必须以字母开头，只能包含字母、数字和下划线，长度为3-16个字符";
        return null;
      case "password":
        if (isEmpty(value)) return "密码不能为空";
        if (!isValidPassword(value)) return "密码必须包含字母和数字，长度为8-20个字符";
        return null;
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
   * 处理表单字段变更并进行验证
   * @param field - 表单字段名
   * @param value - 表单字段值
   */
  const handleChange = (field: string, value: string) => {
    // 验证字段
    const errorMessage = validateField(field, value);
    
    // 更新错误状态
    setFormErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
    
    // 更新表单数据
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMembershipChange = (
    field: "level" | "duration",
    value: MembershipLevel | number
  ) => {
    setMembershipData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * 验证整个表单
   * @returns 表单是否有效
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string | null> = {};
    
    // 验证必填字段
    errors.username = validateField("username", formData.username);
    errors.password = validateField("password", formData.password);
    
    // 只验证非空字段
    if (formData.email) {
      errors.email = validateField("email", formData.email);
    }
    
    if (formData.phone) {
      errors.phone = validateField("phone", formData.phone);
    }
    
    setFormErrors(errors);
    
    // 检查是否有错误
    return !Object.values(errors).some(error => error !== null);
  };

  const handleSubmit = async () => {
    // 验证表单
    if (!validateForm()) {
      toast.error("表单验证失败", {
        description: "请检查表单中的错误信息",
      });
      return;
    }

    setLoading(true);
    try {
      // 创建用户
      const newUser = await loginBusiness.register(formData);
      // 设置会员信息
      if (membershipData.level !== MembershipLevel.FREE) {
        try {
          const now = new Date();

          // 设置会员有效期
          let endDate: Date;

          // 管理员设置长期有效期（10年）
          if (membershipData.level === MembershipLevel.ADMIN) {
            const adminEndDate = new Date(now);
            adminEndDate.setFullYear(now.getFullYear() + 10); // 管理员默认10年有效期
            endDate = adminEndDate;
          } else {
            // 普通会员需要检查时长是否设置
            if (membershipData.duration <= 0) {
              throw new Error("普通会员必须设置会员时长");
            }
            const memberEndDate = new Date(now);
            memberEndDate.setMonth(now.getMonth() + membershipData.duration);
            endDate = memberEndDate;
          }

          await membershipBusiness.createMembership({
            userId: newUser._id,
            level: membershipData.level,
            startDate: now,
            endDate: endDate,
          });

          toast.success("会员信息设置成功");
        } catch (membershipError) {
          console.error("设置会员信息失败:", membershipError);
          toast.error("会员信息设置失败", {
            description: "用户创建成功，但会员信息设置失败",
          });
        }
      }

      toast.success("用户创建成功", {
        description: "新用户已成功添加到系统",
      });

      setFormData({
        username: "",
        password: "",
        email: "",
        phone: "",
        nickname: "",
        status: UserStatus.ACTIVE,
      });

      setMembershipData({
        level: MembershipLevel.FREE,
        duration: 0,
      });

      setOpen(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("创建用户失败", {
        description: "请检查表单信息并重试",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          新增用户
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增用户</DialogTitle>
          <DialogDescription>创建新用户账号，请填写以下信息</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              用户名 *
            </Label>
            <div className="col-span-3">
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className={formErrors.username ? "border-red-500" : ""}
                placeholder="请输入用户名"
              />
              {formErrors.username && (
                <p className="text-xs text-red-500 mt-1">{formErrors.username}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              密码 *
            </Label>
            <div className="col-span-3">
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={formErrors.password ? "border-red-500" : ""}
                placeholder="请输入密码"
              />
              {formErrors.password && (
                <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
              )}
            </div>
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
                type="tel"
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
              </SelectContent>
            </Select>
          </div>

          {/* 会员信息设置 */}
          <div className="border-t pt-4 mt-2">
            <h3 className="text-sm font-medium mb-2">会员信息设置</h3>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="membershipLevel" className="text-right">
              会员级别
            </Label>
            <Select
              value={membershipData.level}
              onValueChange={(value: MembershipLevel) =>
                handleMembershipChange("level", value)
              }
            >
              <SelectTrigger className="col-span-3" id="membershipLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MembershipLevel.FREE}>免费用户</SelectItem>
                <SelectItem value={MembershipLevel.MEMBER}>会员用户</SelectItem>
                <SelectItem value={MembershipLevel.ADMIN}>管理员</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              会员时长
            </Label>
            <Select
              value={membershipData.duration.toString()}
              onValueChange={(value) =>
                handleMembershipChange("duration", parseInt(value))
              }
              disabled={
                membershipData.level === MembershipLevel.FREE ||
                membershipData.level === MembershipLevel.ADMIN
              }
            >
              <SelectTrigger className="col-span-3" id="duration">
                <SelectValue
                  placeholder={
                    membershipData.level === MembershipLevel.ADMIN
                      ? "管理员无需设置时长"
                      : "选择会员时长"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">不设置</SelectItem>
                <SelectItem value="1">1个月</SelectItem>
                <SelectItem value="3">3个月</SelectItem>
                <SelectItem value="6">6个月</SelectItem>
                <SelectItem value="12">12个月</SelectItem>
              </SelectContent>
            </Select>
            {membershipData.level === MembershipLevel.ADMIN && (
              <div className="col-span-4 text-xs text-right text-muted-foreground mt-1">
                管理员默认设置为10年有效期
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              取消
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "创建中..." : "创建用户"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
