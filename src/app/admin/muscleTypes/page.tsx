"use client";

import { useEffect, useState } from "react";
import { muscleTypeBusiness } from "@/app/business/muscleType";
import { MuscleType } from "@/model/fit-record/BodyType/muscleType/type";
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
import { bodyPartBusiness } from "@/app/business/bodyPart";
import { BodyPartType } from "@/model/fit-record/BodyType/bodyPartType/type";
import {
  MuscleTypeModal,
  MuscleTypeTable,
  MuscleTypeSearchBar,
  MuscleTypePagination,
} from "@/components/admin/muscleTypes";

/**
 * 肌肉类型管理页面：管理系统肌肉类型
 * @returns 肌肉类型管理页面组件
 */
export default function MuscleTypeManagement() {
  const [muscleTypes, setMuscleTypes] = useState<MuscleType[]>([]);
  const [filteredMuscleTypes, setFilteredMuscleTypes] = useState<MuscleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [bodyParts, setBodyParts] = useState<BodyPartType[]>([]);
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<string>("");

  // 创建/编辑对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMuscleType, setCurrentMuscleType] = useState<Partial<MuscleType>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  /**
   * 加载肌肉类型数据
   */
  const loadMuscleTypes = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      
      if (selectedBodyPartId) {
        params.bodyPartId = selectedBodyPartId;
      }
      
      if (keyword) {
        params.keyword = keyword;
      }
      
      const result = await muscleTypeBusiness.getMuscleTypeList(params);
      setMuscleTypes(result.items);
      setFilteredMuscleTypes(result.items);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      toast.error("获取肌肉类型列表失败", {
        description: "请稍后再试或联系管理员",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载身体部位数据，用于筛选
   */
  const loadBodyParts = async () => {
    try {
      const result = await bodyPartBusiness.getBodyPartList({ limit: 100 });
      setBodyParts(result.items);
    } catch (error) {
      console.error("加载身体部位列表失败:", error);
    }
  };

  /**
   * 根据关键词筛选肌肉类型
   */
  const filterMuscleTypesByKeyword = (
    muscleTypes: MuscleType[],
    keyword: string
  ) => {
    if (!keyword) {
      return muscleTypes;
    } else {
      return muscleTypes.filter((muscleType) => {
        return (
          muscleType.name?.includes(keyword) ||
          muscleType.description?.includes(keyword)
        );
      });
    }
  };

  /**
   * 处理筛选
   */
  const handleFilter = (keyword: string) => {
    const filteredByKeyword = filterMuscleTypesByKeyword(muscleTypes, keyword);
    setFilteredMuscleTypes(filteredByKeyword);
    setTotal(filteredByKeyword.length);
    setTotalPages(Math.ceil(filteredByKeyword.length / limit));
  };

  /**
   * 搜索肌肉类型
   */
  const handleSearch = () => {
    handleFilter(keyword);
  };

  /**
   * 处理身体部位筛选变更
   */
  const handleBodyPartChange = (bodyPartId: string) => {
    setSelectedBodyPartId(bodyPartId);
    setPage(1);
  };

  /**
   * 打开创建对话框
   */
  const openCreateDialog = () => {
    setCurrentMuscleType({
      imageUrls: [],
      videoUrls: [],
      order: 0,
      isCustom: false,
      bodyPartId: selectedBodyPartId || undefined,
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  /**
   * 打开编辑对话框
   */
  const openEditDialog = (muscleType: MuscleType) => {
    setCurrentMuscleType(muscleType);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (muscleType: Partial<MuscleType>) => {
    const currentMuscleType = {
      ...muscleType,
    };
    try {
      if (!currentMuscleType.name || !currentMuscleType.description) {
        toast.error("请填写所有必填字段");
        return;
      }

      console.log("准备提交的数据:", currentMuscleType);

      if (isEditMode) {
        await muscleTypeBusiness.updateMuscleType(
          currentMuscleType._id!,
          currentMuscleType
        );
        toast.success("更新成功", {
          description: "肌肉类型已更新",
        });
      } else {
        await muscleTypeBusiness.createMuscleType(currentMuscleType);
        toast.success("创建成功", {
          description: "肌肉类型已创建",
        });
      }

      setIsDialogOpen(false);
      loadMuscleTypes();
    } catch (error) {
      toast.error(isEditMode ? "更新失败" : "创建失败", {
        description: "操作未能完成，请稍后再试",
      });
      console.error(error);
    }
  };

  /**
   * 删除肌肉类型
   */
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个肌肉类型吗？")) {
      return;
    }

    try {
      await muscleTypeBusiness.deleteMuscleType(id);
      toast.success("删除成功", {
        description: "肌肉类型已删除",
      });
      loadMuscleTypes();
    } catch (error) {
      toast.error("删除失败", {
        description: "无法删除肌肉类型，请稍后再试",
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
    loadMuscleTypes();
  }, [page, limit, selectedBodyPartId]);

  useEffect(() => {
    loadBodyParts();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>肌肉类型管理</CardTitle>
              <CardDescription>管理系统中的所有肌肉类型</CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> 添加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选区域 */}
          <MuscleTypeSearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            onSearch={handleSearch}
            bodyParts={bodyParts}
            selectedBodyPartId={selectedBodyPartId}
            onBodyPartChange={handleBodyPartChange}
          />

          {/* 肌肉类型表格 */}
          <MuscleTypeTable
            muscleTypes={filteredMuscleTypes}
            bodyParts={bodyParts}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />

          {/* 分页控件 */}
          <MuscleTypePagination
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
      <MuscleTypeModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        muscleType={currentMuscleType}
        onMuscleTypeChange={setCurrentMuscleType}
        onSubmit={handleSubmit}
        bodyParts={bodyParts}
      />
    </div>
  );
} 