"use client";

import { useEffect, useState } from "react";
import { usageScenarioBusiness } from "@/app/business/usageScenario";
import { UsageScenario } from "@/model/fit-record/ExerciseItem/usageScenarios/type";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UsageScenarioModal,
  UsageScenarioTable,
  UsageScenarioSearchBar,
  UsageScenarioPagination,
} from "@/components/admin/usageScenarios";

/**
 * 使用场景管理页面：管理系统使用场景
 * @returns 使用场景管理页面组件
 */
export default function UsageScenarioManagement() {
  const [usageScenarios, setUsageScenarios] = useState<UsageScenario[]>([]);
  const [filteredUsageScenarios, setFilteredUsageScenarios] = useState<UsageScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 创建/编辑对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUsageScenario, setCurrentUsageScenario] = useState<Partial<UsageScenario>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  /**
   * 加载使用场景数据
   */
  const loadUsageScenarios = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      
      if (keyword) {
        params.keyword = keyword;
      }
      
      const result = await usageScenarioBusiness.getUsageScenarioList(params);
      setUsageScenarios(result.items);
      setFilteredUsageScenarios(result.items);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      toast.error("获取使用场景列表失败", {
        description: "请稍后再试或联系管理员",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 根据关键词筛选使用场景
   */
  const filterUsageScenariosByKeyword = (
    usageScenarios: UsageScenario[],
    keyword: string
  ) => {
    if (!keyword) {
      return usageScenarios;
    } else {
      return usageScenarios.filter((usageScenario) => {
        return (
          usageScenario.name?.includes(keyword) ||
          usageScenario.description?.includes(keyword)
        );
      });
    }
  };

  /**
   * 处理筛选
   */
  const handleFilter = (keyword: string) => {
    const filteredByKeyword = filterUsageScenariosByKeyword(usageScenarios, keyword);
    setFilteredUsageScenarios(filteredByKeyword);
    setTotal(filteredByKeyword.length);
    setTotalPages(Math.ceil(filteredByKeyword.length / limit));
  };

  /**
   * 搜索使用场景
   */
  const handleSearch = () => {
    handleFilter(keyword);
  };

  /**
   * 打开创建对话框
   */
  const openCreateDialog = () => {
    setCurrentUsageScenario({
      imageUrls: [],
      order: 0,
      isCustom: false
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  /**
   * 打开编辑对话框
   */
  const openEditDialog = (usageScenario: UsageScenario) => {
    setCurrentUsageScenario(usageScenario);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (usageScenario: Partial<UsageScenario>) => {
    const currentUsageScenario = {
      ...usageScenario,
    };
    try {
      if (!currentUsageScenario.name || !currentUsageScenario.description) {
        toast.error("请填写所有必填字段");
        return;
      }

      console.log("准备提交的数据:", currentUsageScenario);

      if (isEditMode) {
        await usageScenarioBusiness.updateUsageScenario(
          currentUsageScenario._id!,
          currentUsageScenario
        );
        toast.success("更新成功", {
          description: "使用场景已更新",
        });
      } else {
        await usageScenarioBusiness.createUsageScenario(currentUsageScenario);
        toast.success("创建成功", {
          description: "使用场景已创建",
        });
      }

      setIsDialogOpen(false);
      loadUsageScenarios();
    } catch (error) {
      toast.error(isEditMode ? "更新失败" : "创建失败", {
        description: "操作未能完成，请稍后再试",
      });
      console.error(error);
    }
  };

  /**
   * 删除使用场景
   */
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个使用场景吗？")) {
      return;
    }

    try {
      await usageScenarioBusiness.deleteUsageScenario(id);
      toast.success("删除成功", {
        description: "使用场景已删除",
      });
      loadUsageScenarios();
    } catch (error) {
      toast.error("删除失败", {
        description: "无法删除使用场景，请稍后再试",
      });
      console.error(error);
    }
  };

  /**
   * 分页处理
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  /**
   * 每页条数变更
   */
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // 重置到第一页
  };

  useEffect(() => {
    loadUsageScenarios();
  }, [page, limit]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>使用场景管理</CardTitle>
              <CardDescription>管理系统中的所有使用场景</CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> 添加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选区域 */}
          <UsageScenarioSearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            onSearch={handleSearch}
          />

          {/* 使用场景表格 */}
          <UsageScenarioTable
            usageScenarios={filteredUsageScenarios}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />

          {/* 分页控件 */}
          <UsageScenarioPagination
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </CardContent>
      </Card>

      {/* 创建/编辑对话框 */}
      <UsageScenarioModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        usageScenario={currentUsageScenario}
        onUsageScenarioChange={setCurrentUsageScenario}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 