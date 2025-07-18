/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { withAuth, isInWhitelist } from "./withAuth";
import { withRoleFilter } from "./withRoleFormatter";

/**
 * 统一的API响应数据结构
 */
export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

/**
 * 统一的API错误类型
 */
export class ApiError extends Error {
  public code: number;
  public statusCode: number;

  constructor(message: string, code: number = 500, statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * 预定义的错误类型
 */
export const ApiErrors = {
  // 400 错误
  BAD_REQUEST: (message = "请求参数错误") => new ApiError(message, 400, 400),
  VALIDATION_ERROR: (message = "数据验证失败") =>
    new ApiError(message, 400, 400),
  MISSING_PARAMS: (message = "缺少必要参数") => new ApiError(message, 400, 400),

  // 401 错误
  UNAUTHORIZED: (message = "未授权访问") => new ApiError(message, 401, 401),
  TOKEN_EXPIRED: (message = "令牌已过期") => new ApiError(message, 401, 401),
  INVALID_TOKEN: (message = "无效的令牌") => new ApiError(message, 401, 401),

  // 403 错误
  FORBIDDEN: (message = "禁止访问") => new ApiError(message, 403, 403),
  INSUFFICIENT_PERMISSIONS: (message = "权限不足") =>
    new ApiError(message, 403, 403),

  // 404 错误
  NOT_FOUND: (message = "资源不存在") => new ApiError(message, 404, 404),
  USER_NOT_FOUND: (message = "用户不存在") => new ApiError(message, 404, 404),
  ARTICLE_NOT_FOUND: (message = "文章不存在") =>
    new ApiError(message, 404, 404),

  // 409 错误
  CONFLICT: (message = "资源冲突") => new ApiError(message, 409, 409),
  DUPLICATE_ENTRY: (message = "数据已存在") => new ApiError(message, 409, 409),

  // 429 错误
  RATE_LIMIT: (message = "请求过于频繁") => new ApiError(message, 429, 429),

  // 500 错误
  INTERNAL_ERROR: (message = "服务器内部错误") =>
    new ApiError(message, 500, 500),
  DATABASE_ERROR: (message = "数据库连接错误") =>
    new ApiError(message, 500, 500),
  EXTERNAL_API_ERROR: (message = "外部API调用失败") =>
    new ApiError(message, 500, 500),
};

/**
 * 成功响应构造函数
 * @param data 返回数据
 * @param message 成功消息
 * @param code 业务状态码，默认200
 * @returns NextResponse
 */
export function successResponse<T>(
  data?: T,
  message: string = "操作成功",
  code: number = 200
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    code,
    success: true,
    message,
    data,
    timestamp: Date.now(),
  };

  return NextResponse.json(response, { status: 200 });
}

/**
 * 错误响应构造函数
 * @param error 错误信息，可以是字符串、Error对象或ApiError对象
 * @param statusCode HTTP状态码，默认500
 * @param code 业务状态码，默认与statusCode相同
 * @returns NextResponse
 */
export function errorResponse(
  error: string | Error | ApiError,
  statusCode: number = 500,
  code?: number
): NextResponse<ApiResponse> {
  let message: string;
  let finalCode: number;
  let finalStatusCode: number;

  if (error instanceof ApiError) {
    message = error.message;
    finalCode = error.code;
    finalStatusCode = error.statusCode;
  } else if (error instanceof Error) {
    message = error.message;
    finalCode = code || statusCode;
    finalStatusCode = statusCode;
  } else {
    message = error;
    finalCode = code || statusCode;
    finalStatusCode = statusCode;
  }

  const response: ApiResponse = {
    code: finalCode,
    success: false,
    message: "操作失败",
    error: message,
    timestamp: Date.now(),
  };

  return NextResponse.json(response, { status: finalStatusCode });
}

/**
 * 统一的接口处理函数
 * 链接数据库，自动捕获错误并返回统一格式
 * @param handler API路由处理函数
 * @returns 包装后的处理函数
 */
export function unifiedInterfaceProcess<T extends any[], R>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse<ApiResponse<R>>>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse<ApiResponse<R>>> => {
    try {
      // 确保数据库已连接
      await connectDB();

      // 获取请求路径
      const path = req.nextUrl.pathname;
      
      // 解析token获取用户信息
      const userInfo = await withAuth(req);
      
      // 如果不在白名单中且没有用户信息，则返回未授权错误
      if (!isInWhitelist(path) && !userInfo) {
        return errorResponse(ApiErrors.UNAUTHORIZED("未授权，请先登录"), 401);
      }

      const response = await handler(req, ...args);
      const responseData = await response.json();

      // 根据用户信息过滤数据: responseData
      const filteredData = withRoleFilter(userInfo, responseData.data);

      return successResponse(filteredData, responseData.message, responseData.code);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof ApiError) {
        return errorResponse(error);
      }

      if (error instanceof Error) {
        // 根据错误类型判断状态码
        if (
          error.message.includes("not found") ||
          error.message.includes("不存在")
        ) {
          return errorResponse(error, 404);
        }
        if (
          error.message.includes("unauthorized") ||
          error.message.includes("未授权")
        ) {
          return errorResponse(error, 401);
        }
        if (
          error.message.includes("forbidden") ||
          error.message.includes("禁止")
        ) {
          return errorResponse(error, 403);
        }
        if (
          error.message.includes("validation") ||
          error.message.includes("验证")
        ) {
          return errorResponse(error, 400);
        }

        return errorResponse(error, 500);
      }

      return errorResponse("未知错误", 500);
    }
  };
}

/**
 * 分页响应构造函数
 * @param data 数据列表
 * @param pagination 分页信息
 * @param message 成功消息
 * @returns NextResponse
 */
export function paginatedResponse<T>(
  items: T[],
  pagination: Pagination,
  message: string = "获取成功"
): NextResponse<ApiResponse<{ items: T[]; pagination: typeof pagination }>> {
  return successResponse(
    {
      items,
      pagination,
    },
    message
  );
}

/**
 * 创建分页信息
 * @param page 当前页码
 * @param limit 每页条数
 * @param total 总条数
 * @returns 分页信息对象
 */
export function createPagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  return {
    page,
    limit,
    total,
    totalPages,
    hasMore,
  };
}

/**
 * 创建更新字段对象，只包含请求体中实际传入的字段
 * @param requestBody 请求体对象
 * @param allowedFields 允许更新的字段列表，如不提供则自动使用requestBody中所有字段（除了特定排除字段）
 * @param excludeFields 需要排除的字段列表，默认排除 _id, id, userId, createdAt, updatedAt 等字段
 * @returns 只包含请求体中实际传入字段的更新对象
 */
export function createUpdateFields<
  T extends Record<string, any>,
  K extends keyof T
>(
  requestBody: T,
  allowedFields?: K[],
  excludeFields: string[] = ["_id", "id", "userId", "createdAt", "updatedAt"]
): Record<string, unknown> {
  const updateFields: Record<string, unknown> = {};

  // 如果提供了允许字段列表，则使用它
  if (allowedFields && allowedFields.length > 0) {
    allowedFields.forEach((field) => {
      if (field in requestBody) {
        updateFields[field as string] = requestBody[field];
      }
    });
  } else {
    // 否则使用requestBody中的所有字段（排除特定字段）
    Object.keys(requestBody).forEach((key) => {
      if (!excludeFields.includes(key)) {
        updateFields[key] = requestBody[key];
      }
    });
  }

  return updateFields;
}

// 请求参数处理工具

/**
 * 从 URL 搜索参数中提取参数
 */
export class ApiParams {
  private searchParams: URLSearchParams;

  constructor(request: Request) {
    const url = new URL(request.url);
    this.searchParams = url.searchParams;
  }

  /**
   * 获取字符串参数
   */
  getString(key: string, defaultValue?: string): string | undefined {
    return this.searchParams.get(key) || defaultValue;
  }

  /**
   * 获取必需的字符串参数
   */
  getRequiredString(key: string): string {
    const value = this.searchParams.get(key);
    if (!value) {
      throw new Error(`缺少必需参数: ${key}`);
    }
    return value;
  }

  /**
   * 获取数字参数
   */
  getNumber(key: string, defaultValue?: number): number | undefined {
    const value = this.searchParams.get(key);
    if (!value) return defaultValue;
    const num = parseInt(value);
    if (isNaN(num)) {
      throw new Error(`参数 ${key} 必须是数字`);
    }
    return num;
  }

  /**
   * 获取必需的数字参数
   */
  getRequiredNumber(key: string): number {
    const value = this.getNumber(key);
    if (value === undefined) {
      throw new Error(`缺少必需参数: ${key}`);
    }
    return value;
  }

  /**
   * 获取布尔参数
   */
  getBoolean(key: string, defaultValue?: boolean): boolean | undefined {
    const value = this.searchParams.get(key);
    if (!value) return defaultValue;
    return value.toLowerCase() === "true";
  }

  /**
   * 获取分页参数
   */
  getPagination(
    defaultPage = 1,
    defaultLimit = 20,
    defaultTotal = 0,
    defaultHasMore = false
  ) {
    return {
      page: this.getNumber("page", defaultPage)!,
      limit: this.getNumber("limit", defaultLimit)!,
      total: this.getNumber("total", defaultTotal)!,
      hasMore: this.getBoolean("hasMore", defaultHasMore)!,
    };
  }
}

/**
 * 请求体数据验证工具
 */
export class RequestValidator {
  /**
   * 验证必需字段
   */
  static validateRequired<T extends Record<string, any>>(
    data: T,
    requiredFields: (keyof T)[]
  ): void {
    const missingFields = requiredFields.filter(
      (field) =>
        data[field] === undefined || data[field] === null || data[field] === ""
    );

    if (missingFields.length > 0) {
      throw new Error(`缺少必需字段: ${missingFields.join(", ")}`);
    }
  }

  /**
   * 验证数字字段
   */
  static validateNumbers<T extends Record<string, any>>(
    data: T,
    numberFields: (keyof T)[]
  ): void {
    numberFields.forEach((field) => {
      const value = data[field];
      if (value !== undefined && value !== null && isNaN(Number(value))) {
        throw new Error(`字段 ${String(field)} 必须是数字`);
      }
    });
  }

  /**
   * 清理数据（移除空值和无效字段）
   */
  static sanitize<T extends Record<string, any>>(
    data: T,
    allowedFields?: (keyof T)[]
  ): Partial<T> {
    const sanitized: Partial<T> = {};

    Object.keys(data).forEach((key) => {
      // 如果指定了允许的字段，只保留这些字段
      if (allowedFields && !allowedFields.includes(key as keyof T)) {
        return;
      }

      const value = data[key];
      // 只保留非空值
      if (value !== undefined && value !== null && value !== "") {
        sanitized[key as keyof T] = value;
      }
    });

    return sanitized;
  }
}

/**
 * 创建 API 参数解析器
 */
export function createApiParams(request: Request): ApiParams {
  return new ApiParams(request);
}

/**
 * 解析请求体数据
 */
export async function parseRequestBody<T = any>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error(`无效的请求体格式: ${error}`);
  }
}
