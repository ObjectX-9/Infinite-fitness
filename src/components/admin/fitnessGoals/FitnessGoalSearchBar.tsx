import { Button } from "@/components/ui/button";

interface FitnessGoalSearchBarProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  onSearch: () => void;
}

/**
 * 训练目标搜索栏组件
 * @param props 组件属性
 * @returns 训练目标搜索栏组件
 */
export function FitnessGoalSearchBar({
  keyword,
  setKeyword,
  onSearch,
}: FitnessGoalSearchBarProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="grid gap-2 flex-1">
        <label htmlFor="search" className="text-sm font-medium">
          搜索训练目标
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="搜索名称或描述..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <Button onClick={onSearch}>搜索</Button>
        </div>
      </div>
    </div>
  );
} 