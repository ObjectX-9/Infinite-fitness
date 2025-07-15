"use client"

import { useState } from 'react';
import { UserStatus } from '@/model/user/type';
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
import { loginBusiness } from '@/app/business/login';

interface UserModalProps {
  onSuccess?: () => void;
}

export function UserModal({ onSuccess }: UserModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    nickname: '',
    status: UserStatus.ACTIVE as UserStatus,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      toast.error("请填写必填字段", {
        description: "用户名和密码为必填项"
      });
      return;
    }

    setLoading(true);
    try {
      await loginBusiness.register(formData);
      
      toast.success("用户创建成功", {
        description: "新用户已成功添加到系统"
      });
      
      setFormData({
        username: '',
        password: '',
        email: '',
        phone: '',
        nickname: '',
        status: UserStatus.ACTIVE
      });
      
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("创建用户失败", {
        description: "请检查表单信息并重试"
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
          <DialogDescription>
            创建新用户账号，请填写以下信息
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              用户名 *
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="col-span-3"
              placeholder="请输入用户名"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              密码 *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="col-span-3"
              placeholder="请输入密码"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nickname" className="text-right">
              昵称
            </Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => handleChange('nickname', e.target.value)}
              className="col-span-3"
              placeholder="请输入昵称"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              邮箱
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="col-span-3"
              placeholder="请输入邮箱"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              电话
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="col-span-3"
              placeholder="请输入电话号码"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              状态
            </Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: UserStatus) => handleChange('status', value)}
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