import { request } from "@/utils/request";

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
 * @param path 文件存储路径
 * @param fileTypeCheck 可选，文件类型检查（逗号分隔的列表）
 * @returns 上传结果，包含URL和文件名
 */
async function uploadFile(
  file: File,
  path: string,
  fileTypeCheck?: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  if (fileTypeCheck) {
    formData.append("fileTypeCheck", fileTypeCheck);
  }

  const response = await request.post<UploadResponse>("upload", formData);

  return response.data;
}

class UploadBusiness {
  /**
   * 上传身体部位图片
   * @param file 文件对象
   * @param fileTypeCheck 可选，文件类型检查（逗号分隔的列表）
   * @returns 上传结果，包含URL和文件名
   */
  async uploadBodyImage(file: File, fileTypeCheck?: string) {
    return uploadFile(file, "body-images", fileTypeCheck);
  }

  /**
   * 上传身体部位视频
   * @param file 文件对象
   * @param fileTypeCheck 可选，文件类型检查（逗号分隔的列表）
   * @returns 上传结果，包含URL和文件名
   */
  async uploadBodyVideo(file: File, fileTypeCheck?: string) {
    return uploadFile(file, "body-videos", fileTypeCheck);
  }
}

export const uploadBusiness = new UploadBusiness();
