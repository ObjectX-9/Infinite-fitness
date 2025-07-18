import {
  BodyPartType,
  EBodyPartTypeCategory,
} from "@/model/fit-record/BodyType/bodyPartType/type";
import { request } from "@/utils/request";

interface BodyPartResponse {
  bodyPart: BodyPartType;
}

interface BodyPartListResponse {
  items: BodyPartType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 身体部位类型业务层
 */
class BodyPartBusiness {
  /**
   * 创建身体部位类型
   */
  async createBodyPart(
    bodyPartData: Partial<BodyPartType>
  ): Promise<BodyPartType> {
    const response = await request.post<BodyPartResponse>(
      "bodyPart",
      bodyPartData
    );
    return response.data.bodyPart;
  }

  /**
   * 更新身体部位类型
   */
  async updateBodyPart(
    id: string,
    updateData: Partial<BodyPartType>
  ): Promise<BodyPartType> {
    const response = await request.put<BodyPartResponse>("bodyPart", {
      id,
      ...updateData,
    });
    return response.data.bodyPart;
  }

  /**
   * 获取身体部位类型分页列表
   */
  async getBodyPartList(options: {
    page?: number;
    limit?: number;
    category?: EBodyPartTypeCategory;
  }): Promise<BodyPartListResponse> {
    const response = await request.get<BodyPartListResponse>(
      "bodyPart",
      options
    );
    return response.data;
  }

  /**
   * 删除身体部位类型
   */
  async deleteBodyPart(id: string): Promise<{ success: boolean }> {
    const response = await request.delete<{ success: boolean }>(`bodyPart?id=${id}`);
    return response.data;
  }
}

export const bodyPartBusiness = new BodyPartBusiness();
