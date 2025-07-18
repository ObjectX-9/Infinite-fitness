import {
  UsageScenario,
} from "@/model/fit-record/ExerciseItem/usageScenarios/type";
import { request } from "@/utils/request";

interface UsageScenarioResponse {
  usageScenario: UsageScenario;
}

interface UsageScenarioListResponse {
  items: UsageScenario[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 使用场景业务层
 */
class UsageScenarioBusiness {
  /**
   * 创建使用场景
   */
  async createUsageScenario(
    usageScenarioData: Partial<UsageScenario>
  ): Promise<UsageScenario> {
    const response = await request.post<UsageScenarioResponse>(
      "usageScenario",
      usageScenarioData
    );
    return response.data.usageScenario;
  }

  /**
   * 更新使用场景
   */
  async updateUsageScenario(
    id: string,
    updateData: Partial<UsageScenario>
  ): Promise<UsageScenario> {
    const response = await request.put<UsageScenarioResponse>("usageScenario", {
      id,
      ...updateData,
    });
    return response.data.usageScenario;
  }

  /**
   * 获取使用场景分页列表
   */
  async getUsageScenarioList(options: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<UsageScenarioListResponse> {
    const response = await request.get<UsageScenarioListResponse>(
      "usageScenario",
      options
    );
    return response.data;
  }

  /**
   * 删除使用场景
   */
  async deleteUsageScenario(id: string): Promise<{ success: boolean }> {
    const response = await request.delete<{ success: boolean }>(`usageScenario?id=${id}`);
    return response.data;
  }
}

export const usageScenarioBusiness = new UsageScenarioBusiness(); 