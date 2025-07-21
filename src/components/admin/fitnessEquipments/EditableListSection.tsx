import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface EditableListSectionProps {
  /**
   * 标签文本
   */
  label: string;
  
  /**
   * 列表项
   */
  items: string[];
  
  /**
   * 列表项变更回调
   */
  onItemsChange: (items: string[]) => void;
  
  /**
   * 添加按钮文本
   */
  addButtonText: string;
  
  /**
   * 占位符前缀
   */
  placeholderPrefix: string;
}

/**
 * 可编辑列表区域组件，用于展示和编辑文本列表（如使用指南、安全提示等）
 * @param props 组件属性
 * @returns 可编辑列表区域组件
 */
export function EditableListSection({
  label,
  items,
  onItemsChange,
  addButtonText,
  placeholderPrefix,
}: EditableListSectionProps) {
  /**
   * 添加新条目
   */
  const addItem = () => {
    onItemsChange([...items, ""]);
  };

  /**
   * 更新条目
   * @param index 条目索引
   * @param value 条目值
   */
  const updateItem = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    onItemsChange(updatedItems);
  };

  /**
   * 删除条目
   * @param index 条目索引
   */
  const removeItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    onItemsChange(updatedItems);
  };

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")} className="text-right pt-2">
        {label}
      </Label>
      <div className="col-span-3 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`${placeholderPrefix} ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> {addButtonText}
        </Button>
      </div>
    </div>
  );
} 