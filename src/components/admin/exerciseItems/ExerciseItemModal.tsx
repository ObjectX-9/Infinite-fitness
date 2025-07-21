import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BaseExerciseItem } from "@/model/fit-record/ExerciseItem/type";
import { FitnessGoal } from "@/model/fit-record/ExerciseItem/fitnessGoal/type";
import { MuscleType } from "@/model/fit-record/BodyType/muscleType/type";
import { UsageScenario } from "@/model/fit-record/ExerciseItem/usageScenarios/type";
import { ExerciseItemForm } from "./ExerciseItemForm";

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
}: ExerciseItemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  /**
   * 处理表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 确保所有文件都已上传
      if (uploadingImages || uploadingVideos) {
        // toast.error("文件上传中，请稍候再提交");
        return;
      }

      await onSubmit(exerciseItem);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 处理上传状态变更
   * @param type 文件类型
   * @param isUploading 是否上传中
   */
  const handleUploadingChange = (type: "images" | "videos", isUploading: boolean) => {
    if (type === "images") {
      setUploadingImages(isUploading);
    } else {
      setUploadingVideos(isUploading);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "编辑训练动作" : "添加训练动作"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ExerciseItemForm
            exerciseItem={exerciseItem}
            onExerciseItemChange={onExerciseItemChange}
            onUploadingChange={handleUploadingChange}
            muscleTypes={muscleTypes}
            fitnessGoals={fitnessGoals}
            usageScenarios={usageScenarios}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || uploadingImages || uploadingVideos}
            >
              {isSubmitting
                ? "提交中..."
                : uploadingImages || uploadingVideos
                  ? "文件上传中..."
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