"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSideNav } from "@/components/admin/AdminSideNav";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserType } from "@/model/user/type";

/**
 * 管理后台布局组件
 * @param children - 子组件
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * 检查登录状态
   */
  useEffect(() => {
    // 如果已经在登录页，不需要检查
    if (pathname === "/admin/login") {
      return;
    }

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } catch (error) {
        console.error("解析用户数据失败:", error);
        setIsLoggedIn(false);
      }
    } else {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  // 如果在登录页，只显示子组件
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  /**
   * 退出登录
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen">
      {isLoggedIn && <AdminSideNav />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b px-4 flex items-center justify-between bg-white">
          <h1 className="text-xl font-semibold">管理后台</h1>
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium">
                  {user?.nickname || user?.username}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                退出登录
              </Button>
            </div>
          )}
        </header>
        <main className="flex-1 overflow-auto p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
