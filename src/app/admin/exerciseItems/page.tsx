"use client";

import { useEffect, useState } from "react";
import { exerciseItemBusiness } from "@/app/business/exerciseItem";
import { fitnessGoalBusiness } from "@/app/business/fitnessGoal";
import { BaseExerciseItem, DifficultyLevel } from "@/model/fit-record/ExerciseItem/type";
import { FitnessGoal } from "@/model/fit-record/ExerciseItem/fitnessGoal/type";
import { MuscleType } from "@/model/fit-record/BodyType/muscleType/type";
import { UsageScenario } from "@/model/fit-record/ExerciseItem/usageScenarios/type";
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
  ExerciseItemModal,
  ExerciseItemTable,
  ExerciseItemSearchBar,
  ExerciseItemPagination,
} from "@/components/admin/exerciseItems";

/**
 * 训练动作管理页面：管理系统训练动作
 * @returns 训练动作管理页面组件
 */
export default function ExerciseItemManagement() {
  const [exerciseItems, setExerciseItems] = useState<BaseExerciseItem[]>([]);
  const [filteredExerciseItems, setFilteredExerciseItems] = useState<BaseExerciseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 依赖数据
  const [muscleTypes, setMuscleTypes] = useState<MuscleType[]>([]);
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([]);
  const [usageScenarios, setUsageScenarios] = useState<UsageScenario[]>([]);
  const [fitnessEquipments, setFitnessEquipments] = useState<FitnessEquipment[]>([]);
  const [loadingDependencies, setLoadingDependencies] = useState(false);

  // 创建/编辑对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExerciseItem, setCurrentExerciseItem] = useState<Partial<BaseExerciseItem>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  /**
   * 加载依赖数据（肌肉类型、健身目标、使用场景、器械类型）
   */
  const loadDependencies = async () => {
    setLoadingDependencies(true);
    try {
      // 这里需要替换为实际的业务方法
      const muscleTypesResult = await fetch('/api/muscleType?limit=100').then(res => res.json());
      const fitnessGoalsResult = await fitnessGoalBusiness.getFitnessGoalList({ limit: 100 });
      const usageScenariosResult = await fetch('/api/usageScenario?limit=100').then(res => res.json());
      const fitnessEquipmentsResult = await fetch('/api/fitnessEquipment?limit=100').then(res => res.json());

      setMuscleTypes(muscleTypesResult.items || []);
      setFitnessGoals(fitnessGoalsResult.items || []);
      setUsageScenarios(usageScenariosResult.items || []);
      setFitnessEquipments(fitnessEquipmentsResult.items || []);
    } catch (error) {
      toast.error("获取基础数据失败", {
        description: "请稍后再试或联系管理员",
      });
      console.error(error);
    } finally {
      setLoadingDependencies(false);
    }
  };

  /**
   * 加载训练动作数据
   */
  const loadExerciseItems = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      
      if (keyword) {
        params.keyword = keyword;
      }
      
      if (difficulty) {
        params.difficulty = difficulty;
      }
      
      const result = await exerciseItemBusiness.getExerciseItemList(params);
      setExerciseItems(result.items);
      setFilteredExerciseItems(result.items);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      toast.error("获取训练动作列表失败", {
        description: "请稍后再试或联系管理员",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 根据关键词和难度筛选训练动作
   */
  const filterExerciseItems = () => {
    // 先按关键词过滤
    let filtered = exerciseItems;
    
    if (keyword) {
      filtered = filtered.filter((item) => {
        return (
          item.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          item.description?.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    }
    
    // 再按难度过滤
    if (difficulty) {
      filtered = filtered.filter((item) => item.difficulty === difficulty);
    }
    
    setFilteredExerciseItems(filtered);
    setTotal(filtered.length);
    setTotalPages(Math.ceil(filtered.length / limit));
  };

  /**
   * 搜索训练动作
   */
  const handleSearch = () => {
    filterExerciseItems();
  };

  /**
   * 打开创建对话框
   */
  const openCreateDialog = () => {
    setCurrentExerciseItem({
      muscleTypeIds: [],
      fitnessGoalsIds: [],
      usageScenariosIds: [],
      difficulty: DifficultyLevel.MEDIUM,
      isCustom: false
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  /**
   * 打开编辑对话框
   */
  const openEditDialog = (exerciseItem: BaseExerciseItem) => {
    setCurrentExerciseItem(exerciseItem);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (exerciseItem: Partial<BaseExerciseItem>) => {
    try {
      if (!exerciseItem.name || !exerciseItem.description || 
          !exerciseItem.difficulty || !exerciseItem.equipmentTypeId ||
          !exerciseItem.muscleTypeIds?.length || 
          !exerciseItem.fitnessGoalsIds?.length || 
          !exerciseItem.usageScenariosIds?.length) {
        toast.error("请填写所有必填字段");
        return;
      }

      if (isEditMode) {
        await exerciseItemBusiness.updateExerciseItem(
          exerciseItem.id!,
          exerciseItem
        );
        toast.success("更新成功", {
          description: "训练动作已更新",
        });
      } else {
        await exerciseItemBusiness.createExerciseItem(exerciseItem);
        toast.success("创建成功", {
          description: "训练动作已创建",
        });
      }

      setIsDialogOpen(false);
      loadExerciseItems();
    } catch (error) {
      toast.error(isEditMode ? "更新失败" : "创建失败", {
        description: "操作未能完成，请稍后再试",
      });
      console.error(error);
    }
  };

  /**
   * 删除训练动作
   */
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个训练动作吗？")) {
      return;
    }

    try {
      await exerciseItemBusiness.deleteExerciseItem(id);
      toast.success("删除成功", {
        description: "训练动作已删除",
      });
      loadExerciseItems();
    } catch (error) {
      toast.error("删除失败", {
        description: "无法删除训练动作，请稍后再试",
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

  // 页面加载时获取数据
  useEffect(() => {
    loadDependencies();
  }, []);

  // 当页码、每页数量、搜索条件变化时重新加载数据
  useEffect(() => {
    loadExerciseItems();
  }, [page, limit]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>训练动作管理</CardTitle>
              <CardDescription>管理系统中的所有训练动作</CardDescription>
            </div>
            <Button onClick={openCreateDialog} disabled={loadingDependencies}>
              <Plus className="mr-2 h-4 w-4" /> 添加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选区域 */}
          <ExerciseItemSearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onSearch={handleSearch}
          />

          {/* 训练动作表格 */}
          <ExerciseItemTable
            exerciseItems={filteredExerciseItems}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />

          {/* 分页控件 */}
          <ExerciseItemPagination
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
      {isDialogOpen && (
        <ExerciseItemModal
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          isEditMode={isEditMode}
          exerciseItem={currentExerciseItem}
          onExerciseItemChange={setCurrentExerciseItem}
          onSubmit={handleSubmit}
          muscleTypes={muscleTypes}
          fitnessGoals={fitnessGoals}
          usageScenarios={usageScenarios}
          fitnessEquipments={fitnessEquipments}
        />
      )}
    </div>
  );
} 