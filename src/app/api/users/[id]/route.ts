import { NextRequest } from "next/server";
import { unifiedInterfaceProcess } from "@/utils/api-helpers";
import { createApiParams } from "@/utils/api-helpers";
import { successResponse } from "@/utils/api-helpers";
import { UserModel } from "@/model/user";

export const GET = unifiedInterfaceProcess(async (req: NextRequest) => {
  const apiParams = createApiParams(req);
  const userId = apiParams.getString("userId");

  const user = await UserModel.findById(userId);

  return successResponse(user, "获取用户成功");
});