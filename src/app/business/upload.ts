import { request } from '@/utils/request';

/**
 * 上传文件接口响应类型
 */
export interface UploadResponse {
  url: string;
  filename: string;
}

/**
 * 上传文件
 * @param file 文件对象
 * @param type 存储目录类型
 * @returns 上传结果，包含URL和文件名
 */
export async function uploadFile(file: File, type: string = 'common'): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await request.post<UploadResponse>('upload', formData);

  return response.data;
}

/**
 * 删除文件
 * @param filename 文件名（完整路径）
 * @returns 删除结果
 */
export async function deleteFile(filename: string): Promise<{ success: boolean }> {
  const response = await request.delete<{ success: boolean }>(`upload`, {
    params: { filename }
  });

  return response.data;
}

/**
 * 上传图片文件
 * @param file 图片文件
 * @param type 存储目录类型
 * @returns 上传结果，包含URL和文件名
 */
export async function uploadImage(file: File, type: string = 'common'): Promise<UploadResponse> {
  // 验证是否为图片文件
  if (!file.type.startsWith('image/')) {
    throw new Error('只能上传图片文件');
  }
  
  return uploadFile(file, type);
}

/**
 * 上传Markdown文件
 * @param file Markdown文件
 * @param type 存储目录类型
 * @returns 上传结果，包含URL和文件名
 */
export async function uploadMarkdown(file: File, type: string = 'common'): Promise<UploadResponse> {
  // 验证是否为Markdown文件
  if (!(file.type === 'text/markdown' || file.name.endsWith('.md'))) {
    throw new Error('只能上传Markdown文件');
  }
  
  return uploadFile(file, type);
} 