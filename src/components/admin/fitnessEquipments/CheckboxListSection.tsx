import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CheckboxListSectionProps<T> {
  /**
   * 标签文本
   */
  label: string;
  
  /**
   * 列表项数据
   */
  items: T[];
  
  /**
   * 已选ID列表
   */
  selectedIds: string[];
  
  /**
   * 选择变更回调
   */
  onSelectionChange: (ids: string[]) => void;
  
  /**
   * 获取项目标签的函数
   */
  getItemLabel: (item: T) => string;
  
  /**
   * 是否加载中
   */
  isLoading?: boolean;
  
  /**
   * 加载中提示文本
   */
  loadingText?: string;
  
  /**
   * 空数据提示文本
   */
  emptyText?: string;
  
  /**
   * 已选数量提示文本
   */
  countText?: string;
  
  /**
   * 列表高度
   */
  height?: string;
}

/**
 * 复选框列表区域组件，用于展示和选择多个项目（如肌肉类型、健身目标等）
 * @param props 组件属性
 * @returns 复选框列表区域组件
 */
export function CheckboxListSection<T extends { _id: string }>({
  label,
  items,
  selectedIds,
  onSelectionChange,
  getItemLabel,
  isLoading = false,
  loadingText = "加载中...",
  emptyText = "暂无数据",
  countText,
  height = "200px",
}: CheckboxListSectionProps<T>) {
  /**
   * 处理选择变更
   * @param id 项目ID
   * @param checked 是否选中
   */
  const handleSelectionChange = (id: string, checked: boolean) => {
    let newSelectedIds = [...selectedIds];

    if (checked) {
      // 添加ID
      if (!newSelectedIds.includes(id)) {
        newSelectedIds.push(id);
      }
    } else {
      // 移除ID
      newSelectedIds = newSelectedIds.filter((itemId) => itemId !== id);
    }

    onSelectionChange(newSelectedIds);
  };

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")} className="text-right pt-2">
        {label}
      </Label>
      <div className="col-span-3">
        <div className="border rounded-md p-4" style={{ height }}>
          <ScrollArea className="h-full pr-4">
            {isLoading ? (
              <div className="text-center py-2">
                {loadingText}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-2 text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {items.map((item) => {
                  const isChecked = selectedIds.includes(item._id);
                  const itemLabel = getItemLabel(item);

                  return (
                    <div key={item._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${label.toLowerCase()}-${item._id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => 
                          handleSelectionChange(item._id, !!checked)
                        }
                      />
                      <label
                        htmlFor={`${label.toLowerCase()}-${item._id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {itemLabel}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
        {countText && (
          <div className="text-xs text-muted-foreground mt-1">
            {countText}
          </div>
        )}
      </div>
    </div>
  );
} 