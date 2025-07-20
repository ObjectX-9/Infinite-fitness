"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  BarChart,
  ShoppingBag,
  BookOpen,
  BicepsFlexed,
  FileUser,
  Goal,
  LayoutDashboard,
  Shapes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const navItems = [
  { name: "控制台", path: "/admin/dashboard", icon: Home },
  { name: "用户管理", path: "/admin/users", icon: Users },
  { name: "身体部位", path: "/admin/bodyParts", icon: FileUser },
  { name: "肌肉类型", path: "/admin/muscleTypes", icon: BicepsFlexed },
  { name: "训练目标", path: "/admin/fitnessGoals", icon: Goal },
  { name: "使用场景", path: "/admin/usageScenarios", icon: LayoutDashboard },
  { name: "健身器械", path: "/admin/fitnessEquipments", icon: Shapes },
  { name: "训练动作", path: "/admin/exerciseItems", icon: BarChart },
  { name: "健身教程", path: "/admin/fit-tech", icon: BookOpen },
  { name: "健身商城", path: "/admin/fit-mall", icon: ShoppingBag },
  { name: "系统设置", path: "/admin/settings", icon: Settings },
];

interface AdminSideNavProps {
  className?: string;
}

export function AdminSideNav({ className }: AdminSideNavProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-full w-64 border-r border-border bg-background",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        <span className="text-xl">fit admin</span>
      </div>
      <div className="space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;

          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isActive ? "bg-muted" : "hover:bg-muted/50"
              )}
              asChild
            >
              <Link href={item.path}>
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
