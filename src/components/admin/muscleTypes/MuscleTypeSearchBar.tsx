import { Button } from "@/components/ui/button";
import { BodyPartType } from "@/model/fit-record/BodyType/bodyPartType/type";

interface MuscleTypeSearchBarProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  onSearch: () => void;
  bodyParts: BodyPartType[];
  selectedBodyPartId: string;
  onBodyPartChange: (bodyPartId: string) => void;
}

/**
 * 肌肉类型搜索栏组件
 * @param props 组件属性
 * @returns 肌肉类型搜索栏组件
 */
export function MuscleTypeSearchBar({
  keyword,
  setKeyword,
  onSearch,
  bodyParts,
  selectedBodyPartId,
  onBodyPartChange,
}: MuscleTypeSearchBarProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="grid gap-2 flex-1">
        <label htmlFor="search" className="text-sm font-medium">
          搜索肌肉类型
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
        <label htmlFor="bodyPart" className="text-sm font-medium">
          身体部位
        </label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={selectedBodyPartId}
          onChange={(e) => onBodyPartChange(e.target.value)}
        >
          <option value="">全部部位</option>
          {bodyParts.map((bodyPart) => (
            <option key={bodyPart._id} value={bodyPart._id}>
              {bodyPart.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 