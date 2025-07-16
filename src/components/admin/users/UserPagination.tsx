import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * 用户分页组件：展示分页控制和每页数量选择
 * @param props - 组件属性
 * @returns 分页控制组件
 */
interface UserPaginationProps {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
}

export function UserPagination({
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
}: UserPaginationProps) {
  /**
   * 生成分页项
   * @returns 分页项组件数组
   */
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5; // 最多显示5个页码

    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // 第一页
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
        </PaginationItem>
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // 页码
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // 最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  /**
   * 处理上一页点击
   */
  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  /**
   * 处理下一页点击
   */
  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="mt-4 flex justify-between">
      <div className="flex items-center gap-2">
        <Select
          value={limit.toString()}
          onValueChange={(value) => setLimit(parseInt(value))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            onClick={handlePrevious}
            aria-disabled={page === 1}
          />
          {renderPaginationItems()}
          <PaginationNext
            onClick={handleNext}
            aria-disabled={page === totalPages}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}