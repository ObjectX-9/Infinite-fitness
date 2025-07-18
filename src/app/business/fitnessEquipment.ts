import {
  FitnessEquipment,
  EquipmentCategory,
} from "@/model/fit-record/fitnessEquipment/type";
import { request } from "@/utils/request";

interface FitnessEquipmentResponse {
  fitnessEquipment: FitnessEquipment;
}

interface FitnessEquipmentListResponse {
  items: FitnessEquipment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 健身器械业务层
 */
class FitnessEquipmentBusiness {
  /**
   * 创建健身器械
   */
  async createFitnessEquipment(
    fitnessEquipmentData: Partial<FitnessEquipment>
  ): Promise<FitnessEquipment> {
    const response = await request.post<FitnessEquipmentResponse>(
      "fitnessEquipment",
      fitnessEquipmentData
    );
    return response.data.fitnessEquipment;
  }

  /**
   * 更新健身器械
   */
  async updateFitnessEquipment(
    id: string,
    updateData: Partial<FitnessEquipment>
  ): Promise<FitnessEquipment> {
    const response = await request.put<FitnessEquipmentResponse>("fitnessEquipment", {
      id,
      ...updateData,
    });
    return response.data.fitnessEquipment;
  }

  /**
   * 获取健身器械分页列表
   */
  async getFitnessEquipmentList(options: {
    page?: number;
    limit?: number;
    keyword?: string;
    category?: EquipmentCategory;
    targetMuscleId?: string;
    fitnessGoalId?: string;
    usageScenarioId?: string;
  }): Promise<FitnessEquipmentListResponse> {
    const response = await request.get<FitnessEquipmentListResponse>(
      "fitnessEquipment",
      options
    );
    return response.data;
  }

  /**
   * 删除健身器械
   */
  async deleteFitnessEquipment(id: string): Promise<{ success: boolean }> {
    const response = await request.delete<{ success: boolean }>(`fitnessEquipment?id=${id}`);
    return response.data;
  }

  /**
   * 获取所有器械类别
   */
  getEquipmentCategories(): { value: string; label: string }[] {
    return [
      { value: EquipmentCategory.STRENGTH, label: '力量训练' },
      { value: EquipmentCategory.CARDIO, label: '有氧训练' },
      { value: EquipmentCategory.FUNCTIONAL, label: '功能性训练' },
      { value: EquipmentCategory.REHABILITATION, label: '康复训练' },
      { value: EquipmentCategory.STRETCHING, label: '拉伸辅助' },
      { value: EquipmentCategory.OTHER, label: '其他' },
    ];
  }

  /**
   * 获取类别显示名称
   */
  getCategoryLabel(category: string): string {
    const categoryMap: Record<string, string> = {
      [EquipmentCategory.STRENGTH]: '力量训练',
      [EquipmentCategory.CARDIO]: '有氧训练',
      [EquipmentCategory.FUNCTIONAL]: '功能性训练',
      [EquipmentCategory.REHABILITATION]: '康复训练',
      [EquipmentCategory.STRETCHING]: '拉伸辅助',
      [EquipmentCategory.OTHER]: '其他',
    };
    return categoryMap[category] || '未知类别';
  }
}

export const fitnessEquipmentBusiness = new FitnessEquipmentBusiness(); 