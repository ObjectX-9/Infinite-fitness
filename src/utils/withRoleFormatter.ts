/* eslint-disable @typescript-eslint/no-explicit-any */
import { MembershipLevel } from "../model/user-member/type";
import { UserInfo } from "./withAuth";

/**
 * 原始数据类型定义
 */
type RawData = {
  items?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
};

/**
 * 角色数据过滤器接口定义
 */
interface RoleFilter {
  (data: RawData, userId?: string): any;
}

const filterUserSelf = (data: RawData, userId?: string) => {
  const isPageData = data.pagination;
  // 不是分页数据
  if (!isPageData) {
    return Array.isArray(data)
      ? data.filter(item => !item.isCustom || item.userId === userId)
      : data;
  } else {
    // 是分页数据
    const filterItems = data?.items?.filter(item => !item.isCustom || item.userId === userId);
    return {
      ...data,
      items: filterItems,
    };
  }
}

const filterPreset = (data: RawData) => {
  const isPageData = data.pagination;
  // 不是分页数据
  if (!isPageData) {
    return Array.isArray(data)
      ? data.filter(item => !item.isCustom)
      : data;
  } else {
    // 是分页数据
    const filterItems = data?.items?.filter(item => !item.isCustom);
    return {
      ...data,
      items: filterItems,
    };
  }
}

/**
 * 角色数据过滤器映射表
 */
const roleFilters: Record<string, RoleFilter> = {
  // 管理员可以访问所有数据
  [MembershipLevel.ADMIN]: (data) => {
    return data;
  },

  // 会员用户只能访问预设和自己创建的数据
  [MembershipLevel.MEMBER]: (data, userId) => {
    const filteredData = filterUserSelf(data, userId);
    return {
      ...filteredData,
    };
  },

  // 免费用户只能访问预设和自己创建的数据
  [MembershipLevel.FREE]: (data, userId) => {
    const filteredData = filterUserSelf(data, userId);
    return {
      ...filteredData,
    };
  },

  // 默认过滤器（未登录用户）只能看到预设数据
  default: (data) => {
    const filteredData = filterPreset(data);
    return filteredData;
  }
};

/**
 * 根据角色过滤数据的高阶函数
 * 适配Next.js API路由处理函数，根据用户角色自动过滤返回数据
 * @param handler API路由处理函数
 * @param options 可选配置项
 * @returns 包装后的处理函数
 */
export function withRoleFilter(
  userInfo: UserInfo | null,
  apiData: any,

) {
  if (!userInfo) {
    return filterPreset(apiData);
  }
  const filter = roleFilters[userInfo.membershipLevel] || roleFilters.default;
  return filter(apiData, userInfo.userId);
}



