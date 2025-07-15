"use client";

import { AdminSideNav } from "@/components/admin/AdminSideNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AdminSideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b px-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">管理后台</h1>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
