"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Dumbbell,
  Calendar,
  ShoppingBag,
  Activity,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

/**
 * 仪表盘数据卡片组件
 * @param title - 标题
 * @param value - 值
 * @param description - 描述
 * @param icon - 图标
 * @param iconColor - 图标颜色
 */
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md ${iconColor}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

/**
 * 管理后台仪表盘页面组件
 */
export default function DashboardPage() {
  // 示例数据，实际应用中应通过API获取
  const stats = [
    {
      title: "总用户数",
      value: "3,781",
      description: "较上月增长 10.1%",
      icon: Users,
      iconColor: "bg-blue-500",
    },
    {
      title: "活跃用户",
      value: "1,352",
      description: "较上月增长 5.4%",
      icon: Activity,
      iconColor: "bg-green-500",
    },
    {
      title: "健身计划",
      value: "258",
      description: "较上月增长 8.2%",
      icon: Dumbbell,
      iconColor: "bg-purple-500",
    },
    {
      title: "本周训练记录",
      value: "4,279",
      description: "较上周增长 12.5%",
      icon: Calendar,
      iconColor: "bg-yellow-500",
    },
    {
      title: "商品销量",
      value: "684",
      description: "较上月增长 7.1%",
      icon: ShoppingBag,
      iconColor: "bg-pink-500",
    },
    {
      title: "系统访问量",
      value: "28,352",
      description: "较上月增长 14.8%",
      icon: TrendingUp,
      iconColor: "bg-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-gray-500 mt-1">查看系统关键指标和概览</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>近期活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users size={16} className="text-gray-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">新用户注册</p>
                    <p className="text-xs text-gray-500">张三注册了账号</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    {new Date(Date.now() - i * 60000 * 60).toLocaleString(
                      "zh-CN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>系统公告</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "系统维护通知",
                  content:
                    "系统将于本周六凌晨2点-4点进行例行维护，期间可能无法访问。",
                },
                {
                  title: "新功能上线",
                  content: "健身计划生成器已上线，欢迎体验使用！",
                },
                {
                  title: "版本更新v2.1.0",
                  content: "优化了用户界面，修复了已知问题。",
                },
                {
                  title: "数据同步提醒",
                  content: "请定期同步您的健身数据，以免数据丢失。",
                },
              ].map((notice, i) => (
                <div key={i} className="pb-3 border-b last:border-0 last:pb-0">
                  <h4 className="font-medium text-sm">{notice.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{notice.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(
                      Date.now() - i * 24 * 60000 * 60
                    ).toLocaleDateString("zh-CN")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
