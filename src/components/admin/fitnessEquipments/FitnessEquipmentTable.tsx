import { Button } from "@/components/ui/button";
import { FitnessEquipment } from "@/model/fit-record/fitnessEquipment/type";
import { fitnessEquipmentBusiness } from "@/app/business/fitnessEquipment";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileVideo, FileImage } from "lucide-react";

interface FitnessEquipmentTableProps {
  fitnessEquipments: FitnessEquipment[];
  loading: boolean;
  onEdit: (fitnessEquipment: FitnessEquipment) => void;
  onDelete: (id: string) => void;
}

/**
 * 健身器械表格组件
 * @param props 组件属性
 * @returns 健身器械表格组件
 */
export function FitnessEquipmentTable({
  fitnessEquipments,
  loading,
  onEdit,
  onDelete,
}: FitnessEquipmentTableProps) {
  const [previewMedia, setPreviewMedia] = useState<{
    images: string[];
    videos: string[];
  }>({ images: [], videos: [] });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [mediaTab, setMediaTab] = useState<string>("images");

  /**
   * 获取类别显示名称
   */
  const getCategoryLabel = (category: string) => {
    return fitnessEquipmentBusiness.getCategoryLabel(category);
  };

  /**
   * 打开媒体预览
   * @param equipment 器材数据
   * @param defaultTab 默认显示标签
   */
  const openMediaPreview = (
    equipment: FitnessEquipment,
    defaultTab: string = "images"
  ) => {
    setPreviewMedia({
      images: equipment.imageUrls || [],
      videos: equipment.videoUrls || [],
    });
    setCurrentImageIndex(0);
    setCurrentVideoIndex(0);
    setMediaTab(defaultTab);
    setIsPreviewOpen(true);
  };

  /**
   * 切换到下一张图片
   */
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === previewMedia.images.length - 1 ? 0 : prev + 1
    );
  };

  /**
   * 切换到上一张图片
   */
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? previewMedia.images.length - 1 : prev - 1
    );
  };

  /**
   * 切换到下一个视频
   */
  const nextVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev === previewMedia.videos.length - 1 ? 0 : prev + 1
    );
  };

  /**
   * 切换到上一个视频
   */
  const prevVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev === 0 ? previewMedia.videos.length - 1 : prev - 1
    );
  };

  /**
   * 获取媒体缩略图
   * @param equipment 器材数据
   */
  const getMediaThumbnail = (equipment: FitnessEquipment) => {
    const hasImages = equipment.imageUrls && equipment.imageUrls.length > 0;
    const hasVideos = equipment.videoUrls && equipment.videoUrls.length > 0;

    return (
      <div className="flex gap-1 items-center">
        {hasImages && (
          <div
            className="relative w-12 h-12 cursor-pointer overflow-hidden rounded-md border border-gray-200"
            onClick={() => openMediaPreview(equipment, "images")}
          >
            <img
              src={equipment.imageUrls[0]}
              alt={equipment.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/48?text=N/A";
              }}
            />
            {equipment.imageUrls.length > 1 && (
              <div className="absolute bottom-0 right-0 bg-black/60 rounded-tl-sm px-1 text-white text-xs">
                {equipment.imageUrls.length}
              </div>
            )}
            <div className="absolute top-0 left-0 bg-black/60 rounded-br-sm p-0.5">
              <FileImage className="h-3 w-3 text-white" />
            </div>
          </div>
        )}

        {hasVideos && (
          <div
            className="relative w-12 h-12 cursor-pointer overflow-hidden rounded-md border border-gray-200 flex items-center justify-center bg-muted/20"
            onClick={() => openMediaPreview(equipment, "videos")}
          >
            <FileVideo className="h-5 w-5 text-gray-500" />
            {equipment.videoUrls.length > 0 && (
              <div className="absolute bottom-0 right-0 bg-black/60 rounded-tl-sm px-1 text-white text-xs">
                {equipment.videoUrls.length}
              </div>
            )}
          </div>
        )}

        {!hasImages && !hasVideos && "-"}
      </div>
    );
  };

  return (
    <>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">名称</th>
              <th className="p-2 text-left">类别</th>
              <th className="p-2 text-left">描述</th>
              <th className="p-2 text-left">媒体文件</th>
              <th className="p-2 text-left">排序</th>
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
            ) : fitnessEquipments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  暂无数据
                </td>
              </tr>
            ) : (
              fitnessEquipments.map((fitnessEquipment) => (
                <tr key={fitnessEquipment._id} className="border-b">
                  <td className="p-2 max-w-[150px]">
                    <div
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      title={fitnessEquipment.name}
                    >
                      {fitnessEquipment.name}
                    </div>
                  </td>
                  <td className="p-2 max-w-[120px]">
                    <div
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      title={getCategoryLabel(fitnessEquipment.category)}
                    >
                      {getCategoryLabel(fitnessEquipment.category)}
                    </div>
                  </td>
                  <td className="p-2 max-w-[200px]">
                    <div
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      title={fitnessEquipment.description}
                    >
                      {fitnessEquipment.description}
                    </div>
                  </td>
                  <td className="p-2">{getMediaThumbnail(fitnessEquipment)}</td>
                  <td className="p-2">{fitnessEquipment.order}</td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(fitnessEquipment)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(fitnessEquipment._id)}
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

      {/* 媒体预览对话框 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>媒体预览</DialogTitle>
          </DialogHeader>

          <Tabs value={mediaTab} onValueChange={setMediaTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="images"
                disabled={previewMedia.images.length === 0}
              >
                图片 ({previewMedia.images.length})
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                disabled={previewMedia.videos.length === 0}
              >
                视频 ({previewMedia.videos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="pt-4">
              {previewMedia.images.length > 0 ? (
                <>
                  <div className="relative mt-4">
                    <div className="w-full h-[400px] relative">
                      <img
                        src={previewMedia.images[currentImageIndex]}
                        alt="预览图片"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {previewMedia.images.length > 1 && (
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

                  {previewMedia.images.length > 1 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {previewMedia.images.map((image, index) => (
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

                  <div className="text-sm text-right mt-4 text-muted-foreground">
                    {currentImageIndex + 1} / {previewMedia.images.length}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  没有图片
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="pt-4">
              {previewMedia.videos.length > 0 ? (
                <>
                  <div className="relative mt-4">
                    <video
                      src={previewMedia.videos[currentVideoIndex]}
                      className="w-full h-[400px] object-contain"
                      controls
                      autoPlay={false}
                    />

                    {previewMedia.videos.length > 1 && (
                      <div className="mt-4 flex justify-between">
                        <Button variant="outline" onClick={prevVideo}>
                          上一个
                        </Button>
                        <Button variant="outline" onClick={nextVideo}>
                          下一个
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-right mt-4 text-muted-foreground">
                    {currentVideoIndex + 1} / {previewMedia.videos.length}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  没有视频
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
