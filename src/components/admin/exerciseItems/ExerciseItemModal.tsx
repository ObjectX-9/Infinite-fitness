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
import { BaseExerciseItem, DifficultyLevel } from "@/model/fit-record/ExerciseItem/type";
import { FitnessGoal } from "@/model/fit-record/ExerciseItem/fitnessGoal/type";
import { MuscleType } from "@/model/fit-record/BodyType/muscleType/type";
import { UsageScenario } from "@/model/fit-record/ExerciseItem/usageScenarios/type";
import { FitnessEquipment } from "@/model/fit-record/fitnessEquipment/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExerciseItemModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  exerciseItem: Partial<BaseExerciseItem>;
  onExerciseItemChange: (exerciseItem: Partial<BaseExerciseItem>) => void;
  onSubmit: (exerciseItem: Partial<BaseExerciseItem>) => void;
  // 依赖数据
  muscleTypes: MuscleType[];
  fitnessGoals: FitnessGoal[];
  usageScenarios: UsageScenario[];
  fitnessEquipments: FitnessEquipment[];
}

/**
 * 训练动作编辑对话框组件
 * @param props 组件属性
 * @returns 训练动作编辑对话框组件
 */
export function ExerciseItemModal({
  isOpen,
  onOpenChange,
  isEditMode,
  exerciseItem,
  onExerciseItemChange,
  onSubmit,
  muscleTypes,
  fitnessGoals,
  usageScenarios,
  fitnessEquipments,
}: ExerciseItemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 处理表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(exerciseItem);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 更新训练动作数据
   * @param field 字段名
   * @param value 字段值
   */
  const updateExerciseItem = (field: keyof BaseExerciseItem, value: unknown) => {
    onExerciseItemChange({
      ...exerciseItem,
      [field]: value,
    });
  };

  /**
   * 处理多选项切换
   * @param field 字段名
   * @param value 值
   * @param checked 是否选中
   */
  const handleMultiSelectToggle = (field: keyof BaseExerciseItem, value: string, checked: boolean) => {
    const currentValues = exerciseItem[field] as string[] || [];
    let newValues: string[];
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    updateExerciseItem(field, newValues);
  };

  /**
   * 检查多选项是否被选中
   * @param field 字段名
   * @param value 值
   * @returns 是否选中
   */
  const isItemSelected = (field: keyof BaseExerciseItem, value: string): boolean => {
    const currentValues = exerciseItem[field] as string[] || [];
    return currentValues.includes(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "编辑训练动作" : "添加训练动作"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="grid gap-6 py-4">
              {/* 基本信息部分 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">基本信息</h3>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      动作名称 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={exerciseItem.name || ""}
                      onChange={(e) => updateExerciseItem("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">
                      难度 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={exerciseItem.difficulty || ""}
                      onValueChange={(value) => updateExerciseItem("difficulty", value)}
                    >
                      <SelectTrigger id="difficulty">
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

                <div className="space-y-2">
                  <Label htmlFor="description">
                    动作描述 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={exerciseItem.description || ""}
                    onChange={(e) => updateExerciseItem("description", e.target.value)}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">视频链接</Label>
                    <Input
                      id="videoUrl"
                      value={exerciseItem.videoUrl || ""}
                      onChange={(e) => updateExerciseItem("videoUrl", e.target.value)}
                      placeholder="输入视频URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">图片链接</Label>
                    <Input
                      id="imageUrl"
                      value={exerciseItem.imageUrls?.[0] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateExerciseItem("imageUrls", value ? [value] : []);
                      }}
                      placeholder="输入图片URL"
                    />
                  </div>
                </div>
              </div>
              
              {/* 分类信息部分 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">分类信息</h3>
                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="equipmentTypeId">
                    器械类型 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={exerciseItem.equipmentTypeId || ""}
                    onValueChange={(value) => updateExerciseItem("equipmentTypeId", value)}
                  >
                    <SelectTrigger id="equipmentTypeId">
                      <SelectValue placeholder="选择器械类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {fitnessEquipments.map((equipment) => (
                        <SelectItem key={equipment._id} value={equipment._id}>
                          {equipment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Accordion type="multiple" className="w-full">
                  {/* 肌肉群组 */}
                  <AccordionItem value="muscleTypes">
                    <AccordionTrigger className="hover:no-underline">
                      目标肌群 <span className="text-red-500 ml-1">*</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {muscleTypes.map((muscleType) => (
                          <div key={muscleType._id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`muscleType-${muscleType._id}`}
                              checked={isItemSelected("muscleTypeIds", muscleType._id)}
                              onCheckedChange={(checked) => {
                                handleMultiSelectToggle(
                                  "muscleTypeIds",
                                  muscleType._id,
                                  !!checked
                                );
                              }}
                            />
                            <Label htmlFor={`muscleType-${muscleType._id}`}>
                              {muscleType.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 健身目标 */}
                  <AccordionItem value="fitnessGoals">
                    <AccordionTrigger className="hover:no-underline">
                      健身目标 <span className="text-red-500 ml-1">*</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {fitnessGoals.map((fitnessGoal) => (
                          <div key={fitnessGoal._id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`fitnessGoal-${fitnessGoal._id}`}
                              checked={isItemSelected("fitnessGoalsIds", fitnessGoal._id)}
                              onCheckedChange={(checked) => {
                                handleMultiSelectToggle(
                                  "fitnessGoalsIds",
                                  fitnessGoal._id,
                                  !!checked
                                );
                              }}
                            />
                            <Label htmlFor={`fitnessGoal-${fitnessGoal._id}`}>
                              {fitnessGoal.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 使用场景 */}
                  <AccordionItem value="usageScenarios">
                    <AccordionTrigger className="hover:no-underline">
                      使用场景 <span className="text-red-500 ml-1">*</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {usageScenarios.map((scenario) => (
                          <div key={scenario._id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`scenario-${scenario._id}`}
                              checked={isItemSelected("usageScenariosIds", scenario._id)}
                              onCheckedChange={(checked) => {
                                handleMultiSelectToggle(
                                  "usageScenariosIds",
                                  scenario._id,
                                  !!checked
                                );
                              }}
                            />
                            <Label htmlFor={`scenario-${scenario._id}`}>
                              {scenario.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* 训练指导部分 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">训练指导</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recommendedSets">推荐组数</Label>
                    <Input
                      id="recommendedSets"
                      type="number"
                      value={exerciseItem.recommendedSets || ""}
                      onChange={(e) => updateExerciseItem("recommendedSets", Number(e.target.value))}
                      min={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recommendedReps">推荐次数</Label>
                    <Input
                      id="recommendedReps"
                      value={exerciseItem.recommendedReps || ""}
                      onChange={(e) => updateExerciseItem("recommendedReps", e.target.value)}
                      placeholder="例如: 8-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recommendedWeight">推荐重量</Label>
                    <Input
                      id="recommendedWeight"
                      value={exerciseItem.recommendedWeight || ""}
                      onChange={(e) => updateExerciseItem("recommendedWeight", e.target.value)}
                      placeholder="例如: 中等重量/最大重量的60%-80%"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recommendedRestTime">推荐休息时间</Label>
                    <Input
                      id="recommendedRestTime"
                      value={exerciseItem.recommendedRestTime || ""}
                      onChange={(e) => updateExerciseItem("recommendedRestTime", e.target.value)}
                      placeholder="例如: 60-90秒"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">动作时长</Label>
                  <Input
                    id="duration"
                    value={exerciseItem.duration || ""}
                    onChange={(e) => updateExerciseItem("duration", e.target.value)}
                    placeholder="例如: 每次3秒向心收缩，2秒保持，3秒离心"
                  />
                </div>
              </div>

              {/* 额外信息部分 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">额外信息</h3>
                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="tips">动作注意事项</Label>
                  <Textarea
                    id="tips"
                    value={exerciseItem.tips?.join('\n') || ""}
                    onChange={(e) => {
                      const tips = e.target.value.split('\n').filter(tip => tip.trim() !== '');
                      updateExerciseItem("tips", tips);
                    }}
                    placeholder="每行一个注意事项"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commonMistakes">常见错误</Label>
                  <Textarea
                    id="commonMistakes"
                    value={exerciseItem.commonMistakes?.join('\n') || ""}
                    onChange={(e) => {
                      const mistakes = e.target.value.split('\n').filter(mistake => mistake.trim() !== '');
                      updateExerciseItem("commonMistakes", mistakes);
                    }}
                    placeholder="每行一个常见错误"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternatives">替代动作</Label>
                  <Textarea
                    id="alternatives"
                    value={exerciseItem.alternatives?.join('\n') || ""}
                    onChange={(e) => {
                      const alternatives = e.target.value.split('\n').filter(alt => alt.trim() !== '');
                      updateExerciseItem("alternatives", alternatives);
                    }}
                    placeholder="每行一个替代动作"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caloriesBurned">消耗卡路里（每组）</Label>
                  <Input
                    id="caloriesBurned"
                    type="number"
                    value={exerciseItem.caloriesBurned || ""}
                    onChange={(e) => updateExerciseItem("caloriesBurned", Number(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">个人笔记</Label>
                  <Textarea
                    id="notes"
                    value={exerciseItem.notes || ""}
                    onChange={(e) => updateExerciseItem("notes", e.target.value)}
                    placeholder="任何其他信息..."
                    rows={2}
                  />
                </div>

                {isEditMode && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isCustom"
                      checked={!!exerciseItem.isCustom}
                      onCheckedChange={(checked) => updateExerciseItem("isCustom", !!checked)}
                    />
                    <Label htmlFor="isCustom">是否为自定义动作</Label>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="pt-4">
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