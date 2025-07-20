import { useState, useEffect } from "react";
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
import { FileUploader, FileObject } from "@/components/FileUploader";
import { uploadBusiness } from "@/app/business/upload";
import { toast } from "sonner";

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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileObject[]>([]);

  /**
   * 初始化已上传文件
   */
  const initFileObjects = () => {
    if (usageScenario.imageUrls && usageScenario.imageUrls.length > 0) {
      return usageScenario.imageUrls.map((url) => ({
        file: new File([], "uploaded-image"),
        previewUrl: url,
        serverUrl: url,
        status: "success" as "idle" | "uploading" | "success" | "error",
      }));
    }
    return [];
  };

  /**
   * 处理表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 确保所有文件都已上传
      if (selectedFiles.some((file) => file.status === "uploading")) {
        toast.error("图片上传中，请稍候再提交");
        return;
      }

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
  const updateUsageScenario = (
    field: keyof UsageScenario,
    value: string | number | boolean | string[]
  ) => {
    onUsageScenarioChange({
      ...usageScenario,
      [field]: value,
    });
  };

  /**
   * 处理文件选择
   * @param files 选择的文件
   */
  const handleFilesSelected = async (files: FileObject[]) => {
    setSelectedFiles(files);

    // 过滤出未上传的文件
    const newFiles = files.filter(
      (file) => file.status !== "success" && !file.serverUrl
    );
    if (newFiles.length === 0) return;

    setUploadingImages(true);

    try {
      // 更新所有待上传文件的状态为上传中
      const updatedFiles = files.map((file) => {
        if (newFiles.includes(file)) {
          return {
            ...file,
            status: "uploading" as "idle" | "uploading" | "success" | "error",
            progress: 0,
          };
        }
        return file;
      });
      setSelectedFiles(updatedFiles);

      // 上传所有新文件
      const uploadPromises = newFiles.map(async (fileObj) => {
        try {
          const formData = new FormData();
          formData.append("file", fileObj.file);
          formData.append("path", "usage-scenario-images");
          const response = await uploadBusiness.uploadFile(formData);

          // 更新文件状态
          setSelectedFiles((prev) => {
            const newFiles = [...prev];
            const fileIndex = newFiles.findIndex((f) => f === fileObj);
            if (fileIndex !== -1) {
              newFiles[fileIndex] = {
                ...newFiles[fileIndex],
                status: "success" as "idle" | "uploading" | "success" | "error",
                progress: 100,
                serverUrl: response.url,
              };
            }
            return newFiles;
          });

          // 更新使用场景的imageUrls
          const updatedUrls = [...(usageScenario.imageUrls || [])];
          updatedUrls.push(response.url);
          updateUsageScenario("imageUrls", updatedUrls);

          return response.url;
        } catch (error) {
          console.error("上传图片失败:", error);
          // 更新文件状态为错误
          setSelectedFiles((prev) => {
            const newFiles = [...prev];
            const fileIndex = newFiles.findIndex((f) => f === fileObj);
            if (fileIndex !== -1) {
              newFiles[fileIndex] = {
                ...newFiles[fileIndex],
                status: "error" as "idle" | "uploading" | "success" | "error",
                error: "上传失败",
              };
            }
            return newFiles;
          });

          toast.error(`图片 ${fileObj.file.name} 上传失败`);
          return null;
        }
      });

      await Promise.all(uploadPromises);
    } finally {
      setUploadingImages(false);
    }
  };

  /**
   * 处理文件删除
   * @param index 文件索引
   */
  const handleFileRemove = (index: number) => {
    const fileToRemove = selectedFiles[index];

    // 从selectedFiles中移除
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);

    // 如果文件已上传，从imageUrls中也移除
    if (fileToRemove.serverUrl && usageScenario.imageUrls) {
      const updatedUrls = usageScenario.imageUrls.filter(
        (url) => url !== fileToRemove.serverUrl
      );
      updateUsageScenario("imageUrls", updatedUrls);
    }
  };

  // 组件挂载或usageScenario变化时初始化文件对象
  useEffect(() => {
    if (isOpen) {
      setSelectedFiles(initFileObjects());
    }
  }, [isOpen, usageScenario.imageUrls]);

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
                onChange={(e) =>
                  updateUsageScenario("description", e.target.value)
                }
                className="col-span-3"
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="imageUploader" className="text-right pt-2">
                图片
              </Label>
              <div className="col-span-3">
                <FileUploader
                  fileType="image"
                  multiple={true}
                  maxSize={5}
                  hintText="支持JPG、PNG、GIF格式，单张图片大小不超过5MB"
                  selectedFiles={selectedFiles}
                  onFilesSelected={handleFilesSelected}
                  onFileRemove={handleFileRemove}
                  disabled={isSubmitting || uploadingImages}
                />
                {uploadingImages && (
                  <div className="mt-2 text-sm text-amber-500">
                    图片上传中，请稍候...
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">
                排序
              </Label>
              <Input
                id="order"
                type="number"
                value={usageScenario.order || 0}
                onChange={(e) =>
                  updateUsageScenario("order", Number(e.target.value))
                }
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
                    onChange={(e) =>
                      updateUsageScenario("isCustom", e.target.checked)
                    }
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
            <Button type="submit" disabled={isSubmitting || uploadingImages}>
              {isSubmitting
                ? "提交中..."
                : uploadingImages
                ? "图片上传中..."
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
