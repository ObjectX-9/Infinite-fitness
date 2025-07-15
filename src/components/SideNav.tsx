"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Settings, 
  BarChart, 
  ShoppingBag,
  BookOpen,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '用户管理', path: '/users', icon: Users },
  { name: '健身记录', path: '/fit-record', icon: Calendar },
  { name: '健身工具', path: '/fit-tool', icon: BarChart },
  { name: '健身教程', path: '/fit-tech', icon: BookOpen },
  { name: '健身商城', path: '/fit-mall', icon: ShoppingBag },
  { name: '系统设置', path: '/settings', icon: Settings },
];

interface SideNavProps {
  className?: string;
}

export function SideNav({ className }: SideNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn("h-full w-64 border-r border-border bg-background", className)}>
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        <span className="text-xl">AI健身</span>
      </div>
      <div className="space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
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