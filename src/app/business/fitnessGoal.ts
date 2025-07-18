import {
  FitnessGoal,
} from "@/model/fit-record/ExerciseItem/fitnessGoal/type";
import { request } from "@/utils/request";

interface FitnessGoalResponse {
  fitnessGoal: FitnessGoal;
}

interface FitnessGoalListResponse {
  items: FitnessGoal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 训练目标业务层
 */
class FitnessGoalBusiness {
  /**
   * 创建训练目标
   */
  async createFitnessGoal(
    fitnessGoalData: Partial<FitnessGoal>
  ): Promise<FitnessGoal> {
    const response = await request.post<FitnessGoalResponse>(
      "fitnessGoal",
      fitnessGoalData
    );
    return response.data.fitnessGoal;
  }

  /**
   * 更新训练目标
   */
  async updateFitnessGoal(
    id: string,
    updateData: Partial<FitnessGoal>
  ): Promise<FitnessGoal> {
    const response = await request.put<FitnessGoalResponse>("fitnessGoal", {
      id,
      ...updateData,
    });
    return response.data.fitnessGoal;
  }

  /**
   * 获取训练目标分页列表
   */
  async getFitnessGoalList(options: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<FitnessGoalListResponse> {
    const response = await request.get<FitnessGoalListResponse>(
      "fitnessGoal",
      options
    );
    return response.data;
  }

  /**
   * 删除训练目标
   */
  async deleteFitnessGoal(id: string): Promise<{ success: boolean }> {
    const response = await request.delete<{ success: boolean }>(`fitnessGoal?id=${id}`);
    return response.data;
  }
}

export const fitnessGoalBusiness = new FitnessGoalBusiness(); 