import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * 身体部位分页组件：提供分页控制和每页显示条数设置
 * @param page - 当前页码
 * @param limit - 每页显示条数
 * @param total - 总记录数
 * @param totalPages - 总页数
 * @param onPageChange - 页码变更处理函数
 * @param onLimitChange - 每页条数变更处理函数
 * @returns 身体部位分页组件
 */
interface BodyPartPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function BodyPartPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: BodyPartPaginationProps) {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">每页显示</p>
        <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
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
        <p className="text-sm text-muted-foreground">条记录，共 {total} 条</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          下一页
        </Button>
        <span className="text-sm text-muted-foreground">
          第 {page} 页，共 {totalPages} 页
        </span>
      </div>
    </div>
  );
}
