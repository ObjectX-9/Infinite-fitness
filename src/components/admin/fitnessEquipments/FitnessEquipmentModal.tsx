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
import { FitnessEquipment } from "@/model/fit-record/fitnessEquipment/type";
import { fitnessEquipmentBusiness } from "@/app/business/fitnessEquipment";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
} from "@/components/ui/select";
import { FileUploader, FileObject } from "@/components/FileUploader";
import { uploadBusiness } from "@/app/business/upload";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { muscleTypeBusiness } from "@/app/business/muscleType";
import {
  MuscleType,
} from "@/model/fit-record/BodyType/muscleType/type";
import { getMuscleTypeLabel } from "@/components/admin/muscleTypes/const";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fitnessGoalBusiness } from "@/app/business/fitnessGoal";
import { FitnessGoal } from "@/model/fit-record/ExerciseItem/fitnessGoal/type";
import { usageScenarioBusiness } from "@/app/business/usageScenario";
import { UsageScenario } from "@/model/fit-record/ExerciseItem/usageScenarios/type";
import { Plus, Trash2 } from "lucide-react";

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
  const [selectedImageFiles, setSelectedImageFiles] = useState<FileObject[]>(
    []
  );
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [selectedVideoFiles, setSelectedVideoFiles] = useState<FileObject[]>(
    []
  );
  const [mediaTab, setMediaTab] = useState("images");

  // 肌肉类型列表
  const [muscleTypes, setMuscleTypes] = useState<MuscleType[]>([]);
  const [loadingMuscleTypes, setLoadingMuscleTypes] = useState(false);

  // 健身目标列表
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([]);
  const [loadingFitnessGoals, setLoadingFitnessGoals] = useState(false);

  // 使用场景列表
  const [usageScenarios, setUsageScenarios] = useState<UsageScenario[]>([]);
  const [loadingUsageScenarios, setLoadingUsageScenarios] = useState(false);

  /**
   * 加载肌肉类型数据
   */
  const loadMuscleTypes = async () => {
    setLoadingMuscleTypes(true);
    try {
      const result = await muscleTypeBusiness.getMuscleTypeList({
        limit: 100, // 获取足够多的肌肉类型
      });
      setMuscleTypes(result.items);
    } catch (error) {
      console.error("获取肌肉类型失败:", error);
      toast.error("获取肌肉类型失败");
    } finally {
      setLoadingMuscleTypes(false);
    }
  };

  /**
   * 加载健身目标数据
   */
  const loadFitnessGoals = async () => {
    setLoadingFitnessGoals(true);
    try {
      const result = await fitnessGoalBusiness.getFitnessGoalList({
        limit: 100, // 获取足够多的健身目标
      });
      setFitnessGoals(result.items);
    } catch (error) {
      console.error("获取健身目标失败:", error);
      toast.error("获取健身目标失败");
    } finally {
      setLoadingFitnessGoals(false);
    }
  };

  /**
   * 加载使用场景
   */
  const loadUsageScenarios = async () => {
    setLoadingUsageScenarios(true);
    try {
      const result = await usageScenarioBusiness.getUsageScenarioList({
        limit: 100, // 获取足够多的使用场景
      });
      setUsageScenarios(result.items);
    } catch (error) {
      console.error("获取使用场景失败:", error);
      toast.error("获取使用场景失败");
    } finally {
      setLoadingUsageScenarios(false);
    }
  };

  /**
   * 初始化已上传图片文件
   */
  const initImageFileObjects = () => {
    if (fitnessEquipment.imageUrls && fitnessEquipment.imageUrls.length > 0) {
      return fitnessEquipment.imageUrls.map((url) => ({
        file: new File([], "uploaded-image"),
        previewUrl: url,
        serverUrl: url,
        status: "success" as "idle" | "uploading" | "success" | "error",
      }));
    }
    return [];
  };

  /**
   * 初始化已上传视频文件
   */
  const initVideoFileObjects = () => {
    if (fitnessEquipment.videoUrls && fitnessEquipment.videoUrls.length > 0) {
      return fitnessEquipment.videoUrls.map((url) => ({
        file: new File([], "uploaded-video"),
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
      if (
        selectedImageFiles.some((file) => file.status === "uploading") ||
        selectedVideoFiles.some((file) => file.status === "uploading")
      ) {
        toast.error("文件上传中，请稍候再提交");
        return;
      }

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
  const updateFitnessEquipment = (
    field: keyof FitnessEquipment,
    value: string | number | boolean | string[]
  ) => {
    onFitnessEquipmentChange({
      ...fitnessEquipment,
      [field]: value,
    });
  };

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

          // 更新器材的imageUrls
          const updatedUrls = [...(fitnessEquipment.imageUrls || [])];
          updatedUrls.push(response.url);
          updateFitnessEquipment("imageUrls", updatedUrls);

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

      await Promise.all(uploadPromises);
    } finally {
      setUploadingImages(false);
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

    setUploadingVideos(true);

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

          // 更新器材的videoUrls
          const updatedUrls = [...(fitnessEquipment.videoUrls || [])];
          updatedUrls.push(response.url);
          updateFitnessEquipment("videoUrls", updatedUrls);

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

      await Promise.all(uploadPromises);
    } finally {
      setUploadingVideos(false);
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
    if (fileToRemove.serverUrl && fitnessEquipment.imageUrls) {
      const updatedUrls = fitnessEquipment.imageUrls.filter(
        (url) => url !== fileToRemove.serverUrl
      );
      updateFitnessEquipment("imageUrls", updatedUrls);
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
    if (fileToRemove.serverUrl && fitnessEquipment.videoUrls) {
      const updatedUrls = fitnessEquipment.videoUrls.filter(
        (url) => url !== fileToRemove.serverUrl
      );
      updateFitnessEquipment("videoUrls", updatedUrls);
    }
  };

  /**
   * 处理肌肉类型选择变更
   * @param muscleType 肌肉类型ID或枚举值
   * @param checked 是否选中
   */
  const handleMuscleTypeChange = (muscleType: string, checked: boolean) => {
    let newTargetMuscles = [...(fitnessEquipment.targetMusclesIds || [])];

    if (checked) {
      // 添加肌肉类型
      if (!newTargetMuscles.includes(muscleType)) {
        newTargetMuscles.push(muscleType);
      }
    } else {
      // 移除肌肉类型
      newTargetMuscles = newTargetMuscles.filter((id) => id !== muscleType);
    }

    updateFitnessEquipment("targetMusclesIds", newTargetMuscles);
  };

  /**
   * 处理健身目标选择变更
   * @param goalId 健身目标ID
   * @param checked 是否选中
   */
  const handleFitnessGoalChange = (goalId: string, checked: boolean) => {
    let newFitnessGoals = [...(fitnessEquipment.fitnessGoalsIds || [])];

    if (checked) {
      // 添加健身目标
      if (!newFitnessGoals.includes(goalId)) {
        newFitnessGoals.push(goalId);
      }
    } else {
      // 移除健身目标
      newFitnessGoals = newFitnessGoals.filter((id) => id !== goalId);
    }

    updateFitnessEquipment("fitnessGoalsIds", newFitnessGoals);
  };

  /**
   * 处理使用场景选择变更
   * @param usageScenario 使用场景ID或枚举值
   * @param checked 是否选中
   */
  const handleUsageScenarioChange = (usageScenario: string, checked: boolean) => {
    let newUsageScenarios = [...(fitnessEquipment.usageScenariosIds || [])];

    if (checked) {
      // 添加使用场景
      if (!newUsageScenarios.includes(usageScenario)) {
        newUsageScenarios.push(usageScenario);
      }
    } else {
      // 移除使用场景
      newUsageScenarios = newUsageScenarios.filter((id) => id !== usageScenario);
    }

    updateFitnessEquipment("usageScenariosIds", newUsageScenarios);
  };

  /**
   * 添加新的使用指南条目
   */
  const addUsageInstruction = () => {
    const currentInstructions = fitnessEquipment.usageInstructions || [];
    updateFitnessEquipment("usageInstructions", [...currentInstructions, ""]);
  };

  /**
   * 更新使用指南条目
   * @param index 条目索引
   * @param value 条目值
   */
  const updateUsageInstruction = (index: number, value: string) => {
    const currentInstructions = [...(fitnessEquipment.usageInstructions || [])];
    currentInstructions[index] = value;
    updateFitnessEquipment("usageInstructions", currentInstructions);
  };

  /**
   * 删除使用指南条目
   * @param index 条目索引
   */
  const removeUsageInstruction = (index: number) => {
    const currentInstructions = [...(fitnessEquipment.usageInstructions || [])];
    currentInstructions.splice(index, 1);
    updateFitnessEquipment("usageInstructions", currentInstructions);
  };

  /**
   * 添加新的安全提示条目
   */
  const addSafetyTip = () => {
    const currentTips = Array.isArray(fitnessEquipment.safetyTips) 
      ? fitnessEquipment.safetyTips 
      : fitnessEquipment.safetyTips ? [fitnessEquipment.safetyTips] : [];
    
    updateFitnessEquipment("safetyTips", [...currentTips, ""]);
  };

  /**
   * 更新安全提示条目
   * @param index 条目索引
   * @param value 条目值
   */
  const updateSafetyTip = (index: number, value: string) => {
    const currentTips = Array.isArray(fitnessEquipment.safetyTips) 
      ? [...fitnessEquipment.safetyTips] 
      : fitnessEquipment.safetyTips ? [fitnessEquipment.safetyTips] : [];
    
    currentTips[index] = value;
    updateFitnessEquipment("safetyTips", currentTips);
  };

  /**
   * 删除安全提示条目
   * @param index 条目索引
   */
  const removeSafetyTip = (index: number) => {
    const currentTips = Array.isArray(fitnessEquipment.safetyTips) 
      ? [...fitnessEquipment.safetyTips] 
      : fitnessEquipment.safetyTips ? [fitnessEquipment.safetyTips] : [];
    
    currentTips.splice(index, 1);
    updateFitnessEquipment("safetyTips", currentTips);
  };
  
  // 获取所有器械类别选项
  const categoryOptions = fitnessEquipmentBusiness.getEquipmentCategories();

  // 组件挂载或fitnessEquipment变化时初始化文件对象
  useEffect(() => {
    if (isOpen) {
      setSelectedImageFiles(initImageFileObjects());
      setSelectedVideoFiles(initVideoFileObjects());
    }
  }, [isOpen, fitnessEquipment.imageUrls, fitnessEquipment.videoUrls]);

  // 组件挂载时加载肌肉类型和健身目标数据
  useEffect(() => {
    if (isOpen) {
      loadMuscleTypes();
      loadFitnessGoals();
      loadUsageScenarios();
    }
  }, [isOpen]);

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
                onValueChange={(value) =>
                  updateFitnessEquipment("category", value)
                }
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
                onChange={(e) =>
                  updateFitnessEquipment("description", e.target.value)
                }
                className="col-span-3"
                required
                rows={3}
              />
            </div>
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
                      disabled={isSubmitting || uploadingImages}
                    />
                    {uploadingImages && (
                      <div className="mt-2 text-sm text-amber-500">
                        图片上传中，请稍候...
                      </div>
                    )}
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
                      disabled={isSubmitting || uploadingVideos}
                    />
                    {uploadingVideos && (
                      <div className="mt-2 text-sm text-amber-500">
                        视频上传中，请稍候...
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="targetMusclesIds" className="text-right pt-2">
                目标肌群
              </Label>
              <div className="col-span-3">
                <div className="border rounded-md p-4 h-[280px]">
                  <ScrollArea className="h-full pr-4">
                    <div className="grid gap-6">
                      {loadingMuscleTypes ? (
                        <div className="text-center py-2">
                          加载肌肉类型中...
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {muscleTypes.map((muscleType) => {
                              const muscleTypeName =
                                getMuscleTypeLabel(muscleType.name);
                              const isChecked =
                                fitnessEquipment.targetMusclesIds?.includes(
                                  muscleType._id
                                ) || false;

                              return (
                                <div
                                  key={muscleType._id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`muscle-${muscleType}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) =>
                                      handleMuscleTypeChange(
                                        muscleType._id,
                                        !!checked
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`muscle-${muscleType}`}
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {muscleTypeName}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 自定义肌肉类型 */}
                      {muscleTypes.filter((m) => m.isCustom).length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm">自定义肌肉</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {muscleTypes
                              .filter((m) => m.isCustom)
                              .map((muscleType) => {
                                const isChecked =
                                  fitnessEquipment.targetMusclesIds?.includes(
                                    muscleType._id
                                  ) || false;

                                return (
                                  <div
                                    key={muscleType._id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`muscle-${muscleType._id}`}
                                      checked={isChecked}
                                      onCheckedChange={(checked) =>
                                        handleMuscleTypeChange(
                                          muscleType._id,
                                          !!checked
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={`muscle-${muscleType._id}`}
                                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {muscleType.name}
                                    </label>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  已选择 {fitnessEquipment.targetMusclesIds?.length || 0} 个肌肉
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="fitnessGoalsIds" className="text-right pt-2">
                健身目标
              </Label>
              <div className="col-span-3">
                <div className="border rounded-md p-4 h-[200px]">
                  <ScrollArea className="h-full pr-4">
                    <div className="grid gap-6">
                      {loadingFitnessGoals ? (
                        <div className="text-center py-2">
                          加载健身目标中...
                        </div>
                      ) : (
                        <>
                          {/* 健身目标列表 */}
                          {fitnessGoals.length >
                            0 && (
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  {fitnessGoals
                                    .map((goal) => {
                                      const isChecked =
                                        fitnessEquipment.fitnessGoalsIds?.includes(
                                          goal._id
                                        ) || false;

                                      return (
                                        <div
                                          key={goal._id}
                                          className="flex items-center space-x-2"
                                        >
                                          <Checkbox
                                            id={`goal-${goal._id}`}
                                            checked={isChecked}
                                            onCheckedChange={(checked) =>
                                              handleFitnessGoalChange(
                                                goal._id,
                                                !!checked
                                              )
                                            }
                                          />
                                          <label
                                            htmlFor={`goal-${goal._id}`}
                                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            {goal.name}
                                          </label>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  已选择 {fitnessEquipment.fitnessGoalsIds?.length || 0}{" "}
                  个健身目标
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usageScenariosIds" className="text-right">
                使用场景
              </Label>
              <div className="col-span-3">
                <div className="border rounded-md p-4 h-[200px]">
                  <ScrollArea className="h-full pr-4">
                    <div className="grid gap-6">
                      {loadingUsageScenarios ? (
                        <div className="text-center py-2">
                          加载使用场景中...
                        </div>
                      ) : (
                        <>
                          {/* 使用场景列表 */}
                          {usageScenarios.length >
                            0 && (
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  {usageScenarios
                                    .map((usageScenario) => {
                                      const isChecked =
                                        fitnessEquipment.usageScenariosIds?.includes(
                                          usageScenario._id
                                        ) || false;

                                      return (
                                        <div
                                          key={usageScenario._id}
                                          className="flex items-center space-x-2"
                                        >
                                          <Checkbox
                                            id={`usageScenario-${usageScenario._id}`}
                                            checked={isChecked}
                                            onCheckedChange={(checked) =>
                                              handleUsageScenarioChange(
                                                usageScenario._id,
                                                !!checked
                                              )
                                            }
                                          />
                                          <label
                                            htmlFor={`usageScenario-${usageScenario._id}`}
                                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            {usageScenario.name}
                                          </label>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  已选择 {fitnessEquipment.fitnessGoalsIds?.length || 0}{" "}
                  个健身目标
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="usageInstructions" className="text-right pt-2">
                使用指南
              </Label>
              <div className="col-span-3 space-y-2">
                {(fitnessEquipment.usageInstructions || []).map((instruction, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={instruction}
                      onChange={(e) => updateUsageInstruction(index, e.target.value)}
                      placeholder={`指南 ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeUsageInstruction(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addUsageInstruction}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> 添加使用指南
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="safetyTips" className="text-right pt-2">
                安全提示
              </Label>
              <div className="col-span-3 space-y-2">
                {Array.isArray(fitnessEquipment.safetyTips) 
                  ? fitnessEquipment.safetyTips.map((tip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={tip}
                        onChange={(e) => updateSafetyTip(index, e.target.value)}
                        placeholder={`安全提示 ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSafetyTip(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                  : fitnessEquipment.safetyTips && (
                    <div className="flex items-center gap-2">
                      <Input
                        value={fitnessEquipment.safetyTips}
                        onChange={(e) => updateSafetyTip(0, e.target.value)}
                        placeholder="安全提示 1"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSafetyTip(0)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                }
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSafetyTip}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> 添加安全提示
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">
                排序
              </Label>
              <Input
                id="order"
                type="number"
                value={fitnessEquipment.order || 0}
                onChange={(e) =>
                  updateFitnessEquipment("order", Number(e.target.value))
                }
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
                onChange={(e) =>
                  updateFitnessEquipment("notes", e.target.value)
                }
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
                    onChange={(e) =>
                      updateFitnessEquipment("isCustom", e.target.checked)
                    }
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
