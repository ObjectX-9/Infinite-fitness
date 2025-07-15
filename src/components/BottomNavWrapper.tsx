"use client"

import { usePathname } from 'next/navigation';
import { BottomNav } from './BottomNav';

export function BottomNavWrapper() {
  const pathname = usePathname();
  // 检查路径是否为管理后台
  const isAdminPath = pathname?.startsWith('/admin');
  
  // 在非管理后台路径下才显示底部导航
  if (isAdminPath) {
    return null;
  }
  
  return (
    <>
      <div className="pb-16"></div>
      <BottomNav />
    </>
  );
} 