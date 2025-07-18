import {
  MuscleType,
} from "@/model/fit-record/BodyType/muscleType/type";
import { request } from "@/utils/request";

interface MuscleTypeResponse {
  muscleType: MuscleType;
}

interface MuscleTypeListResponse {
  items: MuscleType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 肌肉类型业务层
 */
class MuscleTypeBusiness {
  /**
   * 创建肌肉类型
   */
  async createMuscleType(
    muscleTypeData: Partial<MuscleType>
  ): Promise<MuscleType> {
    const response = await request.post<MuscleTypeResponse>(
      "muscleType",
      muscleTypeData
    );
    return response.data.muscleType;
  }

  /**
   * 更新肌肉类型
   */
  async updateMuscleType(
    id: string,
    updateData: Partial<MuscleType>
  ): Promise<MuscleType> {
    const response = await request.put<MuscleTypeResponse>("muscleType", {
      id,
      ...updateData,
    });
    return response.data.muscleType;
  }

  /**
   * 获取肌肉类型分页列表
   */
  async getMuscleTypeList(options: {
    page?: number;
    limit?: number;
    bodyPartId?: string;
    keyword?: string;
  }): Promise<MuscleTypeListResponse> {
    const response = await request.get<MuscleTypeListResponse>(
      "muscleType",
      options
    );
    return response.data;
  }

  /**
   * 删除肌肉类型
   */
  async deleteMuscleType(id: string): Promise<{ success: boolean }> {
    const response = await request.delete<{ success: boolean }>(`muscleType?id=${id}`);
    return response.data;
  }
}

export const muscleTypeBusiness = new MuscleTypeBusiness(); 