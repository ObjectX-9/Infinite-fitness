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
import { FitnessEquipment } from "@/model/fit-record/fitnessEquipment/type";
import { fitnessEquipmentBusiness } from "@/app/business/fitnessEquipment";
import { SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Select, SelectContent } from "@/components/ui/select";

interface FitnessEquipmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  fitnessEquipment: Partial<FitnessEquipment>;
  onFitnessEquipmentChange: (fitnessEquipment: Partial<FitnessEquipment>) => void;
  onSubmit: (fitnessEquipment: Partial<FitnessEquipment>) => void;
}

/**
 * 健身器械编辑对话框组件
 * @param props 组件属性
 * @returns 健身器械编辑对话框组件
 */
export function FitnessEquipmentModal({
  isOpen,
  onOpenChange,
  isEditMode,
  fitnessEquipment,
  onFitnessEquipmentChange,
  onSubmit,
}: FitnessEquipmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 处理表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(fitnessEquipment);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 更新健身器械数据
   * @param field 字段名
   * @param value 字段值
   */
  const updateFitnessEquipment = (field: keyof FitnessEquipment, value: string | number | boolean | string[]) => {
    onFitnessEquipmentChange({
      ...fitnessEquipment,
      [field]: value,
    });
  };

  /**
   * 处理字符串数组字段变更
   */
  const handleArrayStringChange = (field: keyof FitnessEquipment, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    updateFitnessEquipment(field, items);
  };

  /**
   * 处理ID数组字段变更
   */
  const handleArrayIdsChange = (field: keyof FitnessEquipment, value: string) => {
    const ids = value.split(',').map(id => id.trim()).filter(Boolean);
    updateFitnessEquipment(field, ids);
  };

  // 获取所有器械类别选项
  const categoryOptions = fitnessEquipmentBusiness.getEquipmentCategories();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "编辑健身器械" : "添加健身器械"}
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
                value={fitnessEquipment.name || ""}
                onChange={(e) => updateFitnessEquipment("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                类别 <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={fitnessEquipment.category || ""} 
                onValueChange={(value) => updateFitnessEquipment("category", value)}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>器械类别</SelectLabel>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={fitnessEquipment.description || ""}
                onChange={(e) => updateFitnessEquipment("description", e.target.value)}
                className="col-span-3"
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrls" className="text-right">
                图片URLs
              </Label>
              <Input
                id="imageUrls"
                value={fitnessEquipment.imageUrls ? fitnessEquipment.imageUrls.join(", ") : ""}
                onChange={(e) => handleArrayStringChange("imageUrls", e.target.value)}
                placeholder="图片URL，多个请用逗号分隔"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetMusclesIds" className="text-right">
                目标肌群IDs
              </Label>
              <Input
                id="targetMusclesIds"
                value={fitnessEquipment.targetMusclesIds ? fitnessEquipment.targetMusclesIds.join(", ") : ""}
                onChange={(e) => handleArrayIdsChange("targetMusclesIds", e.target.value)}
                placeholder="目标肌群ID，多个请用逗号分隔"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fitnessGoalsIds" className="text-right">
                健身目标IDs
              </Label>
              <Input
                id="fitnessGoalsIds"
                value={fitnessEquipment.fitnessGoalsIds ? fitnessEquipment.fitnessGoalsIds.join(", ") : ""}
                onChange={(e) => handleArrayIdsChange("fitnessGoalsIds", e.target.value)}
                placeholder="健身目标ID，多个请用逗号分隔"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usageScenariosIds" className="text-right">
                使用场景IDs
              </Label>
              <Input
                id="usageScenariosIds"
                value={fitnessEquipment.usageScenariosIds ? fitnessEquipment.usageScenariosIds.join(", ") : ""}
                onChange={(e) => handleArrayIdsChange("usageScenariosIds", e.target.value)}
                placeholder="使用场景ID，多个请用逗号分隔"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usageInstructions" className="text-right">
                使用指南
              </Label>
              <Textarea
                id="usageInstructions"
                value={fitnessEquipment.usageInstructions ? fitnessEquipment.usageInstructions.join("\n") : ""}
                onChange={(e) => {
                  const instructions = e.target.value.split("\n").filter(Boolean);
                  updateFitnessEquipment("usageInstructions", instructions);
                }}
                placeholder="每行一条使用说明"
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="safetyTips" className="text-right">
                安全提示
              </Label>
              <Textarea
                id="safetyTips"
                value={fitnessEquipment.safetyTips || ""}
                onChange={(e) => updateFitnessEquipment("safetyTips", e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">
                排序
              </Label>
              <Input
                id="order"
                type="number"
                value={fitnessEquipment.order || 0}
                onChange={(e) => updateFitnessEquipment("order", Number(e.target.value))}
                className="col-span-3"
                min={0}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                备注
              </Label>
              <Input
                id="notes"
                value={fitnessEquipment.notes || ""}
                onChange={(e) => updateFitnessEquipment("notes", e.target.value)}
                className="col-span-3"
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
                    checked={!!fitnessEquipment.isCustom}
                    onChange={(e) => updateFitnessEquipment("isCustom", e.target.checked)}
                    className="mr-2"
                  />
                  <span>是否为自定义器械</span>
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