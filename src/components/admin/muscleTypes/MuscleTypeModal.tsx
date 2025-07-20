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
import {
  MuscleType,
  EMuscleTypeCategory,
} from "@/model/fit-record/BodyType/muscleType/type";
import { BodyPartType } from "@/model/fit-record/BodyType/bodyPartType/type";
import { FileObject, FileUploader } from "@/components/FileUploader";
import { uploadBusiness } from "@/app/business/upload";
import { getMuscleTypeLabel } from "./const";
import { getCategoryLabel } from "../bodyParts/const";

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
  const [imageFiles, setImageFiles] = useState<FileObject[]>([]);
  const [videoFiles, setVideoFiles] = useState<FileObject[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [useCustomName, setUseCustomName] = useState(false);

  /**
   * 获取肌肉类型枚举值数组
   */
  const getMuscleTypeOptions = () => {
    return Object.values(EMuscleTypeCategory);
  };

  /**
   * 处理表单提交
   * @param e 表单事件
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // 上传图片
      const imageUrls = [...(muscleType.imageUrls || [])];
      for (const imageFile of imageFiles) {
        if (imageFile.serverUrl) {
          if (!imageUrls.includes(imageFile.serverUrl)) {
            imageUrls.push(imageFile.serverUrl);
          }
          continue;
        }

        try {
          const result = await uploadBusiness.uploadBodyImage(
            imageFile.file,
            "image/jpeg,image/png,image/gif,image/webp"
          );
          if (result && result.url) {
            imageUrls.push(result.url);
          }
        } catch (error) {
          console.error("上传图片失败:", error);
        }
      }

      // 上传视频
      const videoUrls = [...(muscleType.videoUrls || [])];
      for (const videoFile of videoFiles) {
        if (videoFile.serverUrl) {
          if (!videoUrls.includes(videoFile.serverUrl)) {
            videoUrls.push(videoFile.serverUrl);
          }
          continue;
        }

        try {
          const result = await uploadBusiness.uploadBodyVideo(
            videoFile.file,
            "video/mp4,video/quicktime,video/x-msvideo"
          );
          if (result && result.url) {
            videoUrls.push(result.url);
          }
        } catch (error) {
          console.error("上传视频失败:", error);
        }
      }

      // 更新肌肉类型数据
      const updatedMuscleType = {
        ...muscleType,
        imageUrls,
        videoUrls,
      };

      await onSubmit(updatedMuscleType);
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  /**
   * 更新肌肉类型数据
   * @param field 字段名
   * @param value 字段值
   */
  const updateMuscleType = (
    field: keyof MuscleType,
    value: string | number | boolean | string[]
  ) => {
    onMuscleTypeChange({
      ...muscleType,
      [field]: value,
    });
  };

  /**
   * 初始化文件上传组件
   */
  const initializeFileUploaders = () => {
    // 初始化已有的图片
    if (muscleType.imageUrls && muscleType.imageUrls.length > 0) {
      const existingImages = muscleType.imageUrls.map((url) => ({
        file: new File([], "existing-image"),
        serverUrl: url,
        status: "success" as const,
        progress: 100,
        previewUrl: url,
      }));
      setImageFiles(existingImages);
    } else {
      setImageFiles([]);
    }

    // 初始化已有的视频
    if (muscleType.videoUrls && muscleType.videoUrls.length > 0) {
      const existingVideos = muscleType.videoUrls.map((url) => ({
        file: new File([], "existing-video"),
        serverUrl: url,
        status: "success" as const,
        progress: 100,
        previewUrl: url,
      }));
      setVideoFiles(existingVideos);
    } else {
      setVideoFiles([]);
    }

    // 判断是否使用自定义名称
    setUseCustomName(
      !Object.values(EMuscleTypeCategory).includes(
        muscleType.name as EMuscleTypeCategory
      )
    );
  };

  /**
   * 处理对话框打开状态变更
   */
  const handleOpenChange = (open: boolean) => {
    if (open) {
      initializeFileUploaders();
    }
    onOpenChange(open);
  };

  /**
   * 删除肌肉类型的图片
   * @param url 图片URL
   */
  const handleRemoveImage = (index: number) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);

    // 如果是已有的图片，也要从muscleType中移除
    const fileToRemove = imageFiles[index];
    if (fileToRemove.serverUrl && muscleType.imageUrls) {
      const newImageUrls = muscleType.imageUrls.filter(
        (url) => url !== fileToRemove.serverUrl
      );
      updateMuscleType("imageUrls", newImageUrls);
    }
  };

  /**
   * 删除肌肉类型的视频
   * @param url 视频URL
   */
  const handleRemoveVideo = (index: number) => {
    const newVideoFiles = [...videoFiles];
    newVideoFiles.splice(index, 1);
    setVideoFiles(newVideoFiles);

    // 如果是已有的视频，也要从muscleType中移除
    const fileToRemove = videoFiles[index];
    if (fileToRemove.serverUrl && muscleType.videoUrls) {
      const newVideoUrls = muscleType.videoUrls.filter(
        (url) => url !== fileToRemove.serverUrl
      );
      updateMuscleType("videoUrls", newVideoUrls);
    }
  };

  /**
   * 切换使用自定义名称
   */
  const toggleUseCustomName = () => {
    setUseCustomName(!useCustomName);
    if (useCustomName && muscleType.name) {
      // 切换到系统预设名称时，清空自定义名称
      updateMuscleType("name", "");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "编辑肌肉类型" : "添加肌肉类型"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nameType" className="text-right">
                名称类型
              </Label>
              <div className="col-span-3 flex items-center">
                <input
                  type="checkbox"
                  id="nameType"
                  checked={useCustomName}
                  onChange={toggleUseCustomName}
                  className="mr-2"
                />
                <span>使用自定义名称</span>
              </div>
            </div>

            {useCustomName ? (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  自定义名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={muscleType.name || ""}
                  onChange={(e) => updateMuscleType("name", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  肌肉类型 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="name"
                  value={muscleType.name || ""}
                  onChange={(e) => updateMuscleType("name", e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                >
                  <option value="">请选择肌肉类型</option>
                  {getMuscleTypeOptions().map((type) => (
                    <option key={type} value={type}>
                      {getMuscleTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={muscleType.description || ""}
                onChange={(e) =>
                  updateMuscleType("description", e.target.value)
                }
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
                    {getCategoryLabel(bodyPart.name)}
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
                onChange={(e) =>
                  updateMuscleType("order", Number(e.target.value))
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
                    checked={!!muscleType.isCustom}
                    onChange={(e) =>
                      updateMuscleType("isCustom", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span>是否为自定义肌肉类型</span>
                </div>
              </div>
            )}

            {/* 图片上传区域 */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">肌肉图片</Label>
              <div className="col-span-3">
                <FileUploader
                  fileType="image"
                  multiple={true}
                  maxSize={5}
                  acceptedTypes="image/jpeg,image/png,image/gif,image/webp"
                  hintText="支持JPG、PNG、GIF、WEBP格式，单文件最大5MB"
                  selectedFiles={imageFiles}
                  onFilesSelected={setImageFiles}
                  onFileRemove={handleRemoveImage}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* 视频上传区域 */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">肌肉视频</Label>
              <div className="col-span-3">
                <FileUploader
                  fileType="video"
                  multiple={true}
                  maxSize={20}
                  acceptedTypes="video/mp4,video/quicktime,video/x-msvideo"
                  hintText="支持MP4、MOV、AVI格式，单文件最大20MB"
                  selectedFiles={videoFiles}
                  onFilesSelected={setVideoFiles}
                  onFileRemove={handleRemoveVideo}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isUploading
                  ? "上传文件中..."
                  : "提交中..."
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
