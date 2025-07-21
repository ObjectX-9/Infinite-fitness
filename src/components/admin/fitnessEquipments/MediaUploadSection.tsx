import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader, FileObject } from "@/components/FileUploader";
import { uploadBusiness } from "@/app/business/upload";
import { toast } from "sonner";

interface MediaUploadSectionProps {
  /**
   * 图片URL列表
   */
  imageUrls: string[];

  /**
   * 视频URL列表
   */
  videoUrls: string[];

  /**
   * 媒体变更回调
   */
  onMediaChange: (type: "imageUrls" | "videoUrls", urls: string[]) => void;

  /**
   * 上传状态变更回调
   */
  onUploadingChange: (type: "images" | "videos", isUploading: boolean) => void;

  /**
   * 是否禁用
   */
  disabled?: boolean;
}

/**
 * 媒体上传区域组件，用于处理图片和视频上传
 * @param props 组件属性
 * @returns 媒体上传区域组件
 */
export function MediaUploadSection({
  imageUrls,
  videoUrls,
  onMediaChange,
  onUploadingChange,
  disabled = false,
}: MediaUploadSectionProps) {
  const [mediaTab, setMediaTab] = useState("images");
  const [selectedImageFiles, setSelectedImageFiles] = useState<FileObject[]>(
    initFileObjects(imageUrls, "image")
  );
  const [selectedVideoFiles, setSelectedVideoFiles] = useState<FileObject[]>(
    initFileObjects(videoUrls, "video")
  );

  /**
   * 初始化文件对象列表
   * @param urls URL列表
   * @param type 文件类型
   * @returns 文件对象列表
   */
  function initFileObjects(urls: string[], type: "image" | "video"): FileObject[] {
    if (urls && urls.length > 0) {
      return urls.map((url) => ({
        file: new File([], `uploaded-${type}`),
        previewUrl: url,
        serverUrl: url,
        status: "success" as "idle" | "uploading" | "success" | "error",
      }));
    }
    return [];
  }

  /**
   * 处理图片文件选择
   * @param files 选择的文件
   */
  const handleImageFilesSelected = async (files: FileObject[]) => {
    setSelectedImageFiles(files);

    // 过滤出未上传的文件
    const newFiles = files.filter(
      (file) => file.status !== "success" && !file.serverUrl
    );
    if (newFiles.length === 0) return;

    onUploadingChange("images", true);

    try {
      // 上传图片文件
      const uploadedImageUrls: string[] = [];
      
      if (newFiles.length > 0) {
        for (let i = 0; i < newFiles.length; i++) {
          const fileObj = newFiles[i];
          
          // 更新上传状态
          const updatedImageFiles = [...files];
          const fileIndex = updatedImageFiles.findIndex(f => f === fileObj);
          
          if (fileIndex !== -1) {
            updatedImageFiles[fileIndex] = {
              ...fileObj,
              status: "uploading",
              progress: 0,
            };
            setSelectedImageFiles(updatedImageFiles);

            try {
              // 模拟进度更新
              const updateProgress = (progress: number) => {
                const progressUpdatedFiles = [...updatedImageFiles];
                progressUpdatedFiles[fileIndex] = {
                  ...progressUpdatedFiles[fileIndex],
                  progress,
                };
                setSelectedImageFiles(progressUpdatedFiles);
              };

              for (let p = 10; p <= 90; p += 10) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                updateProgress(p);
              }

              // 执行实际上传
              const response = await uploadBusiness.uploadFitnessEquipmentImage(
                fileObj.file,
                "image/jpeg,image/png,image/gif"
              );
              uploadedImageUrls.push(response.url);

              // 更新状态为成功
              const successUpdatedFiles = [...files];
              successUpdatedFiles[fileIndex] = {
                ...successUpdatedFiles[fileIndex],
                status: "success",
                progress: 100,
                serverUrl: response.url,
              };
              setSelectedImageFiles(successUpdatedFiles);
            } catch (error) {
              // 更新状态为失败
              const errorUpdatedFiles = [...files];
              errorUpdatedFiles[fileIndex] = {
                ...errorUpdatedFiles[fileIndex],
                status: "error",
                error: "上传失败",
              };
              setSelectedImageFiles(errorUpdatedFiles);
              console.error("上传图片失败:", error);
              toast.error(`图片 ${fileObj.file.name} 上传失败`);
              // 注意这里与BodyPartModal不同，我们不抛出错误，而是继续处理下一个文件
            }
          }
        }
      }
      
      // 更新图片URL列表
      const updatedUrls = [...imageUrls];
      uploadedImageUrls.forEach(url => {
        if (!updatedUrls.includes(url)) {
          updatedUrls.push(url);
        }
      });
      
      onMediaChange("imageUrls", updatedUrls);
      
      // 显示成功消息
      if (uploadedImageUrls.length > 0) {
        toast.success(`成功上传${uploadedImageUrls.length}张图片`);
      }
    } catch (error) {
      console.error("图片上传过程中发生错误:", error);
      toast.error("文件上传失败", {
        description: "请稍后再试或联系管理员",
      });
    } finally {
      onUploadingChange("images", false);
    }
  };

  /**
   * 处理视频文件选择
   * @param files 选择的文件
   */
  const handleVideoFilesSelected = async (files: FileObject[]) => {
    setSelectedVideoFiles(files);

    // 过滤出未上传的文件
    const newFiles = files.filter(
      (file) => file.status !== "success" && !file.serverUrl
    );
    if (newFiles.length === 0) return;

    onUploadingChange("videos", true);

    try {
      // 上传视频文件
      const uploadedVideoUrls: string[] = [];
      
      if (newFiles.length > 0) {
        for (let i = 0; i < newFiles.length; i++) {
          const fileObj = newFiles[i];
          
          // 更新上传状态
          const updatedVideoFiles = [...files];
          const fileIndex = updatedVideoFiles.findIndex(f => f === fileObj);
          
          if (fileIndex !== -1) {
            updatedVideoFiles[fileIndex] = {
              ...fileObj,
              status: "uploading",
              progress: 0,
            };
            setSelectedVideoFiles(updatedVideoFiles);

            try {
              // 模拟进度更新
              const updateProgress = (progress: number) => {
                const progressUpdatedFiles = [...updatedVideoFiles];
                progressUpdatedFiles[fileIndex] = {
                  ...progressUpdatedFiles[fileIndex],
                  progress,
                };
                setSelectedVideoFiles(progressUpdatedFiles);
              };

              for (let p = 5; p <= 95; p += 5) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                updateProgress(p);
              }

              // 执行实际上传
              const response = await uploadBusiness.uploadFitnessEquipmentVideo(
                fileObj.file,
                "video/mp4,video/quicktime,video/x-msvideo"
              );
              uploadedVideoUrls.push(response.url);
              console.log(`视频文件 ${i+1}/${newFiles.length} 上传成功:`, response.url);

              // 更新状态为成功
              const successUpdatedFiles = [...files];
              successUpdatedFiles[fileIndex] = {
                ...successUpdatedFiles[fileIndex],
                status: "success",
                progress: 100,
                serverUrl: response.url,
              };
              setSelectedVideoFiles(successUpdatedFiles);
            } catch (error) {
              // 更新状态为失败
              const errorUpdatedFiles = [...files];
              errorUpdatedFiles[fileIndex] = {
                ...errorUpdatedFiles[fileIndex],
                status: "error",
                error: "上传失败",
              };
              setSelectedVideoFiles(errorUpdatedFiles);
              console.error("上传视频失败:", error);
              toast.error(`视频 ${fileObj.file.name} 上传失败`);
              // 注意这里与BodyPartModal不同，我们不抛出错误，而是继续处理下一个文件
            }
          }
        }
      }
      
      // 更新视频URL列表
      const updatedUrls = [...videoUrls];
      uploadedVideoUrls.forEach(url => {
        if (!updatedUrls.includes(url)) {
          updatedUrls.push(url);
        }
      });
      
      onMediaChange("videoUrls", updatedUrls);
      
      // 显示成功消息
      if (uploadedVideoUrls.length > 0) {
        toast.success(`成功上传${uploadedVideoUrls.length}个视频`);
      }
    } catch (error) {
      console.error("视频上传过程中发生错误:", error);
      toast.error("文件上传失败", {
        description: "请稍后再试或联系管理员",
      });
    } finally {
      onUploadingChange("videos", false);
    }
  };

  /**
   * 处理图片文件删除
   * @param index 文件索引
   */
  const handleImageFileRemove = (index: number) => {
    const fileToRemove = selectedImageFiles[index];

    // 从selectedImageFiles中移除
    const newSelectedFiles = [...selectedImageFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedImageFiles(newSelectedFiles);

    // 如果文件已上传，从imageUrls中也移除
    if (fileToRemove.serverUrl) {
      const updatedUrls = imageUrls.filter(
        (url) => url !== fileToRemove.serverUrl
      );
      onMediaChange("imageUrls", updatedUrls);
    }
  };

  /**
   * 处理视频文件删除
   * @param index 文件索引
   */
  const handleVideoFileRemove = (index: number) => {
    const fileToRemove = selectedVideoFiles[index];

    // 从selectedVideoFiles中移除
    const newSelectedFiles = [...selectedVideoFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedVideoFiles(newSelectedFiles);

    // 如果文件已上传，从videoUrls中也移除
    if (fileToRemove.serverUrl) {
      const updatedUrls = videoUrls.filter(
        (url) => url !== fileToRemove.serverUrl
      );
      onMediaChange("videoUrls", updatedUrls);
    }
  };

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="mediaUploader" className="text-right pt-2">
        媒体文件
      </Label>
      <div className="col-span-3">
        <Tabs
          value={mediaTab}
          onValueChange={setMediaTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="images">图片</TabsTrigger>
            <TabsTrigger value="videos">视频</TabsTrigger>
          </TabsList>
          <TabsContent value="images" className="pt-4">
            <FileUploader
              fileType="image"
              multiple={true}
              maxSize={5}
              hintText="支持JPG、PNG、GIF格式，单张图片大小不超过5MB"
              selectedFiles={selectedImageFiles}
              onFilesSelected={handleImageFilesSelected}
              onFileRemove={handleImageFileRemove}
              disabled={disabled}
            />
          </TabsContent>
          <TabsContent value="videos" className="pt-4">
            <FileUploader
              fileType="video"
              multiple={true}
              maxSize={50}
              hintText="支持MP4、MOV、AVI格式，单个视频大小不超过50MB"
              selectedFiles={selectedVideoFiles}
              onFilesSelected={handleVideoFilesSelected}
              onFileRemove={handleVideoFileRemove}
              disabled={disabled}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 