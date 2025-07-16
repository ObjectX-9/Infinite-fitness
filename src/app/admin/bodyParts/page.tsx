"use client";

import { useEffect, useState } from "react";
import { bodyPartBusiness } from "@/app/business/bodyPart";
import {
  BodyPartType,
  EBodyPartTypeCategory,
} from "@/model/fit-record/BodyType/bodyPartType/type";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Plus, Search } from "lucide-react";

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
  const [category, setCategory] = useState<EBodyPartTypeCategory | "all">(
    "all"
  );
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
      const params: Record<string, unknown> = { page, limit };
      if (category !== "all") params.category = category;

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
   * 根据类别筛选身体部位类型
   */
  const filterBodyPartsByCategory = (
    bodyParts: BodyPartType[],
    category: EBodyPartTypeCategory | "all"
  ) => {
    if (category === "all") {
      return bodyParts;
    } else {
      return bodyParts.filter((bodyPart) => {
        return bodyPart.name === category;
      });
    }
  };

  /**
   * 处理筛选
   */
  const handleFilter = (
    keyword: string,
    category: EBodyPartTypeCategory | "all"
  ) => {
    const filteredByKeyword = filterBodyPartsByKeyword(bodyParts, keyword);
    const filteredByCategory = filterBodyPartsByCategory(
      filteredByKeyword,
      category
    );
    setFilteredBodyParts(filteredByCategory);
    setTotal(filteredByCategory.length);
    setTotalPages(Math.ceil(filteredByCategory.length / limit));
  };

  /**
   * 搜索身体部位类型
   */
  const handleSearch = () => {
    handleFilter(keyword, category);
  };

  /**
   * 打开创建对话框
   */
  const openCreateDialog = () => {
    setCurrentBodyPart({
      imageUrls: [],
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
  const handleSubmit = async () => {
    try {
      if (!currentBodyPart.name || !currentBodyPart.description) {
        toast.error("请填写所有必填字段");
        return;
      }

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
   * 获取类别中文名称
   */
  const getCategoryLabel = (category: EBodyPartTypeCategory) => {
    const categoryMap = {
      [EBodyPartTypeCategory.CHEST]: "胸部",
      [EBodyPartTypeCategory.BACK]: "背部",
      [EBodyPartTypeCategory.ARM]: "手臂",
      [EBodyPartTypeCategory.LEG]: "腿部",
      [EBodyPartTypeCategory.ABDOMEN]: "腹部",
      [EBodyPartTypeCategory.HIPS]: "臀部",
      [EBodyPartTypeCategory.OTHER]: "其他",
    };
    return categoryMap[category] || category;
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
          <div className="flex items-center space-x-2 mb-6">
            <Input
              placeholder="搜索名称或描述..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as EBodyPartTypeCategory | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类别</SelectItem>
                {Object.values(EBodyPartTypeCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" /> 搜索
            </Button>
          </div>

          {/* 身体部位类型表格 */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">序号</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead className="w-[300px]">描述</TableHead>
                  <TableHead>自定义</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead className="w-[100px]">图片数</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : filteredBodyParts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      没有找到数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBodyParts.map((bodyPart, index) => (
                    <TableRow key={bodyPart._id}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {getCategoryLabel(bodyPart.name)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {bodyPart.description}
                      </TableCell>
                      <TableCell>
                        {bodyPart.isCustom ? (
                          <Badge variant="secondary">自定义</Badge>
                        ) : (
                          <Badge variant="outline">预设</Badge>
                        )}
                      </TableCell>
                      <TableCell>{bodyPart.order}</TableCell>
                      <TableCell>{bodyPart.imageUrls?.length || 0}</TableCell>
                      <TableCell>
                        {new Date(bodyPart.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">打开菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(bodyPart)}
                            >
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(bodyPart._id)}
                              className="text-red-600"
                            >
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">每页显示</p>
              <Select
                value={limit.toString()}
                onValueChange={(value) => handleLimitChange(Number(value))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                条记录，共 {total} 条
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                下一页
              </Button>
              <span className="text-sm text-muted-foreground">
                第 {page} 页，共 {totalPages} 页
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 创建/编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "编辑身体部位类型" : "添加身体部位类型"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "修改身体部位类型信息" : "创建一个新的身体部位类型"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">类别</label>
              <div className="col-span-3">
                <Select
                  value={currentBodyPart.name || ""}
                  onValueChange={(value) =>
                    setCurrentBodyPart({
                      ...currentBodyPart,
                      name: value as EBodyPartTypeCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EBodyPartTypeCategory).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {getCategoryLabel(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">描述</label>
              <div className="col-span-3">
                <Textarea
                  value={currentBodyPart.description || ""}
                  onChange={(e) =>
                    setCurrentBodyPart({
                      ...currentBodyPart,
                      description: e.target.value,
                    })
                  }
                  placeholder="身体部位类型的描述"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">排序</label>
              <div className="col-span-3">
                <Input
                  type="number"
                  value={currentBodyPart.order || 0}
                  onChange={(e) =>
                    setCurrentBodyPart({
                      ...currentBodyPart,
                      order: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">自定义</label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="isCustom"
                  checked={currentBodyPart.isCustom || false}
                  onCheckedChange={(checked: boolean) =>
                    setCurrentBodyPart({
                      ...currentBodyPart,
                      isCustom: checked === true,
                    })
                  }
                />
                <label htmlFor="isCustom">是否为自定义部位</label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">图片URL</label>
              <div className="col-span-3">
                <Textarea
                  value={(currentBodyPart.imageUrls || []).join("\n")}
                  onChange={(e) =>
                    setCurrentBodyPart({
                      ...currentBodyPart,
                      imageUrls: e.target.value
                        .split("\n")
                        .filter((url) => url.trim() !== ""),
                    })
                  }
                  placeholder="每行一个图片URL"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? "保存" : "创建"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
