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
import { FitnessGoal } from "@/model/fit-record/ExerciseItem/fitnessGoal/type";

interface FitnessGoalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  fitnessGoal: Partial<FitnessGoal>;
  onFitnessGoalChange: (fitnessGoal: Partial<FitnessGoal>) => void;
  onSubmit: (fitnessGoal: Partial<FitnessGoal>) => void;
}

/**
 * 训练目标编辑对话框组件
 * @param props 组件属性
 * @returns 训练目标编辑对话框组件
 */
export function FitnessGoalModal({
  isOpen,
  onOpenChange,
  isEditMode,
  fitnessGoal,
  onFitnessGoalChange,
  onSubmit,
}: FitnessGoalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 处理表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(fitnessGoal);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 更新训练目标数据
   * @param field 字段名
   * @param value 字段值
   */
  const updateFitnessGoal = (field: keyof FitnessGoal, value: string | number | boolean | string[]) => {
    onFitnessGoalChange({
      ...fitnessGoal,
      [field]: value,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "编辑训练目标" : "添加训练目标"}
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
                value={fitnessGoal.name || ""}
                onChange={(e) => updateFitnessGoal("name", e.target.value)}
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
                value={fitnessGoal.description || ""}
                onChange={(e) => updateFitnessGoal("description", e.target.value)}
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
                value={fitnessGoal.imageUrls ? fitnessGoal.imageUrls[0] || "" : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFitnessGoal("imageUrls", value ? [value] : []);
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
                value={fitnessGoal.order || 0}
                onChange={(e) => updateFitnessGoal("order", Number(e.target.value))}
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
                    checked={!!fitnessGoal.isCustom}
                    onChange={(e) => updateFitnessGoal("isCustom", e.target.checked)}
                    className="mr-2"
                  />
                  <span>是否为自定义训练目标</span>
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