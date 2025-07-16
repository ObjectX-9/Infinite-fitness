"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BarChart,
  Calendar,
  Activity,
  ShoppingBag,
  Settings,
} from "lucide-react";
import { User } from "@/model/user/type";

/**
 * 管理后台首页组件
 */
export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  /**
   * 获取用户信息
   */
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("解析用户数据失败:", error);
      }
    }
  }, []);

  // 功能模块卡片数据
  const modules = [
    {
      title: "用户管理",
      description: "查看和管理系统用户信息",
      icon: Users,
      path: "/admin/users",
      count: "350+",
      color: "bg-blue-500",
    },
    {
      title: "身体部位",
      description: "维护身体部位数据",
      icon: Calendar,
      path: "/admin/bodyParts",
      count: "42",
      color: "bg-green-500",
    },
    {
      title: "健身工具",
      description: "管理健身器材和工具",
      icon: Activity,
      path: "/admin/fit-tool",
      count: "120+",
      color: "bg-purple-500",
    },
    {
      title: "健身教程",
      description: "发布和维护健身教程内容",
      icon: BarChart,
      path: "/admin/fit-tech",
      count: "85",
      color: "bg-yellow-500",
    },
    {
      title: "健身商城",
      description: "管理商城产品和订单",
      icon: ShoppingBag,
      path: "/admin/fit-mall",
      count: "250+",
      color: "bg-pink-500",
    },
    {
      title: "系统设置",
      description: "配置系统参数和选项",
      icon: Settings,
      path: "/admin/settings",
      count: "",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-2xl font-bold mb-2">
          欢迎回来，{user?.nickname || user?.username || "管理员"}
        </h2>
        <p className="text-gray-500">
          今天是{" "}
          {new Date().toLocaleDateString("zh-CN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <CardHeader className={`${module.color} text-white`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">
                  {module.title}
                </CardTitle>
                <module.icon size={24} />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600">{module.description}</p>
              {module.count && (
                <p className="text-3xl font-bold mt-2">{module.count}</p>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={() => router.push(module.path)}
              >
                进入管理
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
