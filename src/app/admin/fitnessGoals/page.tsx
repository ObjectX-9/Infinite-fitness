"use client";

import { useEffect, useState } from "react";
import { fitnessGoalBusiness } from "@/app/business/fitnessGoal";
import { FitnessGoal } from "@/model/fit-record/ExerciseItem/fitnessGoal/type";
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
  FitnessGoalModal,
  FitnessGoalTable,
  FitnessGoalSearchBar,
  FitnessGoalPagination,
} from "@/components/admin/fitnessGoals";

/**
 * 训练目标管理页面：管理系统训练目标
 * @returns 训练目标管理页面组件
 */
export default function FitnessGoalManagement() {
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([]);
  const [filteredFitnessGoals, setFilteredFitnessGoals] = useState<FitnessGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 创建/编辑对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFitnessGoal, setCurrentFitnessGoal] = useState<Partial<FitnessGoal>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  /**
   * 加载训练目标数据
   */
  const loadFitnessGoals = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      
      if (keyword) {
        params.keyword = keyword;
      }
      
      const result = await fitnessGoalBusiness.getFitnessGoalList(params);
      setFitnessGoals(result.items);
      setFilteredFitnessGoals(result.items);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      toast.error("获取训练目标列表失败", {
        description: "请稍后再试或联系管理员",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 根据关键词筛选训练目标
   */
  const filterFitnessGoalsByKeyword = (
    fitnessGoals: FitnessGoal[],
    keyword: string
  ) => {
    if (!keyword) {
      return fitnessGoals;
    } else {
      return fitnessGoals.filter((fitnessGoal) => {
        return (
          fitnessGoal.name?.includes(keyword) ||
          fitnessGoal.description?.includes(keyword)
        );
      });
    }
  };

  /**
   * 处理筛选
   */
  const handleFilter = (keyword: string) => {
    const filteredByKeyword = filterFitnessGoalsByKeyword(fitnessGoals, keyword);
    setFilteredFitnessGoals(filteredByKeyword);
    setTotal(filteredByKeyword.length);
    setTotalPages(Math.ceil(filteredByKeyword.length / limit));
  };

  /**
   * 搜索训练目标
   */
  const handleSearch = () => {
    handleFilter(keyword);
  };

  /**
   * 打开创建对话框
   */
  const openCreateDialog = () => {
    setCurrentFitnessGoal({
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
  const openEditDialog = (fitnessGoal: FitnessGoal) => {
    setCurrentFitnessGoal(fitnessGoal);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (fitnessGoal: Partial<FitnessGoal>) => {
    const currentFitnessGoal = {
      ...fitnessGoal,
    };
    try {
      if (!currentFitnessGoal.name || !currentFitnessGoal.description) {
        toast.error("请填写所有必填字段");
        return;
      }

      console.log("准备提交的数据:", currentFitnessGoal);

      if (isEditMode) {
        await fitnessGoalBusiness.updateFitnessGoal(
          currentFitnessGoal._id!,
          currentFitnessGoal
        );
        toast.success("更新成功", {
          description: "训练目标已更新",
        });
      } else {
        await fitnessGoalBusiness.createFitnessGoal(currentFitnessGoal);
        toast.success("创建成功", {
          description: "训练目标已创建",
        });
      }

      setIsDialogOpen(false);
      loadFitnessGoals();
    } catch (error) {
      toast.error(isEditMode ? "更新失败" : "创建失败", {
        description: "操作未能完成，请稍后再试",
      });
      console.error(error);
    }
  };

  /**
   * 删除训练目标
   */
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个训练目标吗？")) {
      return;
    }

    try {
      await fitnessGoalBusiness.deleteFitnessGoal(id);
      toast.success("删除成功", {
        description: "训练目标已删除",
      });
      loadFitnessGoals();
    } catch (error) {
      toast.error("删除失败", {
        description: "无法删除训练目标，请稍后再试",
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
    loadFitnessGoals();
  }, [page, limit]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>训练目标管理</CardTitle>
              <CardDescription>管理系统中的所有训练目标</CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> 添加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选区域 */}
          <FitnessGoalSearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            onSearch={handleSearch}
          />

          {/* 训练目标表格 */}
          <FitnessGoalTable
            fitnessGoals={filteredFitnessGoals}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />

          {/* 分页控件 */}
          <FitnessGoalPagination
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
      <FitnessGoalModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        fitnessGoal={currentFitnessGoal}
        onFitnessGoalChange={setCurrentFitnessGoal}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 