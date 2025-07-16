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
   * 获取身体部位类型详情
   */
  async getBodyPartById(id: string, userId?: string): Promise<BodyPartType> {
    const params: Record<string, string> = { id };
    if (userId) {
      params.userId = userId;
    }

    const response = await request.get<BodyPartResponse>(`bodyPart/${id}`, {
      params,
    });
    return response.data.bodyPart;
  }

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
    userId?: string;
    category?: EBodyPartTypeCategory;
    isAdmin?: boolean;
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
  async deleteBodyPart(
    id: string,
    userId?: string
  ): Promise<{ success: boolean }> {
    const params: Record<string, string> = { id };
    if (userId) {
      params.userId = userId;
    }

    const response = await request.delete<{ success: boolean }>("bodyPart", {
      params,
    });
    return response.data;
  }

  /**
   * 获取用户的自定义身体部位列表
   */
  async getUserCustomBodyParts(userId: string): Promise<BodyPartType[]> {
    const response = await request.get<BodyPartListResponse>("bodyPart", {
      userId,
      isCustom: true,
    });
    return response.data.items;
  }

  /**
   * 获取系统预设的身体部位列表（按类别分组）
   */
  async getSystemBodyPartsByCategory(): Promise<
    Record<EBodyPartTypeCategory, BodyPartType[]>
  > {
    const response = await request.get<BodyPartListResponse>("bodyPart", {
      isCustom: false,
      limit: 100, // 获取足够多的数据
    });

    // 按类别分组
    const result: Record<EBodyPartTypeCategory, BodyPartType[]> = {} as Record<
      EBodyPartTypeCategory,
      BodyPartType[]
    >;

    // 初始化所有类别
    Object.values(EBodyPartTypeCategory).forEach((category) => {
      result[category] = [];
    });

    // 分组
    response.data.items.forEach((item) => {
      if (result[item.name as EBodyPartTypeCategory]) {
        result[item.name as EBodyPartTypeCategory].push(item);
      }
    });

    return result;
  }
}

export const bodyPartBusiness = new BodyPartBusiness();
