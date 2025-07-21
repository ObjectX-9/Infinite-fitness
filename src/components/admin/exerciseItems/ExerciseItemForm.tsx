import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BaseExerciseItem } from "@/model/fit-record/ExerciseItem/type";
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
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { EditableListSection } from "../fitnessEquipments/EditableListSection";
import { MediaUploadSection } from "../fitnessEquipments/MediaUploadSection";
import { CheckboxListSection } from "../fitnessEquipments/CheckboxListSection";
import { getMuscleTypeLabel } from "@/components/admin/muscleTypes/const";
import { fitnessEquipmentBusiness } from "@/app/business/fitnessEquipment";
import { exerciseItemBusiness } from "@/app/business/exerciseItem";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ExerciseItemFormProps {
  exerciseItem: Partial<BaseExerciseItem>;
  onExerciseItemChange: (exerciseItem: Partial<BaseExerciseItem>) => void;
  onUploadingChange?: (type: "images" | "videos", isUploading: boolean) => void;
  // 依赖数据
  muscleTypes: MuscleType[];
  fitnessGoals: FitnessGoal[];
  usageScenarios: UsageScenario[];
}

/**
 * 训练动作表单组件
 * @param props 组件属性
 * @returns 训练动作表单组件
 */
export function ExerciseItemForm({
  exerciseItem,
  onExerciseItemChange,
  onUploadingChange = () => {},
  muscleTypes,
  fitnessGoals,
  usageScenarios,
}: ExerciseItemFormProps) {
  const [loadingEquipments, setLoadingEquipments] = useState(false);
  const [equipments, setEquipments] = useState<FitnessEquipment[]>([]);
  const [loadingExerciseItems, setLoadingExerciseItems] = useState(false);
  const [exerciseItems, setExerciseItems] = useState<BaseExerciseItem[]>([]);

  /**
   * 加载器械数据
   */
  const loadEquipments = async () => {
    setLoadingEquipments(true);
    try {
      const result = await fitnessEquipmentBusiness.getFitnessEquipmentList({
        limit: 100, // 获取足够多的器械数据
      });
      setEquipments(result.items);
    } catch (error) {
      console.error("获取器械数据失败:", error);
      toast.error("获取器械数据失败");
    } finally {
      setLoadingEquipments(false);
    }
  };

  /**
   * 加载训练动作数据
   */
  const loadExerciseItems = async () => {
    setLoadingExerciseItems(true);
    try {
      const result = await exerciseItemBusiness.getExerciseItemList({
        limit: 100, // 获取足够多的训练动作数据
      });
      setExerciseItems(result.items);
    } catch (error) {
      console.error("获取训练动作数据失败:", error);
      toast.error("获取训练动作数据失败");
    } finally {
      setLoadingExerciseItems(false);
    }
  };

  // 获取难度级别选项
  const difficultyOptions = exerciseItemBusiness.getDifficultyLevels();

  // 初始化加载数据
  useEffect(() => {
    loadEquipments();
    loadExerciseItems();
  }, []);

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
   * 处理媒体文件变更
   * @param type 文件类型
   * @param urls 文件URL数组
   */
  const handleMediaChange = (type: "imageUrls" | "videoUrls", urls: string[]) => {
    if (type === "imageUrls") {
      updateExerciseItem("imageUrls", urls);
    } else if (type === "videoUrls") {
      // videoUrl是单个URL，取数组的第一个元素
      updateExerciseItem("videoUrl", urls.length > 0 ? urls[0] : undefined);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          动作名称 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={exerciseItem.name || ""}
          onChange={(e) => updateExerciseItem("name", e.target.value)}
          className="col-span-3"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="difficulty" className="text-right">
          难度 <span className="text-red-500">*</span>
        </Label>
        <Select
          value={exerciseItem.difficulty || ""}
          onValueChange={(value) => updateExerciseItem("difficulty", value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="选择难度" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>难度级别</SelectLabel>
              {difficultyOptions.map((option) => (
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
          动作描述 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={exerciseItem.description || ""}
          onChange={(e) => updateExerciseItem("description", e.target.value)}
          className="col-span-3"
          required
          rows={3}
        />
      </div>

      {/* 媒体上传区域 */}
      <MediaUploadSection 
        imageUrls={exerciseItem.imageUrls || []}
        videoUrls={exerciseItem.videoUrl ? [exerciseItem.videoUrl] : []}
        onMediaChange={handleMediaChange}
        onUploadingChange={onUploadingChange}
        disabled={false}
      />

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="equipmentTypeId" className="text-right">
          器械类型 <span className="text-red-500">*</span>
        </Label>
        <Select
          value={exerciseItem.equipmentTypeId || ""}
          onValueChange={(value) => updateExerciseItem("equipmentTypeId", value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder={loadingEquipments ? "加载中..." : "选择器械类型"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>器械类型</SelectLabel>
              {loadingEquipments ? (
                <SelectItem value="loading" disabled>
                  加载中...
                </SelectItem>
              ) : equipments.length === 0 ? (
                <SelectItem value="empty" disabled>
                  暂无器械数据
                </SelectItem>
              ) : (
                equipments.map((equipment) => (
                  <SelectItem key={equipment._id} value={equipment._id}>
                    {equipment.name}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 目标肌群区域 */}
      <CheckboxListSection<MuscleType>
        label="目标肌群"
        items={muscleTypes}
        selectedIds={exerciseItem.muscleTypeIds || []}
        onSelectionChange={(ids) => updateExerciseItem("muscleTypeIds", ids)}
        getItemLabel={(item) => getMuscleTypeLabel(item.name)}
        isLoading={false}
        loadingText="加载肌肉类型中..."
        emptyText="暂无肌肉类型数据"
        countText={`已选择 ${exerciseItem.muscleTypeIds?.length || 0} 个肌肉`}
        height="280px"
      />

      {/* 健身目标区域 */}
      <CheckboxListSection<FitnessGoal>
        label="健身目标"
        items={fitnessGoals}
        selectedIds={exerciseItem.fitnessGoalsIds || []}
        onSelectionChange={(ids) => updateExerciseItem("fitnessGoalsIds", ids)}
        getItemLabel={(item) => item.name}
        isLoading={false}
        loadingText="加载健身目标中..."
        emptyText="暂无健身目标数据"
        countText={`已选择 ${exerciseItem.fitnessGoalsIds?.length || 0} 个健身目标`}
        height="200px"
      />

      {/* 使用场景区域 */}
      <CheckboxListSection<UsageScenario>
        label="使用场景"
        items={usageScenarios}
        selectedIds={exerciseItem.usageScenariosIds || []}
        onSelectionChange={(ids) => updateExerciseItem("usageScenariosIds", ids)}
        getItemLabel={(item) => item.name}
        isLoading={false}
        loadingText="加载使用场景中..."
        emptyText="暂无使用场景数据"
        countText={`已选择 ${exerciseItem.usageScenariosIds?.length || 0} 个使用场景`}
        height="200px"
      />

      {/* 训练指导部分 */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="recommendedSets" className="text-right">
          推荐组数
        </Label>
        <Input
          id="recommendedSets"
          type="number"
          value={exerciseItem.recommendedSets || ""}
          onChange={(e) => updateExerciseItem("recommendedSets", Number(e.target.value))}
          min={1}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="recommendedReps" className="text-right">
          推荐次数
        </Label>
        <Input
          id="recommendedReps"
          value={exerciseItem.recommendedReps || ""}
          onChange={(e) => updateExerciseItem("recommendedReps", e.target.value)}
          placeholder="例如: 8-12"
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="recommendedWeight" className="text-right">
          推荐重量
        </Label>
        <Input
          id="recommendedWeight"
          value={exerciseItem.recommendedWeight || ""}
          onChange={(e) => updateExerciseItem("recommendedWeight", e.target.value)}
          placeholder="例如: 中等重量/最大重量的60%-80%"
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="recommendedRestTime" className="text-right">
          推荐休息时间
        </Label>
        <Input
          id="recommendedRestTime"
          value={exerciseItem.recommendedRestTime || ""}
          onChange={(e) => updateExerciseItem("recommendedRestTime", e.target.value)}
          placeholder="例如: 60-90秒"
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="duration" className="text-right">
          动作时长
        </Label>
        <Input
          id="duration"
          value={exerciseItem.duration || ""}
          onChange={(e) => updateExerciseItem("duration", e.target.value)}
          placeholder="例如: 每次3秒向心收缩，2秒保持，3秒离心"
          className="col-span-3"
        />
      </div>

      {/* 动作注意事项 */}
      <EditableListSection
        label="动作注意事项"
        items={exerciseItem.tips || []}
        onItemsChange={(items) => updateExerciseItem("tips", items)}
        addButtonText="添加注意事项"
        placeholderPrefix="注意事项"
      />

      {/* 常见错误 */}
      <EditableListSection
        label="常见错误"
        items={exerciseItem.commonMistakes || []}
        onItemsChange={(items) => updateExerciseItem("commonMistakes", items)}
        addButtonText="添加常见错误"
        placeholderPrefix="错误"
      />

      {/* 替代动作 - 使用CheckboxListSection组件 */}
      <CheckboxListSection<BaseExerciseItem>
        label="替代动作"
        items={exerciseItems.filter(item => item._id !== exerciseItem._id)} // 排除当前编辑的动作
        selectedIds={exerciseItem.alternativeExerciseItemIds || []}
        onSelectionChange={(ids) => updateExerciseItem("alternativeExerciseItemIds", ids)}
        getItemLabel={(item) => item.name}
        isLoading={loadingExerciseItems}
        loadingText="加载替代动作中..."
        emptyText="暂无可选替代动作"
        countText={`已选择 ${exerciseItem.alternativeExerciseItemIds?.length || 0} 个替代动作`}
        height="200px"
      />

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="caloriesBurned" className="text-right">
          消耗卡路里（每组）
        </Label>
        <Input
          id="caloriesBurned"
          type="number"
          value={exerciseItem.caloriesBurned || ""}
          onChange={(e) => updateExerciseItem("caloriesBurned", Number(e.target.value))}
          min={0}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="isCustom" className="text-right">
          自定义
        </Label>
        <div className="col-span-3 flex items-center">
          <input
            type="checkbox"
            id="isCustom"
            checked={!!exerciseItem.isCustom}
            onChange={(e) =>
              updateExerciseItem("isCustom", e.target.checked)
            }
            className="mr-2"
          />
          <span>是否为自定义动作</span>
        </div>
      </div>
    </div>
  );
} 