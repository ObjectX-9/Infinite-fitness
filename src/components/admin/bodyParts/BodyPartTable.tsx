import { BodyPartType } from "@/model/fit-record/BodyType/bodyPartType/type";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { getCategoryLabel } from "./const";

/**
 * 身体部位表格组件：展示身体部位列表数据
 * @param bodyParts - 身体部位数据列表
 * @param page - 当前页码
 * @param limit - 每页显示条数
 * @param loading - 是否正在加载
 * @param onEdit - 编辑处理函数
 * @param onDelete - 删除处理函数
 * @returns 身体部位表格组件
 */
interface BodyPartTableProps {
  bodyParts: BodyPartType[];
  page: number;
  limit: number;
  loading: boolean;
  onEdit: (bodyPart: BodyPartType) => void;
  onDelete: (id: string) => void;
}

export function BodyPartTable({
  bodyParts,
  page,
  limit,
  loading,
  onEdit,
  onDelete,
}: BodyPartTableProps) {
  return (
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
          ) : bodyParts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                没有找到数据
              </TableCell>
            </TableRow>
          ) : (
            bodyParts.map((bodyPart, index) => (
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
                      <DropdownMenuItem onClick={() => onEdit(bodyPart)}>
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(bodyPart._id)}
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
  );
}
