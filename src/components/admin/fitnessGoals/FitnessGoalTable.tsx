import { Button } from "@/components/ui/button";
import { FitnessGoal } from "@/model/fit-record/ExerciseItem/fitnessGoal/type";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FitnessGoalTableProps {
  fitnessGoals: FitnessGoal[];
  loading: boolean;
  onEdit: (fitnessGoal: FitnessGoal) => void;
  onDelete: (id: string) => void;
}

/**
 * 训练目标表格组件
 * @param props 组件属性
 * @returns 训练目标表格组件
 */
export function FitnessGoalTable({
  fitnessGoals,
  loading,
  onEdit,
  onDelete,
}: FitnessGoalTableProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * 打开图片预览
   * @param images 图片URL数组
   * @param index 当前图片索引
   */
  const openImagePreview = (images: string[], index: number = 0) => {
    setPreviewImages(images);
    setCurrentImageIndex(index);
    setIsPreviewOpen(true);
  };

  /**
   * 切换到下一张图片
   */
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  /**
   * 切换到上一张图片
   */
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">名称</th>
              <th className="p-2 text-left">描述</th>
              <th className="p-2 text-left">图片</th>
              <th className="p-2 text-left">排序</th>
              <th className="p-2 text-left">自定义</th>
              <th className="p-2 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  加载中...
                </td>
              </tr>
            ) : fitnessGoals.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  暂无数据
                </td>
              </tr>
            ) : (
              fitnessGoals.map((fitnessGoal) => (
                <tr key={fitnessGoal._id} className="border-b">
                  <td className="p-2 max-w-[150px]">
                    <div
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      title={fitnessGoal.name}
                    >
                      {fitnessGoal.name}
                    </div>
                  </td>
                  <td className="p-2 max-w-[250px]">
                    <div
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      title={fitnessGoal.description}
                    >
                      {fitnessGoal.description}
                    </div>
                  </td>
                  <td className="p-2">
                    {fitnessGoal.imageUrls &&
                    fitnessGoal.imageUrls.length > 0 ? (
                      <div className="flex gap-1">
                        <div
                          className="relative w-12 h-12 cursor-pointer overflow-hidden rounded-md border border-gray-200"
                          onClick={() =>
                            openImagePreview(fitnessGoal.imageUrls || [], 0)
                          }
                        >
                          <img
                            src={fitnessGoal.imageUrls[0]}
                            alt={fitnessGoal.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/48?text=N/A";
                            }}
                          />
                        </div>
                        {fitnessGoal.imageUrls.length > 1 && (
                          <div
                            className="relative w-12 h-12 cursor-pointer overflow-hidden rounded-md border border-gray-200 flex items-center justify-center bg-muted/20"
                            onClick={() =>
                              openImagePreview(fitnessGoal.imageUrls || [], 0)
                            }
                          >
                            <span className="text-xs font-medium">
                              +{fitnessGoal.imageUrls.length - 1}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2">{fitnessGoal.order}</td>
                  <td className="p-2">{fitnessGoal.isCustom ? "是" : "否"}</td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(fitnessGoal)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(fitnessGoal._id)}
                      >
                        删除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 图片预览对话框 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>图片预览</DialogTitle>
          </DialogHeader>

          <div className="relative mt-4">
            {previewImages.length > 0 && (
              <div className="w-full h-[400px] relative">
                <img
                  src={previewImages[currentImageIndex]}
                  alt="预览图片"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {previewImages.length > 1 && (
              <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  &lt;
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  &gt;
                </Button>
              </div>
            )}
          </div>

          {previewImages.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 cursor-pointer rounded-md overflow-hidden border-2 ${
                    index === currentImageIndex
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`缩略图 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              关闭
            </Button>
            <div className="text-sm text-muted-foreground">
              {previewImages.length > 0
                ? `${currentImageIndex + 1} / ${previewImages.length}`
                : "无图片"}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
