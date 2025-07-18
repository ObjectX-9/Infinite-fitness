"use client";

import { useEffect, useState } from "react";
import { fitnessEquipmentBusiness } from "@/app/business/fitnessEquipment";
import { FitnessEquipment } from "@/model/fit-record/fitnessEquipment/type";
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
  FitnessEquipmentModal,
  FitnessEquipmentTable,
  FitnessEquipmentSearchBar,
  FitnessEquipmentPagination,
} from "@/components/admin/fitnessEquipments";

/**
 * 健身器械管理页面：管理系统健身器械
 * @returns 健身器械管理页面组件
 */
export default function FitnessEquipmentManagement() {
  const [fitnessEquipments, setFitnessEquipments] = useState<FitnessEquipment[]>([]);
  const [filteredFitnessEquipments, setFilteredFitnessEquipments] = useState<FitnessEquipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 创建/编辑对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFitnessEquipment, setCurrentFitnessEquipment] = useState<Partial<FitnessEquipment>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  /**
   * 加载健身器械数据
   */
  const loadFitnessEquipments = async () => {
    setLoading(true);
    try {
      // 不带筛选参数请求所有数据
      const params: Record<string, unknown> = { page, limit };
      const result = await fitnessEquipmentBusiness.getFitnessEquipmentList(params);
      setFitnessEquipments(result.items);
      setFilteredFitnessEquipments(result.items);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      toast.error("获取健身器械列表失败", {
        description: "请稍后再试或联系管理员",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 根据关键词筛选健身器械
   */
  const filterFitnessEquipmentsByKeyword = (
    equipments: FitnessEquipment[],
    keyword: string
  ) => {
    if (!keyword) {
      return equipments;
    } else {
      return equipments.filter((equipment) => {
        return (
          equipment.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          equipment.description?.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    }
  };

  /**
   * 根据类别筛选健身器械
   */
  const filterFitnessEquipmentsByCategory = (
    equipments: FitnessEquipment[],
    category: string
  ) => {
    if (!category || category === "all") {
      return equipments;
    } else {
      return equipments.filter((equipment) => equipment.category === category);
    }
  };

  /**
   * 处理筛选
   */
  const handleFilter = () => {
    // 先按关键词过滤
    let filtered = filterFitnessEquipmentsByKeyword(fitnessEquipments, keyword);
    // 再按类别过滤
    filtered = filterFitnessEquipmentsByCategory(filtered, category);
    
    setFilteredFitnessEquipments(filtered);
    setTotal(filtered.length);
    setTotalPages(Math.ceil(filtered.length / limit));
  };

  /**
   * 搜索健身器械
   */
  const handleSearch = () => {
    handleFilter();
  };

  /**
   * 打开创建对话框
   */
  const openCreateDialog = () => {
    setCurrentFitnessEquipment({
      imageUrls: [],
      targetMusclesIds: [],
      fitnessGoalsIds: [],
      usageScenariosIds: [],
      usageInstructions: [],
      order: 0,
      isCustom: false,
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  /**
   * 打开编辑对话框
   */
  const openEditDialog = (fitnessEquipment: FitnessEquipment) => {
    setCurrentFitnessEquipment(fitnessEquipment);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (fitnessEquipment: Partial<FitnessEquipment>) => {
    const currentFitnessEquipment = {
      ...fitnessEquipment,
    };
    try {
      if (!currentFitnessEquipment.name || !currentFitnessEquipment.description || !currentFitnessEquipment.category) {
        toast.error("请填写所有必填字段");
        return;
      }

      console.log("准备提交的数据:", currentFitnessEquipment);

      if (isEditMode) {
        await fitnessEquipmentBusiness.updateFitnessEquipment(
          currentFitnessEquipment._id!,
          currentFitnessEquipment
        );
        toast.success("更新成功", {
          description: "健身器械已更新",
        });
      } else {
        await fitnessEquipmentBusiness.createFitnessEquipment(currentFitnessEquipment);
        toast.success("创建成功", {
          description: "健身器械已创建",
        });
      }

      setIsDialogOpen(false);
      loadFitnessEquipments();
    } catch (error) {
      toast.error(isEditMode ? "更新失败" : "创建失败", {
        description: "操作未能完成，请稍后再试",
      });
      console.error(error);
    }
  };

  /**
   * 删除健身器械
   */
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个健身器械吗？")) {
      return;
    }

    try {
      await fitnessEquipmentBusiness.deleteFitnessEquipment(id);
      toast.success("删除成功", {
        description: "健身器械已删除",
      });
      loadFitnessEquipments();
    } catch (error) {
      toast.error("删除失败", {
        description: "无法删除健身器械，请稍后再试",
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
    loadFitnessEquipments();
  }, [page, limit]);

  // 类别或关键词变更时进行过滤
  useEffect(() => {
    handleFilter();
  }, [category]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>健身器械管理</CardTitle>
              <CardDescription>管理系统中的所有健身器械</CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> 添加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选区域 */}
          <FitnessEquipmentSearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            category={category}
            setCategory={setCategory}
            onSearch={handleSearch}
          />

          {/* 健身器械表格 */}
          <FitnessEquipmentTable
            fitnessEquipments={filteredFitnessEquipments}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />

          {/* 分页控件 */}
          <FitnessEquipmentPagination
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
      <FitnessEquipmentModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        fitnessEquipment={currentFitnessEquipment}
        onFitnessEquipmentChange={setCurrentFitnessEquipment}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 