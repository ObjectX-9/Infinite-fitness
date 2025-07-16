import {
  BodyPartType,
  EBodyPartTypeCategory,
} from "@/model/fit-record/BodyType/bodyPartType/type";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { uploadBusiness } from "@/app/business/upload";
import { toast } from "sonner";
import { FileUploader, FileObject } from "@/components/FileUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * 身体部位创建/编辑对话框组件
 * @param isOpen - 对话框是否打开
 * @param onOpenChange - 对话框打开状态改变回调
 * @param isEditMode - 是否为编辑模式
 * @param bodyPart - 当前操作的身体部位数据
 * @param onBodyPartChange - 身体部位数据变更回调
 * @param onSubmit - 表单提交回调
 * @returns 身体部位创建/编辑对话框组件
 */
interface BodyPartModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isEditMode: boolean;
  bodyPart: Partial<BodyPartType>;
  onBodyPartChange: (bodyPart: Partial<BodyPartType>) => void;
  onSubmit: (bodyPart: Partial<BodyPartType>) => void;
}

export function BodyPartModal({
  isOpen,
  onOpenChange,
  isEditMode,
  bodyPart,
  onBodyPartChange,
  onSubmit,
}: BodyPartModalProps) {
  /**
   * 获取类别中文名称
   */
  const getCategoryLabel = (category: EBodyPartTypeCategory) => {
    const categoryMap = {
      [EBodyPartTypeCategory.CHEST]: "胸部",
      [EBodyPartTypeCategory.BACK]: "背部",
      [EBodyPartTypeCategory.ARM]: "手臂",
      [EBodyPartTypeCategory.LEG]: "腿部",
      [EBodyPartTypeCategory.ABDOMEN]: "腹部",
      [EBodyPartTypeCategory.HIPS]: "臀部",
      [EBodyPartTypeCategory.NECK]: "颈部",
      [EBodyPartTypeCategory.SHOULDER]: "肩部",
    };
    return categoryMap[category] || category;
  };

  /**
   * 上传状态
   */
  const [uploading, setUploading] = useState(false);

  /**
   * 待上传图片文件
   */
  const [imageFiles, setImageFiles] = useState<FileObject[]>([]);

  /**
   * 待上传视频文件
   */
  const [videoFiles, setVideoFiles] = useState<FileObject[]>([]);

  /**
   * 处理自定义模式切换
   */
  const handleCustomChange = (checked: boolean) => {
    // 当切换到自定义模式，清空name值让用户输入
    // 当切换回非自定义模式，如果当前值不在枚举中，则重置为空
    const currentName = bodyPart.name || "";
    const isValidEnum = Object.values(EBodyPartTypeCategory).includes(
      currentName as EBodyPartTypeCategory
    );

    onBodyPartChange({
      ...bodyPart,
      isCustom: checked,
      name: checked ? "" : isValidEnum ? currentName : "",
    });
  };

  /**
   * 处理表单提交（包括文件上传）
   */
  const handleSubmit = async () => {
    // 表单验证
    if (!bodyPart.name || !bodyPart.description) {
      toast.error("请填写必填字段");
      return;
    }

    // 如果有文件需要上传，则执行上传流程
    if (imageFiles.length > 0 || videoFiles.length > 0) {
      setUploading(true);

      try {
        // 上传图片文件
        const uploadedImageUrls: string[] = [];
        if (imageFiles.length > 0) {
          for (let i = 0; i < imageFiles.length; i++) {
            const fileObj = imageFiles[i];

            // 更新上传状态
            const updatedImageFiles = [...imageFiles];
            updatedImageFiles[i] = {
              ...fileObj,
              status: "uploading",
              progress: 0,
            };
            setImageFiles(updatedImageFiles);

            try {
              // 模拟进度更新
              const updateProgress = (progress: number) => {
                const progressUpdatedFiles = [...updatedImageFiles];
                progressUpdatedFiles[i] = {
                  ...progressUpdatedFiles[i],
                  progress,
                };
                setImageFiles(progressUpdatedFiles);
              };

              for (let p = 10; p <= 90; p += 10) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                updateProgress(p);
              }

              // 执行实际上传
              const result = await uploadBusiness.uploadBodyImage(
                fileObj.file,
                "image/jpeg,image/png,image/gif"
              );
              uploadedImageUrls.push(result.url);

              // 更新状态为成功
              const successUpdatedFiles = [...imageFiles];
              successUpdatedFiles[i] = {
                ...successUpdatedFiles[i],
                status: "success",
                progress: 100,
                serverUrl: result.url,
              };
              setImageFiles(successUpdatedFiles);
            } catch (error) {
              // 更新状态为失败
              const errorUpdatedFiles = [...imageFiles];
              errorUpdatedFiles[i] = {
                ...errorUpdatedFiles[i],
                status: "error",
                error: "上传失败",
              };
              setImageFiles(errorUpdatedFiles);
              throw error;
            }
          }
        }

        // 上传视频文件
        const uploadedVideoUrls: string[] = [];
        if (videoFiles.length > 0) {
          for (let i = 0; i < videoFiles.length; i++) {
            const fileObj = videoFiles[i];

            // 更新上传状态
            const updatedVideoFiles = [...videoFiles];
            updatedVideoFiles[i] = {
              ...fileObj,
              status: "uploading",
              progress: 0,
            };
            setVideoFiles(updatedVideoFiles);

            try {
              // 模拟进度更新
              const updateProgress = (progress: number) => {
                const progressUpdatedFiles = [...updatedVideoFiles];
                progressUpdatedFiles[i] = {
                  ...progressUpdatedFiles[i],
                  progress,
                };
                setVideoFiles(progressUpdatedFiles);
              };

              for (let p = 5; p <= 95; p += 5) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                updateProgress(p);
              }

              // 执行实际上传
              const result = await uploadBusiness.uploadBodyVideo(
                fileObj.file,
                "video/mp4,video/quicktime,video/x-msvideo"
              );
              uploadedVideoUrls.push(result.url);

              // 更新状态为成功
              const successUpdatedFiles = [...videoFiles];
              successUpdatedFiles[i] = {
                ...successUpdatedFiles[i],
                status: "success",
                progress: 100,
                serverUrl: result.url,
              };
              setVideoFiles(successUpdatedFiles);
            } catch (error) {
              // 更新状态为失败
              const errorUpdatedFiles = [...videoFiles];
              errorUpdatedFiles[i] = {
                ...errorUpdatedFiles[i],
                status: "error",
                error: "上传失败",
              };
              setVideoFiles(errorUpdatedFiles);
              throw error;
            }
          }
        }

        // 合并现有URL和新上传的URL
        const allImageUrls = [
          ...(bodyPart.imageUrls || []),
          ...uploadedImageUrls,
        ];
        const allVideoUrls = [
          ...(bodyPart.videoUrls || []),
          ...uploadedVideoUrls,
        ];

        // 创建更新后的bodyPart对象，确保videoUrls属性存在
        const updatedBodyPart = {
          ...bodyPart,
          imageUrls: allImageUrls,
          videoUrls: allVideoUrls,
        };

        // 确保数据正确输出到控制台
        console.log("准备提交的数据:", JSON.stringify(updatedBodyPart));

        // 直接调用外部提交方法，传入更新后的对象
        onBodyPartChange(updatedBodyPart);
        onSubmit(updatedBodyPart);

        // 成功消息
        if (uploadedImageUrls.length > 0 || uploadedVideoUrls.length > 0) {
          toast.success(
            `成功上传${uploadedImageUrls.length}张图片和${uploadedVideoUrls.length}个视频`
          );
        }
      } catch (error) {
        toast.error("文件上传失败", {
          description: "请稍后再试或联系管理员",
        });
        console.error(error);
        setUploading(false);
      }
    } else {
      // 确保imageUrls和videoUrls都被正确初始化
      const updatedBodyPart = {
        ...bodyPart,
        imageUrls: bodyPart.imageUrls || [],
        videoUrls: bodyPart.videoUrls || [],
      };

      console.log("无文件上传，直接提交:", JSON.stringify(updatedBodyPart));
      onBodyPartChange(updatedBodyPart);

      // 如果没有新文件需要上传，直接调用外部提交方法
      onSubmit(updatedBodyPart);
    }
  };

  /**
   * 处理已有图片URL删除
   */
  const removeImageUrl = (index: number) => {
    const newUrls = [...(bodyPart.imageUrls || [])];
    newUrls.splice(index, 1);
    onBodyPartChange({
      ...bodyPart,
      imageUrls: newUrls,
    });
  };

  /**
   * 处理已有视频URL删除
   */
  const removeVideoUrl = (index: number) => {
    const newUrls = [...(bodyPart.videoUrls || [])];
    newUrls.splice(index, 1);
    onBodyPartChange({
      ...bodyPart,
      videoUrls: newUrls,
    });
  };

  /**
   * 处理图片文件删除
   */
  const handleImageFileRemove = (index: number) => {
    const newFiles = [...imageFiles];

    // 如果有预览URL，需要释放
    if (newFiles[index].previewUrl) {
      URL.revokeObjectURL(newFiles[index].previewUrl);
    }

    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };

  /**
   * 处理视频文件删除
   */
  const handleVideoFileRemove = (index: number) => {
    const newFiles = [...videoFiles];

    // 如果有预览URL，需要释放
    if (newFiles[index].previewUrl) {
      URL.revokeObjectURL(newFiles[index].previewUrl);
    }

    newFiles.splice(index, 1);
    setVideoFiles(newFiles);
  };

  /**
   * 处理图片文件选择
   */
  const handleImageFilesSelected = (files: FileObject[]) => {
    console.log("选择的图片文件:", files);
    setImageFiles(files);
  };

  /**
   * 处理视频文件选择
   */
  const handleVideoFilesSelected = (files: FileObject[]) => {
    console.log("选择的视频文件:", files);
    setVideoFiles(files);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "编辑身体部位类型" : "添加身体部位类型"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "修改身体部位类型信息" : "创建一个新的身体部位类型"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">自定义</label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="isCustom"
                checked={bodyPart.isCustom || false}
                onCheckedChange={handleCustomChange}
              />
              <label htmlFor="isCustom">是否为自定义部位</label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">类别</label>
            <div className="col-span-3">
              {bodyPart.isCustom ? (
                <Input
                  placeholder="请输入自定义类别名称"
                  value={bodyPart.name || ""}
                  onChange={(e) =>
                    onBodyPartChange({
                      ...bodyPart,
                      name: e.target.value,
                    })
                  }
                />
              ) : (
                <Select
                  value={bodyPart.name || ""}
                  onValueChange={(value) =>
                    onBodyPartChange({
                      ...bodyPart,
                      name: value as EBodyPartTypeCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EBodyPartTypeCategory).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {getCategoryLabel(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">描述</label>
            <div className="col-span-3">
              <Textarea
                value={bodyPart.description || ""}
                onChange={(e) =>
                  onBodyPartChange({
                    ...bodyPart,
                    description: e.target.value,
                  })
                }
                placeholder="身体部位类型的描述"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">排序</label>
            <div className="col-span-3">
              <Input
                type="number"
                value={bodyPart.order || 0}
                onChange={(e) =>
                  onBodyPartChange({
                    ...bodyPart,
                    order: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* 图片上传组件 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right pt-2">新增图片</label>
            <div className="col-span-3">
              <FileUploader
                fileType="image"
                multiple
                maxSize={20}
                hintText="添加健身训练图片参考"
                selectedFiles={imageFiles}
                onFilesSelected={handleImageFilesSelected}
                onFileRemove={handleImageFileRemove}
                disabled={uploading}
              />
            </div>
          </div>

          {/* 已上传图片展示 */}
          {bodyPart.imageUrls && bodyPart.imageUrls.length > 0 && (
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right pt-2">现有图片</label>
              <div className="col-span-3">
                <div className="grid grid-cols-3 gap-2">
                  {bodyPart.imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`图片 ${index + 1}`}
                        className="rounded-md object-cover w-full h-24"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImageUrl(index)}
                        disabled={uploading}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 视频上传组件 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right pt-2">新增视频</label>
            <div className="col-span-3">
              <FileUploader
                fileType="video"
                multiple
                maxSize={50}
                hintText="添加健身训练视频参考"
                selectedFiles={videoFiles}
                onFilesSelected={handleVideoFilesSelected}
                onFileRemove={handleVideoFileRemove}
                disabled={uploading}
              />
            </div>
          </div>

          {/* 已上传视频展示 */}
          {bodyPart.videoUrls && bodyPart.videoUrls.length > 0 && (
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right pt-2">现有视频</label>
              <div className="col-span-3">
                <div className="flex flex-col space-y-2">
                  {bodyPart.videoUrls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center">
                        <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center mr-2">
                          <video className="max-h-full max-w-full">
                            <source src={url} />
                          </video>
                        </div>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline truncate max-w-[200px]"
                        >
                          视频 {index + 1}
                        </a>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeVideoUrl(index)}
                        disabled={uploading}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? "上传中..." : isEditMode ? "保存" : "创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
