import { Button } from "@/components/ui/button";

interface FitnessEquipmentPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

/**
 * 健身器械分页组件
 * @param props 组件属性
 * @returns 健身器械分页组件
 */
export function FitnessEquipmentPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: FitnessEquipmentPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        共 {total} 条记录，当前第 {page}/{totalPages} 页
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          下一页
        </Button>
        <select
          className="h-8 rounded-md border border-input px-2 text-sm"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={5}>5条/页</option>
          <option value={10}>10条/页</option>
          <option value={20}>20条/页</option>
          <option value={50}>50条/页</option>
        </select>
      </div>
    </div>
  );
} 