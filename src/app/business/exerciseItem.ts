import { BaseExerciseItem } from "@/model/fit-record/ExerciseItem/type";
import { request } from "@/utils/request";

/**
 * 分页响应类型
 */
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 分页结果类型
 */
interface ExerciseItemListResponse {
  items: BaseExerciseItem[];
  pagination: PaginationInfo;
}

interface ExerciseItemResponse {
  exerciseItem: BaseExerciseItem;
}

/**
 * 健身动作业务层
 */
class ExerciseItemBusiness {
  /**
   * 创建健身动作
   * @param exerciseItem 健身动作数据
   * @returns 创建结果
   */
  async createExerciseItem(exerciseItem: Partial<BaseExerciseItem>): Promise<BaseExerciseItem> {
    const response = await request.post<ExerciseItemResponse>("exerciseItem", exerciseItem);
    return response.data.exerciseItem;
  }

  /**
   * 更新健身动作
   * @param id 健身动作ID
   * @param updateData 更新数据
   * @returns 更新结果
   */
  async updateExerciseItem(
    id: string,
    updateData: Partial<BaseExerciseItem>
  ): Promise<BaseExerciseItem> {
    const response = await request.put<ExerciseItemResponse>("exerciseItem", {
      id,
      ...updateData,
    });
    return response.data.exerciseItem;
  }

  /**
   * 删除健身动作
   * @param id 健身动作ID
   * @returns 删除结果
   */
  async deleteExerciseItem(id: string): Promise<{ success: boolean }> {
    const response = await request.delete<{ success: boolean }>(
      `exerciseItem?id=${id}`
    );
    return response.data;
  }

  /**
   * 获取健身动作列表
   * @param params 查询参数
   * @returns 分页结果
   */
  async getExerciseItemList(
    params?: Record<string, unknown>
  ): Promise<ExerciseItemListResponse> {
    const response = await request.get<ExerciseItemListResponse>("exerciseItem", params);
    return response.data;
  }

  /**
   * 获取单个健身动作详情
   * @param id 健身动作ID
   * @returns 健身动作详情
   */
  async getExerciseItemDetail(id: string): Promise<BaseExerciseItem> {
    const response = await request.get<ExerciseItemResponse>(`exerciseItem?id=${id}`);
    return response.data.exerciseItem;
  }
}

/**
 * 健身动作业务实例
 */
export const exerciseItemBusiness = new ExerciseItemBusiness(); 