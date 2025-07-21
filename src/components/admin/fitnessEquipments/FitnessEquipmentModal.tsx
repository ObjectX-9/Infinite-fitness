import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FitnessEquipment } from "@/model/fit-record/fitnessEquipment/type";
import { FitnessEquipmentForm } from "./FitnessEquipmentForm";

interface FitnessEquipmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  fitnessEquipment: Partial<FitnessEquipment>;
  onFitnessEquipmentChange: (
    fitnessEquipment: Partial<FitnessEquipment>
  ) => void;
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

      await onSubmit(fitnessEquipment);
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
            {isEditMode ? "编辑健身器械" : "添加健身器械"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FitnessEquipmentForm
            fitnessEquipment={fitnessEquipment}
            onFitnessEquipmentChange={onFitnessEquipmentChange}
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            onUploadingChange={handleUploadingChange}
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
