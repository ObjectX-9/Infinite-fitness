import { NextRequest } from "next/server";
import { MuscleTypeModel } from "@/model/fit-record/BodyType/muscleType";
import {
  ApiErrors,
  unifiedInterfaceProcess,
  paginatedResponse,
  createPagination,
  createApiParams,
  successResponse,
  parseRequestBody,
  RequestValidator,
} from "@/utils/api-helpers";
import mongoose from "mongoose";
import { UserInfo } from "@/utils/withAuth";
import { MembershipLevel } from "@/model/user-member/type";

/**
 * 定义查询条件接口
 */
interface MuscleTypeQuery {
  _id?: string;
  userId?: string;
  isCustom?: boolean;
  bodyPartId?: string;
  $or?: Array<{ name?: { $regex: string, $options: string } } | { description?: { $regex: string, $options: string } }>;
}

/**
 * 获取所有肌肉类型列表
 */
export const GET = unifiedInterfaceProcess(async (req: NextRequest) => {
  try {
    const apiParams = createApiParams(req);
    const page = apiParams.getNumber("page") ?? 1;
    const limit = apiParams.getNumber("limit") ?? 10;
    const bodyPartId = apiParams.getString("bodyPartId");
    const keyword = apiParams.getString("keyword");
    const skip = (page - 1) * limit;

    // 参数验证
    if (page < 1 || limit < 1) {
      throw ApiErrors.BAD_REQUEST("页码和每页数量必须为大于0的数字");
    }

    // 构建查询条件
    const query: MuscleTypeQuery = {};
    
    if (bodyPartId) {
      query.bodyPartId = bodyPartId;
    }
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const muscleTypes = await MuscleTypeModel.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("查询成功，找到肌肉类型数:", muscleTypes.length);

    const total = await MuscleTypeModel.countDocuments(query);

    const paginationInfo = createPagination(page, limit, total);

    return paginatedResponse(
      muscleTypes,
      paginationInfo,
      "获取肌肉类型列表成功"
    );
  } catch (error) {
    console.error("获取肌肉类型列表出错:", error);
    throw error;
  }
});

/**
 * 创建肌肉类型
 */
export const POST = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  try {
    const muscleTypeData = await parseRequestBody(req);

    // 参数验证
    RequestValidator.validateRequired(muscleTypeData, ["name", "description"]);

    // 设置创建和更新时间
    const now = new Date();
    muscleTypeData.createdAt = now;
    muscleTypeData.updatedAt = now;

    // 如果是自定义肌肉，需要设置isCustom为true
    if (muscleTypeData.userId) {
      muscleTypeData.isCustom = true;
    }

    // 生成唯一ID
    muscleTypeData.id = new mongoose.Types.ObjectId().toString();

    // 设置排序值，如果没有提供
    if (muscleTypeData.order === undefined) {
      // 获取当前最大order值并加1
      const maxOrderRecord = await MuscleTypeModel.findOne()
        .sort({ order: -1 })
        .limit(1);
      muscleTypeData.order = maxOrderRecord ? maxOrderRecord.order + 1 : 1;
    }

    const saveMuscleTypeData = {
      ...muscleTypeData,
      userId: userInfo?.userId,
    };

    const newMuscleType = await MuscleTypeModel.create(saveMuscleTypeData);

    return successResponse(newMuscleType, "创建肌肉类型成功");
  } catch (error) {
    console.error("创建肌肉类型出错:", error);
    throw error;
  }
});

/**
 * 删除肌肉类型
 */
export const DELETE = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  const apiParams = createApiParams(req);
  const muscleTypeId = apiParams.getString("id");

  // 参数验证
  if (!muscleTypeId) {
    throw ApiErrors.BAD_REQUEST("缺少必要参数: id");
  }

  const userId = userInfo?.userId;
  const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能删除自己创建的自定义肌肉
  const query: MuscleTypeQuery = { _id: muscleTypeId };
  if (isAdmin) {
    // 管理员可以删除任意数据
  } else {
    query.userId = userId;
    query.isCustom = true;
  }

  const result = await MuscleTypeModel.deleteOne(query);

  if (result.deletedCount === 0) {
    throw ApiErrors.NOT_FOUND("未找到可删除的肌肉类型或无权限删除");
  }

  return successResponse({ success: true }, "删除肌肉类型成功");
});

/**
 * 更新肌肉类型
 */
export const PUT = unifiedInterfaceProcess(async (req: NextRequest, userInfo: UserInfo | null) => {
  const muscleTypeInfo = await parseRequestBody(req);

  RequestValidator.validateRequired(muscleTypeInfo, ["id"]);
  const { id } = muscleTypeInfo;

  const userId = userInfo?.userId;
  const isAdmin = userInfo?.membershipLevel === MembershipLevel.ADMIN;

  // 构建查询条件，确保只能更新自己创建的自定义肌肉或管理员可更新所有
  const query: MuscleTypeQuery = { _id: id };
  if (!isAdmin) {
    query.userId = userId;
    query.isCustom = true;
  }

  // 更新时间
  muscleTypeInfo.updatedAt = new Date();

  const muscleType = await MuscleTypeModel.findOneAndUpdate(
    query,
    { $set: muscleTypeInfo },
    { new: true }
  );

  if (!muscleType) {
    throw ApiErrors.NOT_FOUND("未找到可更新的肌肉类型或无权限更新");
  }

  return successResponse({ success: true, muscleType }, "更新肌肉类型成功");
}); 