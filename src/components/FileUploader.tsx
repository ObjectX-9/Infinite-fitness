import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Upload, X, File, FileImage, FileVideo } from "lucide-react";

/**
 * 文件类型
 */
export type FileType = "image" | "video" | "any";

/**
 * 文件对象
 */
export interface FileObject {
  /**
   * 文件对象
   */
  file: File;
  /**
   * 本地预览URL
   */
  previewUrl?: string;
  /**
   * 上传进度
   */
  progress?: number;
  /**
   * 上传状态
   */
  status?: "idle" | "uploading" | "success" | "error";
  /**
   * 错误信息
   */
  error?: string;
  /**
   * 服务器URL
   */
  serverUrl?: string;
}

/**
 * 文件上传组件属性
 */
interface FileUploaderProps {
  /**
   * 文件类型
   */
  fileType?: FileType;
  /**
   * 允许多文件
   */
  multiple?: boolean;
  /**
   * 最大文件尺寸(MB)
   */
  maxSize?: number;
  /**
   * 允许的文件类型
   */
  acceptedTypes?: string;
  /**
   * 提示文本
   */
  hintText?: string;
  /**
   * 已选择的文件
   */
  selectedFiles: FileObject[];
  /**
   * 文件选择回调
   */
  onFilesSelected: (files: FileObject[]) => void;
  /**
   * 文件删除回调
   */
  onFileRemove: (index: number) => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * CSS类名
   */
  className?: string;
}

/**
 * 文件上传组件
 * @returns 文件上传组件
 */
export function FileUploader({
  fileType = "any",
  multiple = false,
  maxSize = 5,
  acceptedTypes,
  hintText,
  selectedFiles,
  onFilesSelected,
  onFileRemove,
  disabled = false,
  className,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * 获取默认接受的文件类型
   */
  const getDefaultAcceptedTypes = (): string => {
    switch (fileType) {
      case "image":
        return "image/jpeg,image/png,image/gif,image/webp";
      case "video":
        return "video/mp4,video/quicktime,video/x-msvideo";
      default:
        return "";
    }
  };

  /**
   * 实际接受的文件类型
   */
  const actualAcceptedTypes = acceptedTypes || getDefaultAcceptedTypes();

  /**
   * 处理文件选择
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log("没有选择文件");
      return;
    }

    const fileArray = Array.from(e.target.files);
    console.log(
      "原始文件数组:",
      fileArray.map((f) => f.name)
    );

    if (fileArray.length === 0) {
      console.log("文件数组为空");
      return;
    }

    const newFiles: FileObject[] = [];
    const overSizeFiles: string[] = [];
    const invalidTypeFiles: string[] = [];

    // 用于处理和更新所有文件
    const processFiles = () => {
      if (newFiles.length === 0) {
        // 如果所有文件都被过滤掉了，显示错误提示
        if (overSizeFiles.length > 0) {
          const overSizeMessage = `以下文件超出${maxSize}MB大小限制: ${overSizeFiles.join(
            ", "
          )}`;
          console.warn(overSizeMessage);
          alert(overSizeMessage);
        }
        if (invalidTypeFiles.length > 0) {
          const invalidTypeMessage = `以下文件类型不支持: ${invalidTypeFiles.join(
            ", "
          )}`;
          console.warn(invalidTypeMessage);
          alert(invalidTypeMessage);
        }
        return;
      }

      // 根据模式选择如何更新文件列表
      if (multiple) {
        const updatedFiles = [...selectedFiles, ...newFiles];
        console.log("最终更新后的文件(多选):", updatedFiles.length);
        onFilesSelected(updatedFiles);
      } else {
        console.log("最终更新后的文件(单选):", newFiles.length);
        onFilesSelected(newFiles);
      }
    };

    // 计数器用于追踪异步处理
    let pendingFiles = 0;
    let processedFiles = 0;

    for (const file of fileArray) {
      console.log("处理文件:", file.name, file.type, file.size);

      // 检查文件大小
      if (file.size > maxSize * 1024 * 1024) {
        console.log("文件过大:", file.name);
        overSizeFiles.push(file.name);
        continue; // 跳过超出大小限制的文件
      }

      // 检查文件类型
      if (
        actualAcceptedTypes &&
        !actualAcceptedTypes.split(",").some((type) => file.type.match(type))
      ) {
        console.log("文件类型不符:", file.name, file.type);
        invalidTypeFiles.push(file.name);
        continue; // 跳过不支持的文件类型
      }

      const fileObj: FileObject = {
        file,
        status: "idle",
        progress: 0,
      };

      // 为图片和视频创建预览URL
      try {
        if (file.type.startsWith("image/")) {
          pendingFiles++;
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              const dataUrl = e.target.result.toString();
              fileObj.previewUrl = dataUrl;
              console.log(
                "创建图片预览URL (FileReader):",
                dataUrl.substring(0, 50) + "..."
              );

              processedFiles++;

              // 如果所有待处理文件都完成了，更新状态
              if (processedFiles === pendingFiles) {
                processFiles();
              }
            }
          };
          reader.readAsDataURL(file);
        } else if (file.type.startsWith("video/")) {
          fileObj.previewUrl = URL.createObjectURL(file);
          console.log("创建视频预览URL:", fileObj.previewUrl);
        }
      } catch (error) {
        console.error("创建预览URL失败:", error);
        processedFiles++; // 即使失败也计数
      }

      newFiles.push(fileObj);
    }

    console.log(
      "处理后的新文件:",
      newFiles.length,
      "待处理异步文件:",
      pendingFiles
    );

    // 如果没有图片需要异步处理，立即更新
    if (pendingFiles === 0) {
      processFiles();
    }

    // 重置input以允许选择相同文件
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  /**
   * 处理文件拖拽进入
   */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  /**
   * 处理文件拖拽离开
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * 处理文件拖拽放置
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files);
      console.log("拖拽的原始文件:", fileArray);

      const newFiles: FileObject[] = [];
      const overSizeFiles: string[] = [];
      const invalidTypeFiles: string[] = [];

      // 处理文件和更新预览
      const processFiles = () => {
        if (newFiles.length === 0) {
          // 如果所有文件都被过滤掉了，显示错误提示
          if (overSizeFiles.length > 0) {
            const overSizeMessage = `以下文件超出${maxSize}MB大小限制: ${overSizeFiles.join(
              ", "
            )}`;
            console.warn(overSizeMessage);
            alert(overSizeMessage);
          }
          if (invalidTypeFiles.length > 0) {
            const invalidTypeMessage = `以下文件类型不支持: ${invalidTypeFiles.join(
              ", "
            )}`;
            console.warn(invalidTypeMessage);
            alert(invalidTypeMessage);
          }
          return;
        }

        if (multiple) {
          const updatedFiles = [...selectedFiles, ...newFiles];
          console.log("更新后的文件(拖拽多选):", updatedFiles.length);
          onFilesSelected(updatedFiles);
        } else {
          console.log("更新后的文件(拖拽单选):", newFiles.length);
          onFilesSelected(newFiles);
        }
      };

      // 计数器追踪异步处理完成
      let pendingFiles = 0;
      let processedFiles = 0;

      for (const file of fileArray) {
        console.log("处理拖拽文件:", file.name, file.type);

        if (maxSize && file.size > maxSize * 1024 * 1024) {
          console.log("拖拽文件过大:", file.name);
          overSizeFiles.push(file.name);
          continue;
        }

        // 检查文件类型
        if (
          actualAcceptedTypes &&
          !actualAcceptedTypes.split(",").some((type) => file.type.match(type))
        ) {
          console.log("拖拽文件类型不符:", file.name, file.type);
          invalidTypeFiles.push(file.name);
          continue;
        }

        const fileObj: FileObject = {
          file,
          status: "idle",
          progress: 0,
        };

        try {
          if (file.type.startsWith("image/")) {
            pendingFiles++;
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target && e.target.result) {
                fileObj.previewUrl = e.target.result.toString();
                console.log(
                  "创建拖拽图片预览URL (FileReader):",
                  fileObj.previewUrl.substring(0, 50) + "..."
                );

                processedFiles++;

                // 如果所有文件已处理完成，更新状态
                if (processedFiles === pendingFiles) {
                  processFiles();
                }
              }
            };
            reader.readAsDataURL(file);
          } else if (file.type.startsWith("video/")) {
            fileObj.previewUrl = URL.createObjectURL(file);
          }
        } catch (error) {
          console.error("创建拖拽文件预览URL失败:", error);
          processedFiles++;
        }

        newFiles.push(fileObj);
      }

      console.log("处理后的拖拽文件:", newFiles.length);

      // 如果没有图片需要异步处理，或者只有视频，立即更新
      if (pendingFiles === 0) {
        processFiles();
      }
    }
  };

  /**
   * 获取文件图标
   */
  const getFileIcon = (fileObj: FileObject) => {
    const file = fileObj.file;

    if (file.type.startsWith("image/")) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    } else if (file.type.startsWith("video/")) {
      return <FileVideo className="h-8 w-8 text-purple-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  /**
   * 获取文件大小文本
   */
  const getFileSizeText = (size: number): string => {
    if (size < 1024) {
      return size + " B";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-50"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm font-medium">点击或拖放文件到此处上传</p>
          {hintText && <p className="text-xs text-gray-500 mt-1">{hintText}</p>}
          {maxSize && (
            <p className="text-xs text-gray-500 mt-1">
              最大文件尺寸：{maxSize}MB
            </p>
          )}
          {actualAcceptedTypes && (
            <p className="text-xs text-gray-500 mt-1">
              支持的文件类型：
              {actualAcceptedTypes
                .replace(/image\//g, "")
                .replace(/video\//g, "")
                .replace(/,/g, ", ")}
            </p>
          )}
        </div>

        <Input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={actualAcceptedTypes}
          multiple={multiple}
          disabled={disabled}
          onChange={handleFileChange}
        />
      </div>

      {/* 文件预览列表 */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            已选择的文件 ({selectedFiles.length})
          </p>
          <div className="space-y-2">
            {selectedFiles.map((fileObj, index) => (
              <div
                key={`file-${index}-${fileObj.file.name}`}
                className="border rounded-md p-3 flex items-center"
              >
                <div className="flex-shrink-0 mr-4">
                  {fileObj.previewUrl &&
                  fileObj.file.type.startsWith("image/") ? (
                    <div className="relative w-14 h-14 rounded overflow-hidden bg-gray-100">
                      <img
                        src={fileObj.previewUrl}
                        alt={fileObj.file.name}
                        className="h-full w-full object-cover"
                        onError={(e) => console.error("图片加载失败:", e)}
                      />
                    </div>
                  ) : fileObj.previewUrl &&
                    fileObj.file.type.startsWith("video/") ? (
                    <div className="relative w-14 h-14 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      <video className="max-h-full max-w-full">
                        <source
                          src={fileObj.previewUrl}
                          type={fileObj.file.type}
                        />
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <FileVideo className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded bg-gray-100 flex items-center justify-center">
                      {getFileIcon(fileObj)}
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    title={fileObj.file.name}
                  >
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileSizeText(fileObj.file.size)}
                  </p>

                  {/* 上传进度条 */}
                  {fileObj.status === "uploading" && (
                    <div className="mt-1">
                      <Progress value={fileObj.progress} className="h-1" />
                      <span className="text-xs text-gray-500 mt-1">
                        {fileObj.progress}%
                      </span>
                    </div>
                  )}

                  {/* 错误信息 */}
                  {fileObj.status === "error" && fileObj.error && (
                    <p className="text-xs text-red-500 mt-1">{fileObj.error}</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove(index);
                  }}
                  disabled={disabled || fileObj.status === "uploading"}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">移除文件</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
