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
import { MuscleType } from "@/model/fit-record/BodyType/muscleType/type";
import { BodyPartType } from "@/model/fit-record/BodyType/bodyPartType/type";

interface MuscleTypeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  muscleType: Partial<MuscleType>;
  onMuscleTypeChange: (muscleType: Partial<MuscleType>) => void;
  onSubmit: (muscleType: Partial<MuscleType>) => void;
  bodyParts: BodyPartType[];
}

/**
 * 肌肉类型编辑对话框组件
 * @param props 组件属性
 * @returns 肌肉类型编辑对话框组件
 */
export function MuscleTypeModal({
  isOpen,
  onOpenChange,
  isEditMode,
  muscleType,
  onMuscleTypeChange,
  onSubmit,
  bodyParts,
}: MuscleTypeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 处理表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(muscleType);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 更新肌肉类型数据
   * @param field 字段名
   * @param value 字段值
   */
  const updateMuscleType = (field: keyof MuscleType, value: string | number | boolean | string[]) => {
    onMuscleTypeChange({
      ...muscleType,
      [field]: value,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "编辑肌肉类型" : "添加肌肉类型"}
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
                value={muscleType.name || ""}
                onChange={(e) => updateMuscleType("name", e.target.value)}
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
                value={muscleType.description || ""}
                onChange={(e) => updateMuscleType("description", e.target.value)}
                className="col-span-3"
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bodyPartId" className="text-right">
                所属部位
              </Label>
              <select
                id="bodyPartId"
                value={muscleType.bodyPartId || ""}
                onChange={(e) => updateMuscleType("bodyPartId", e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">请选择身体部位</option>
                {bodyParts.map((bodyPart) => (
                  <option key={bodyPart._id} value={bodyPart._id}>
                    {bodyPart.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">
                排序
              </Label>
              <Input
                id="order"
                type="number"
                value={muscleType.order || 0}
                onChange={(e) => updateMuscleType("order", Number(e.target.value))}
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
                    checked={!!muscleType.isCustom}
                    onChange={(e) => updateMuscleType("isCustom", e.target.checked)}
                    className="mr-2"
                  />
                  <span>是否为自定义肌肉类型</span>
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