"use client";

import { useEffect, useState } from "react";
import { bodyPartBusiness } from "@/app/business/bodyPart";
import { BodyPartType } from "@/model/fit-record/BodyType/bodyPartType/type";
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
import { BodyPartTable } from "@/components/admin/bodyParts/BodyPartTable";
import { BodyPartSearchBar } from "@/components/admin/bodyParts/BodyPartSearchBar";
import { BodyPartPagination } from "@/components/admin/bodyParts/BodyPartPagination";
import { BodyPartModal } from "@/components/admin/bodyParts/BodyPartModal";

/**
 * 身体部位类型管理页面：管理系统身体部位类型
 * @returns 身体部位类型管理页面组件
 */
export default function BodyPartManagement() {
  const [bodyParts, setBodyParts] = useState<BodyPartType[]>([]);
  const [filteredBodyParts, setFilteredBodyParts] = useState<BodyPartType[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 创建/编辑对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBodyPart, setCurrentBodyPart] = useState<Partial<BodyPartType>>(
    {}
  );
  const [isEditMode, setIsEditMode] = useState(false);

  /**
   * 加载身体部位类型数据
   */
  const loadBodyParts = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit, isAdmin: true };
      const result = await bodyPartBusiness.getBodyPartList(params);
      setBodyParts(result.items);
      setFilteredBodyParts(result.items);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      toast.error("获取身体部位类型列表失败", {
        description: "请稍后再试或联系管理员",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 根据关键词筛选身体部位类型
   */
  const filterBodyPartsByKeyword = (
    bodyParts: BodyPartType[],
    keyword: string
  ) => {
    if (!keyword) {
      return bodyParts;
    } else {
      return bodyParts.filter((bodyPart) => {
        return (
          bodyPart.name?.includes(keyword) ||
          bodyPart.description?.includes(keyword)
        );
      });
    }
  };

  /**
   * 处理筛选
   */
  const handleFilter = (keyword: string) => {
    const filteredByKeyword = filterBodyPartsByKeyword(bodyParts, keyword);
    setFilteredBodyParts(filteredByKeyword);
    setTotal(filteredByKeyword.length);
    setTotalPages(Math.ceil(filteredByKeyword.length / limit));
  };

  /**
   * 搜索身体部位类型
   */
  const handleSearch = () => {
    handleFilter(keyword);
  };

  /**
   * 打开创建对话框
   */
  const openCreateDialog = () => {
    setCurrentBodyPart({
      imageUrls: [],
      videoUrls: [],
      order: 0,
      isCustom: false,
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  /**
   * 打开编辑对话框
   */
  const openEditDialog = (bodyPart: BodyPartType) => {
    setCurrentBodyPart(bodyPart);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (bodyPart: Partial<BodyPartType>) => {
    const currentBodyPart = {
      ...bodyPart,
    };
    try {
      if (!currentBodyPart.name || !currentBodyPart.description) {
        toast.error("请填写所有必填字段");
        return;
      }

      console.log("准备提交的数据:", currentBodyPart);

      if (isEditMode) {
        await bodyPartBusiness.updateBodyPart(
          currentBodyPart._id!,
          currentBodyPart
        );
        toast.success("更新成功", {
          description: "身体部位类型已更新",
        });
      } else {
        await bodyPartBusiness.createBodyPart(currentBodyPart);
        toast.success("创建成功", {
          description: "身体部位类型已创建",
        });
      }

      setIsDialogOpen(false);
      loadBodyParts();
    } catch (error) {
      toast.error(isEditMode ? "更新失败" : "创建失败", {
        description: "操作未能完成，请稍后再试",
      });
      console.error(error);
    }
  };

  /**
   * 删除身体部位类型
   */
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个身体部位类型吗？")) {
      return;
    }

    try {
      await bodyPartBusiness.deleteBodyPart(id);
      toast.success("删除成功", {
        description: "身体部位类型已删除",
      });
      loadBodyParts();
    } catch (error) {
      toast.error("删除失败", {
        description: "无法删除身体部位类型，请稍后再试",
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
    loadBodyParts();
  }, [page, limit]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>身体部位类型管理</CardTitle>
              <CardDescription>管理系统中的所有身体部位类型</CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> 添加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选区域 */}
          <BodyPartSearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            onSearch={handleSearch}
          />

          {/* 身体部位类型表格 */}
          <BodyPartTable
            bodyParts={filteredBodyParts}
            page={page}
            limit={limit}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />

          {/* 分页 */}
          <BodyPartPagination
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
      <BodyPartModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        bodyPart={currentBodyPart}
        onBodyPartChange={setCurrentBodyPart}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
