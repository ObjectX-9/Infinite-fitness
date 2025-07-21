import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DifficultyLevel } from "@/model/fit-record/ExerciseItem/type";

interface ExerciseItemSearchBarProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  onSearch: () => void;
}

/**
 * 训练动作搜索栏组件
 * @param props 组件属性
 * @returns 训练动作搜索栏组件
 */
export function ExerciseItemSearchBar({
  keyword,
  setKeyword,
  difficulty,
  setDifficulty,
  onSearch,
}: ExerciseItemSearchBarProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="grid gap-2 flex-1">
        <label htmlFor="search" className="text-sm font-medium">
          搜索训练动作
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
      <div className="grid gap-2">
        <label htmlFor="difficulty" className="text-sm font-medium">
          难度筛选
        </label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择难度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DifficultyLevel.EASY}>简单</SelectItem>
            <SelectItem value={DifficultyLevel.MEDIUM}>中等</SelectItem>
            <SelectItem value={DifficultyLevel.HARD}>困难</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 