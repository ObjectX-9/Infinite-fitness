import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

/**
 * 身体部位搜索栏组件：提供关键词和类别筛选功能
 * @param keyword - 搜索关键词
 * @param setKeyword - 设置关键词的函数
 * @param category - 当前选中的分类
 * @param setCategory - 设置分类的函数
 * @param onSearch - 搜索处理函数
 * @returns 身体部位搜索栏组件
 */
interface BodyPartSearchBarProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  onSearch: () => void;
}

export function BodyPartSearchBar({
  keyword,
  setKeyword,
  onSearch,
}: BodyPartSearchBarProps) {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <Input
        placeholder="搜索名称或描述..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
        className="max-w-sm"
      />
      <Button variant="secondary" onClick={onSearch}>
        <Search className="h-4 w-4 mr-2" /> 搜索
      </Button>
    </div>
  );
}
