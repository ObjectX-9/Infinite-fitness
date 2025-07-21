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
import { Edit, Trash2, Eye, FileVideo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>难度</TableHead>
            <TableHead>媒体</TableHead>
            <TableHead>动作描述</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exerciseItems.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{getDifficultyBadge(item.difficulty)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {item.imageUrls && item.imageUrls.length > 0 && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border">
                      <Image
                        src={item.imageUrls[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {item.imageUrls.length > 1 && (
                        <span className="absolute bottom-0 right-0 rounded-tl-sm bg-background/80 px-1 text-xs">
                          +{item.imageUrls.length - 1}
                        </span>
                      )}
                    </div>
                  )}
                  {item.videoUrl && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                      <FileVideo className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  {(!item.imageUrls || item.imageUrls.length === 0) && !item.videoUrl && (
                    <span className="text-xs text-muted-foreground">无媒体</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.description}</TableCell>
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
                    onClick={() => onDelete(item._id)}
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