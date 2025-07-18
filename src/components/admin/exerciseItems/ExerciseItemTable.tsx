import { BaseExerciseItem, DifficultyLevel } from "@/model/fit-record/ExerciseItem/type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExerciseItemTableProps {
  exerciseItems: BaseExerciseItem[];
  loading: boolean;
  onEdit: (exerciseItem: BaseExerciseItem) => void;
  onDelete: (id: string) => void;
  onView?: (exerciseItem: BaseExerciseItem) => void;
}

/**
 * 难度标签映射
 */
const difficultyLabels: Record<DifficultyLevel, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
  [DifficultyLevel.EASY]: { label: "简单", variant: "outline" },
  [DifficultyLevel.MEDIUM]: { label: "中等", variant: "secondary" },
  [DifficultyLevel.HARD]: { label: "困难", variant: "destructive" },
};

/**
 * 训练动作表格组件
 * @param props 组件属性
 * @returns 训练动作表格组件
 */
export function ExerciseItemTable({
  exerciseItems,
  loading,
  onEdit,
  onDelete,
  onView,
}: ExerciseItemTableProps) {
  /**
   * 获取难度标签
   */
  const getDifficultyBadge = (difficulty: DifficultyLevel) => {
    const { label, variant } = difficultyLabels[difficulty] || { label: "未知", variant: "outline" };
    return <Badge variant={variant}>{label}</Badge>;
  };

  /**
   * 获取训练动作分类摘要
   */
  const getTruncatedList = (list: string[] | undefined, maxItems = 1) => {
    if (!list || list.length === 0) return "无";
    
    if (list.length <= maxItems) {
      return list.join(", ");
    }
    
    return `${list.slice(0, maxItems).join(", ")} 等${list.length}项`;
  };

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  if (!exerciseItems || exerciseItems.length === 0) {
    return <div className="text-center py-8">暂无训练动作数据</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>难度</TableHead>
            <TableHead className="hidden md:table-cell">目标肌群</TableHead>
            <TableHead className="hidden md:table-cell">器械类型</TableHead>
            <TableHead className="hidden lg:table-cell">健身目标</TableHead>
            <TableHead className="hidden lg:table-cell">使用场景</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exerciseItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{getDifficultyBadge(item.difficulty)}</TableCell>
              <TableCell className="hidden md:table-cell">
                {getTruncatedList(item.muscleTypeIds, 2)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {item.equipmentTypeId || "未指定"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {getTruncatedList(item.fitnessGoalsIds, 1)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {getTruncatedList(item.usageScenariosIds, 1)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onView(item)}
                      title="查看详情"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(item)}
                    title="编辑"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 