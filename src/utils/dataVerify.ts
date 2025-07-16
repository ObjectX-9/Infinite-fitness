/**
 * 数据校验工具函数库
 * 提供常见的数据校验方法
 */

/**
 * 验证字符串是否为空
 * @param value - 要验证的字符串
 * @returns 是否为空
 */
export const isEmpty = (value?: string | null): boolean => {
  return value === undefined || value === null || value.trim() === '';
};

/**
 * 验证字符串是否不为空
 * @param value - 要验证的字符串
 * @returns 是否不为空
 */
export const isNotEmpty = (value?: string | null): boolean => {
  return !isEmpty(value);
};

/**
 * 验证字符串长度是否在指定范围内
 * @param value - 要验证的字符串
 * @param min - 最小长度
 * @param max - 最大长度
 * @returns 是否在范围内
 */
export const isLengthValid = (
  value: string,
  min: number,
  max: number
): boolean => {
  if (isEmpty(value)) return false;
  const length = value.length;
  return length >= min && length <= max;
};

/**
 * 验证是否为有效的电子邮件地址
 * @param email - 要验证的电子邮件地址
 * @returns 是否有效
 */
export const isValidEmail = (email: string): boolean => {
  if (isEmpty(email)) return false;
  
  // 基础格式检查
  const basicCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!basicCheck) return false;
  
  // 更严格的格式检查
  const strictRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!strictRegex.test(email.toLowerCase())) return false;
  
  // 检查域名和用户名长度
  const parts = email.split('@');
  if (parts[0].length > 64) return false; // 用户名部分不能超过64个字符
  if (parts[1].length > 255) return false; // 域名部分不能超过255个字符
  
  // 检查是否有连续的多个点
  if (email.includes('..')) return false;
  
  // 检查域名部分是否有至少一个点（至少是二级域名）
  if (!parts[1].includes('.')) return false;
  
  // 检查顶级域名是否有效（至少2个字符）
  const domainParts = parts[1].split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;
  
  return true;
};

/**
 * 验证是否为有效的中国大陆手机号
 * @param phone - 要验证的手机号
 * @returns 是否有效
 */
export const isValidChinaPhone = (phone: string): boolean => {
  if (isEmpty(phone)) return false;
  return /^1[3-9]\d{9}$/.test(phone);
};

/**
 * 验证是否为有效的用户名（字母、数字、下划线，字母开头）
 * @param username - 要验证的用户名
 * @returns 是否有效
 */
export const isValidUsername = (username: string): boolean => {
  if (isEmpty(username)) return false;
  return /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/.test(username);
};

/**
 * 验证是否为有效的密码（包含字母、数字，可选特殊字符，8-20位）
 * @param password - 要验证的密码
 * @returns 是否有效
 */
export const isValidPassword = (password: string): boolean => {
  if (isEmpty(password)) return false;
  
  // 基本长度检查
  if (password.length < 8 || password.length > 20) return false;
  
  // 检查是否包含至少一个字母和一个数字
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasLetter && hasNumber;
};

/**
 * 验证是否为有效的强密码（包含大小写字母、数字、特殊字符，8-20位）
 * @param password - 要验证的密码
 * @returns 是否有效
 */
export const isStrongPassword = (password: string): boolean => {
  if (isEmpty(password)) return false;
  
  // 基本长度检查
  if (password.length < 8 || password.length > 20) return false;
  
  // 检查是否包含所有必要的字符类型
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
};

/**
 * 验证是否为有效的URL
 * @param url - 要验证的URL
 * @returns 是否有效
 */
export const isValidUrl = (url: string): boolean => {
  if (isEmpty(url)) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证是否为有效的身份证号（中国大陆）
 * @param idCard - 要验证的身份证号
 * @returns 是否有效
 */
export const isValidChineseIdCard = (idCard: string): boolean => {
  if (isEmpty(idCard)) return false;
  
  // 18位身份证正则
  const regex = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9X]$/;
  
  if (!regex.test(idCard)) return false;
  
  // 验证校验位
  if (idCard.length === 18) {
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    let ai = 0;
    let wi = 0;
    
    for (let i = 0; i < 17; i++) {
      ai = parseInt(idCard[i]);
      wi = factor[i];
      sum += ai * wi;
    }
    
    const last = parity[sum % 11];
    return last === idCard[17].toUpperCase();
  }
  
  return true;
};

/**
 * 验证是否为有效的日期字符串（YYYY-MM-DD格式）
 * @param dateStr - 要验证的日期字符串
 * @returns 是否有效
 */
export const isValidDateString = (dateStr: string): boolean => {
  if (isEmpty(dateStr)) return false;
  
  // 检查格式
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  
  // 检查日期是否有效
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  
  // 确保格式化后仍然匹配（防止类似2021-02-31这样的无效日期）
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}` === dateStr;
};

/**
 * 验证字符串是否只包含数字
 * @param value - 要验证的字符串
 * @returns 是否只包含数字
 */
export const isNumeric = (value: string): boolean => {
  if (isEmpty(value)) return false;
  return /^\d+$/.test(value);
};

/**
 * 验证字符串是否只包含字母
 * @param value - 要验证的字符串
 * @returns 是否只包含字母
 */
export const isAlpha = (value: string): boolean => {
  if (isEmpty(value)) return false;
  return /^[a-zA-Z]+$/.test(value);
};

/**
 * 验证字符串是否只包含字母和数字
 * @param value - 要验证的字符串
 * @returns 是否只包含字母和数字
 */
export const isAlphanumeric = (value: string): boolean => {
  if (isEmpty(value)) return false;
  return /^[a-zA-Z0-9]+$/.test(value);
};

/**
 * 获取字符串长度（包括双字节字符的处理）
 * @param str - 要计算长度的字符串
 * @returns 字符串的实际长度
 */
export const getStringLength = (str: string): number => {
  if (isEmpty(str)) return 0;
  
  // 考虑双字节字符，如中文、日文等
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      length += 1;
    } else {
      length += 2;
    }
  }
  
  return length;
}; 