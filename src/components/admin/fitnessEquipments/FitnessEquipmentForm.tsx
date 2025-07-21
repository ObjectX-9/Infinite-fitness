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
import { useEffect, useState } from "react";
import { EditableListSection } from "./EditableListSection";
import { MediaUploadSection } from "./MediaUploadSection";
import { CheckboxListSection } from "./CheckboxListSection";
import { MuscleType } from "@/model/fit-record/BodyType/muscleType/type";
import { FitnessGoal } from "@/model/fit-record/ExerciseItem/fitnessGoal/type";
import { UsageScenario } from "@/model/fit-record/ExerciseItem/usageScenarios/type";
import { muscleTypeBusiness } from "@/app/business/muscleType";
import { fitnessGoalBusiness } from "@/app/business/fitnessGoal";
import { usageScenarioBusiness } from "@/app/business/usageScenario";
import { toast } from "sonner";
import { getMuscleTypeLabel } from "@/components/admin/muscleTypes/const";

interface FitnessEquipmentFormProps {
  fitnessEquipment: Partial<FitnessEquipment>;
  onFitnessEquipmentChange: (fitnessEquipment: Partial<FitnessEquipment>) => void;
  isEditMode: boolean;
  isSubmitting: boolean;
  onUploadingChange?: (type: "images" | "videos", isUploading: boolean) => void;
}

/**
 * 健身器械表单组件，负责表单内容的渲染和处理
 * @param props 组件属性
 * @returns 健身器械表单组件
 */
export function FitnessEquipmentForm({
  fitnessEquipment,
  onFitnessEquipmentChange,
  isEditMode,
  isSubmitting,
  onUploadingChange = () => {},
}: FitnessEquipmentFormProps) {
  // 肌肉类型、健身目标和使用场景的数据和加载状态
  const [muscleTypes, setMuscleTypes] = useState<MuscleType[]>([]);
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([]);
  const [usageScenarios, setUsageScenarios] = useState<UsageScenario[]>([]);
  const [loadingMuscleTypes, setLoadingMuscleTypes] = useState(false);
  const [loadingFitnessGoals, setLoadingFitnessGoals] = useState(false);
  const [loadingUsageScenarios, setLoadingUsageScenarios] = useState(false);

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
   * 处理媒体文件变更
   * @param type 文件类型
   * @param urls 文件URL数组
   */
  const handleMediaChange = (type: "imageUrls" | "videoUrls", urls: string[]) => {
    updateFitnessEquipment(type, urls);
  };

  // 初始化数据加载
  useEffect(() => {
    loadMuscleTypes();
    loadFitnessGoals();
    loadUsageScenarios();
  }, []);

  // 获取所有器械类别选项
  const categoryOptions = fitnessEquipmentBusiness.getEquipmentCategories();

  return (
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

      {/* 媒体上传区域 */}
      <MediaUploadSection 
        imageUrls={fitnessEquipment.imageUrls || []}
        videoUrls={fitnessEquipment.videoUrls || []}
        onMediaChange={handleMediaChange}
        onUploadingChange={onUploadingChange}
        disabled={isSubmitting}
      />

      {/* 目标肌群区域 */}
      <CheckboxListSection<MuscleType>
        label="目标肌群"
        items={muscleTypes}
        selectedIds={fitnessEquipment.targetMusclesIds || []}
        onSelectionChange={(ids) => updateFitnessEquipment("targetMusclesIds", ids)}
        getItemLabel={(item) => getMuscleTypeLabel(item.name)}
        isLoading={loadingMuscleTypes}
        loadingText="加载肌肉类型中..."
        emptyText="暂无肌肉类型数据"
        countText={`已选择 ${fitnessEquipment.targetMusclesIds?.length || 0} 个肌肉`}
        height="280px"
      />

      {/* 健身目标区域 */}
      <CheckboxListSection<FitnessGoal>
        label="健身目标"
        items={fitnessGoals}
        selectedIds={fitnessEquipment.fitnessGoalsIds || []}
        onSelectionChange={(ids) => updateFitnessEquipment("fitnessGoalsIds", ids)}
        getItemLabel={(item) => item.name}
        isLoading={loadingFitnessGoals}
        loadingText="加载健身目标中..."
        emptyText="暂无健身目标数据"
        countText={`已选择 ${fitnessEquipment.fitnessGoalsIds?.length || 0} 个健身目标`}
        height="200px"
      />

      {/* 使用场景区域 */}
      <CheckboxListSection<UsageScenario>
        label="使用场景"
        items={usageScenarios}
        selectedIds={fitnessEquipment.usageScenariosIds || []}
        onSelectionChange={(ids) => updateFitnessEquipment("usageScenariosIds", ids)}
        getItemLabel={(item) => item.name}
        isLoading={loadingUsageScenarios}
        loadingText="加载使用场景中..."
        emptyText="暂无使用场景数据"
        countText={`已选择 ${fitnessEquipment.usageScenariosIds?.length || 0} 个使用场景`}
        height="200px"
      />

      {/* 使用指南 */}
      <EditableListSection
        label="使用指南"
        items={fitnessEquipment.usageInstructions || []}
        onItemsChange={(items) => updateFitnessEquipment("usageInstructions", items)}
        addButtonText="添加使用指南"
        placeholderPrefix="指南"
      />

      {/* 安全提示 */}
      <EditableListSection
        label="安全提示"
        items={Array.isArray(fitnessEquipment.safetyTips) 
          ? fitnessEquipment.safetyTips 
          : fitnessEquipment.safetyTips ? [fitnessEquipment.safetyTips] : []}
        onItemsChange={(items) => updateFitnessEquipment("safetyTips", items)}
        addButtonText="添加安全提示"
        placeholderPrefix="安全提示"
      />

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
  );
} 