import { Button } from "@/components/ui/button";
import { fitnessEquipmentBusiness } from "@/app/business/fitnessEquipment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FitnessEquipmentSearchBarProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  category: string;
  setCategory: (category: string) => void;
  onSearch: () => void;
}

/**
 * 健身器械搜索栏组件
 * @param props 组件属性
 * @returns 健身器械搜索栏组件
 */
export function FitnessEquipmentSearchBar({
  keyword,
  setKeyword,
  category,
  setCategory,
  onSearch,
}: FitnessEquipmentSearchBarProps) {
  // 获取所有类别选项
  const categoryOptions = fitnessEquipmentBusiness.getEquipmentCategories();
  
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="grid gap-2 flex-1">
        <label htmlFor="search" className="text-sm font-medium">
          搜索健身器械
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
        <label htmlFor="category" className="text-sm font-medium">
          类别筛选
        </label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择类别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类别</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 