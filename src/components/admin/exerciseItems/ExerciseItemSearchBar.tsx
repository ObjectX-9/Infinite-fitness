import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 关键词搜索 */}
        <div className="grid gap-2">
          <Label htmlFor="search">搜索训练动作</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              type="text"
              placeholder="搜索名称或描述..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
          </div>
        </div>

        {/* 难度筛选 */}
        <div className="grid gap-2">
          <Label htmlFor="difficulty">难度筛选</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="选择难度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部难度</SelectItem>
              <SelectItem value={DifficultyLevel.EASY}>简单</SelectItem>
              <SelectItem value={DifficultyLevel.MEDIUM}>中等</SelectItem>
              <SelectItem value={DifficultyLevel.HARD}>困难</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* 搜索按钮 */}
        <div className="grid gap-2 items-end">
          <Button onClick={onSearch}>搜索</Button>
        </div>
      </div>
    </div>
  );
} 