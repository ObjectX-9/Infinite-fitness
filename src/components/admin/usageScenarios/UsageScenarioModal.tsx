import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UsageScenario } from "@/model/fit-record/ExerciseItem/usageScenarios/type";

interface UsageScenarioModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  usageScenario: Partial<UsageScenario>;
  onUsageScenarioChange: (usageScenario: Partial<UsageScenario>) => void;
  onSubmit: (usageScenario: Partial<UsageScenario>) => void;
}

/**
 * 使用场景编辑对话框组件
 * @param props 组件属性
 * @returns 使用场景编辑对话框组件
 */
export function UsageScenarioModal({
  isOpen,
  onOpenChange,
  isEditMode,
  usageScenario,
  onUsageScenarioChange,
  onSubmit,
}: UsageScenarioModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 处理表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(usageScenario);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 更新使用场景数据
   * @param field 字段名
   * @param value 字段值
   */
  const updateUsageScenario = (field: keyof UsageScenario, value: string | number | boolean | string[]) => {
    onUsageScenarioChange({
      ...usageScenario,
      [field]: value,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "编辑使用场景" : "添加使用场景"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={usageScenario.name || ""}
                onChange={(e) => updateUsageScenario("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={usageScenario.description || ""}
                onChange={(e) => updateUsageScenario("description", e.target.value)}
                className="col-span-3"
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrls" className="text-right">
                图片URL
              </Label>
              <Input
                id="imageUrls"
                value={usageScenario.imageUrls ? usageScenario.imageUrls[0] || "" : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateUsageScenario("imageUrls", value ? [value] : []);
                }}
                placeholder="输入图片URL"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">
                排序
              </Label>
              <Input
                id="order"
                type="number"
                value={usageScenario.order || 0}
                onChange={(e) => updateUsageScenario("order", Number(e.target.value))}
                className="col-span-3"
                min={0}
              />
            </div>
            {isEditMode && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isCustom" className="text-right">
                  自定义
                </Label>
                <div className="col-span-3 flex items-center">
                  <input
                    type="checkbox"
                    id="isCustom"
                    checked={!!usageScenario.isCustom}
                    onChange={(e) => updateUsageScenario("isCustom", e.target.checked)}
                    className="mr-2"
                  />
                  <span>是否为自定义使用场景</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "提交中..."
                : isEditMode
                ? "保存修改"
                : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 