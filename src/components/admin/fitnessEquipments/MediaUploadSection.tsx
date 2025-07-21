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
      setSelectedImageFiles(updatedFiles);

      // 上传所有新文件
      const uploadPromises = newFiles.map(async (fileObj) => {
        try {
          const formData = new FormData();
          formData.append("file", fileObj.file);
          formData.append("path", "fitness-equipment-images");
          const response = await uploadBusiness.uploadFile(formData);

          // 更新文件状态
          setSelectedImageFiles((prev) => {
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

          return response.url;
        } catch (error) {
          console.error("上传图片失败:", error);
          // 更新文件状态为错误
          setSelectedImageFiles((prev) => {
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

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(Boolean) as string[];
      
      // 更新图片URL列表
      const updatedUrls = [...imageUrls];
      validUrls.forEach(url => {
        if (!updatedUrls.includes(url)) {
          updatedUrls.push(url);
        }
      });
      
      onMediaChange("imageUrls", updatedUrls);
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
      setSelectedVideoFiles(updatedFiles);

      // 上传所有新文件
      const uploadPromises = newFiles.map(async (fileObj) => {
        try {
          const formData = new FormData();
          formData.append("file", fileObj.file);
          formData.append("path", "fitness-equipment-videos");
          const response = await uploadBusiness.uploadFile(formData);

          // 更新文件状态
          setSelectedVideoFiles((prev) => {
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

          return response.url;
        } catch (error) {
          console.error("上传视频失败:", error);
          // 更新文件状态为错误
          setSelectedVideoFiles((prev) => {
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

          toast.error(`视频 ${fileObj.file.name} 上传失败`);
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(Boolean) as string[];
      
      // 更新视频URL列表
      const updatedUrls = [...videoUrls];
      validUrls.forEach(url => {
        if (!updatedUrls.includes(url)) {
          updatedUrls.push(url);
        }
      });
      
      onMediaChange("videoUrls", updatedUrls);
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