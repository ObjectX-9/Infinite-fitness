/**
 * 功能：身体部位地图页面，实现类似musclewiki的交互效果
 */
"use client";

import React, { useState, useEffect } from "react";
import { bodyPartBusiness } from "@/app/business/bodyPart";
import { muscleTypeBusiness } from "@/app/business/muscleType";
import BodyMap from "@/components/body-map/BodyMap";
import { BodyPartType } from "@/model/fit-record/BodyType/bodyPartType/type";
import { MuscleType } from "@/model/fit-record/BodyType/muscleType/type";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EBodyPartTypeCategory } from "@/model/fit-record/BodyType/bodyPartType/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 临时测试数据 - 如果API暂未实现，可以使用这些数据
const mockBodyParts: BodyPartType[] = [
  {
    _id: "chest-1",
    name: EBodyPartTypeCategory.CHEST,
    description:
      "胸部是人体上躯干前侧的肌肉群，主要包括胸大肌、胸小肌和前锯肌。胸部肌肉对于推动运动和保持上肢力量至关重要。",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500&auto=format&fit=crop",
    ],
    videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    order: 1,
  },
  {
    _id: "back-1",
    name: EBodyPartTypeCategory.BACK,
    description:
      "背部是人体躯干后侧的一大块肌肉区域，包括背阔肌、斜方肌、菱形肌等。这些肌肉对于保持良好姿势和拉力运动非常重要。",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [
      "https://images.unsplash.com/photo-1598971639058-a4dcf1f51c96?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598971639058-a4dcf1f51c96?q=80&w=500&auto=format&fit=crop",
    ],
    videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    order: 2,
  },
  {
    _id: "arm-1",
    name: EBodyPartTypeCategory.ARM,
    description:
      "手臂包括肱二头肌、肱三头肌和前臂肌群，这些肌肉负责手臂的弯曲和伸展动作。",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [
      "https://images.unsplash.com/photo-1590507621108-433608c97823?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590507621108-433608c97823?q=80&w=500&auto=format&fit=crop",
    ],
    videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    order: 3,
  },
  {
    _id: "leg-1",
    name: EBodyPartTypeCategory.LEG,
    description:
      "腿部包括大腿和小腿的肌肉群，如股四头肌、腘绳肌和小腿三头肌，这些肌肉是人体最大的肌肉群之一，对下肢力量和稳定性至关重要。",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [
      "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?q=80&w=500&auto=format&fit=crop",
    ],
    videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    order: 4,
  },
  {
    _id: "abdomen-1",
    name: EBodyPartTypeCategory.ABDOMEN,
    description:
      "腹部包括腹直肌、腹外斜肌和腹横肌，这些肌肉帮助维持躯干稳定并支持核心力量。",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [
      "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=500&auto=format&fit=crop",
    ],
    videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    order: 5,
  },
  {
    _id: "shoulder-1",
    name: EBodyPartTypeCategory.SHOULDER,
    description:
      "肩部主要由三角肌组成，分为前、中、后三束，对于肩部的灵活性和上肢动作非常重要。",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [
      "https://images.unsplash.com/photo-1579191203631-aa95ba69332c?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579191203631-aa95ba69332c?q=80&w=500&auto=format&fit=crop",
    ],
    videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    order: 6,
  },
];

// 模拟肌肉数据
const mockMuscleTypes: MuscleType[] = [
  {
    _id: "chest-muscle-1",
    name: "胸大肌",
    description:
      "胸大肌是胸部前侧最大的肌肉，负责肩关节的内收、屈曲和内旋。常见训练动作包括卧推、俯卧撑和飞鸟。",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500&auto=format&fit=crop",
    ],
    videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    order: 1,
    bodyPartId: "chest-1",
  },
  {
    _id: "back-muscle-1",
    name: "背阔肌",
    description:
      "背阔肌是背部最宽的肌肉，负责肩关节的内收、伸展和内旋。常见训练动作包括引体向上、划船和下拉。",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrls: [
      "https://images.unsplash.com/photo-1598971639058-a4dcf1f51c96?q=80&w=500&auto=format&fit=crop",
    ],
    videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    order: 1,
    bodyPartId: "back-1",
  },
];

/**
 * 将YouTube URL转换为嵌入URL
 * @param url YouTube视频URL
 * @returns 嵌入式URL
 */
function getYouTubeEmbedUrl(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : "";
}

export default function BodyMapPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [view, setView] = useState<"front" | "back">("front");
  const [bodyParts, setBodyParts] = useState<BodyPartType[]>([]);
  const [muscleTypes, setMuscleTypes] = useState<MuscleType[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPartType | null>(
    null
  );
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleType | null>(null);
  const [relatedMuscles, setRelatedMuscles] = useState<MuscleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [useTestData, setUseTestData] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  /**
   * 加载身体部位和肌肉类型数据
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        try {
          // 尝试从API获取数据
          const bodyPartResponse = await bodyPartBusiness.getBodyPartList({
            limit: 100,
          });
          console.log("API返回的身体部位数据:", bodyPartResponse);

          // 如果API返回的数据为空或出错，使用测试数据
          if (
            !bodyPartResponse ||
            !bodyPartResponse.items ||
            bodyPartResponse.items.length === 0
          ) {
            console.log("API返回数据为空，使用测试数据");
            setBodyParts(mockBodyParts);
            setMuscleTypes(mockMuscleTypes);
            setUseTestData(true);
          } else {
            setBodyParts(bodyPartResponse.items);

            const muscleResponse = await muscleTypeBusiness.getMuscleTypeList({
              limit: 100,
            });
            if (muscleResponse && muscleResponse.items) {
              setMuscleTypes(muscleResponse.items);
            } else {
              setMuscleTypes(mockMuscleTypes);
            }
          }
        } catch (error) {
          console.error("API请求失败，使用测试数据:", error);
          setApiError("API请求失败，使用测试数据代替");
          setBodyParts(mockBodyParts);
          setMuscleTypes(mockMuscleTypes);
          setUseTestData(true);
        }
      } catch (error) {
        console.error("加载身体部位和肌肉类型数据失败:", error);
        setApiError("数据加载失败，请稍后重试");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * 处理部位选择事件
   */
  const handlePartSelect = (partId: string) => {
    console.log("选择的部位ID:", partId);
    const bodyPart = bodyParts.find((part) => part._id === partId);
    if (bodyPart) {
      console.log("找到对应的身体部位:", bodyPart);
      setSelectedBodyPart(bodyPart);

      // 查找该身体部位相关的肌肉
      const muscles = muscleTypes.filter(
        (muscle) => muscle.bodyPartId === partId
      );
      setRelatedMuscles(muscles);

      if (muscles.length > 0) {
        setSelectedMuscle(muscles[0]);
      } else {
        setSelectedMuscle(null);
      }

      // 重置为信息标签
      setActiveTab("info");
    }
  };

  return (
    <div className="container mx-auto py-8 pb-20">
      <h1 className="text-3xl font-bold mb-6 text-center">身体部位地图</h1>

      <div className="mb-6 text-center">
        <p className="text-gray-600">
          点击人体模型上的不同部位，查看相应的肌肉和训练信息。您可以切换性别和视角来查看不同视图。
        </p>
      </div>

      {apiError && (
        <Alert className="mb-4">
          <AlertTitle>注意</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {useTestData && (
        <Alert className="mb-4">
          <AlertTitle>测试模式</AlertTitle>
          <AlertDescription>
            当前使用的是测试数据，非真实API数据
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center space-x-4 mb-6">
        <div className="flex items-center space-x-2 border rounded-lg p-2">
          <button
            onClick={() => setGender("male")}
            className={`px-4 py-2 rounded-md ${
              gender === "male" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            男性
          </button>
          <button
            onClick={() => setGender("female")}
            className={`px-4 py-2 rounded-md ${
              gender === "female" ? "bg-pink-500 text-white" : "bg-gray-200"
            }`}
          >
            女性
          </button>
        </div>

        <div className="flex items-center space-x-2 border rounded-lg p-2">
          <button
            onClick={() => setView("front")}
            className={`px-4 py-2 rounded-md ${
              view === "front" ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            前视图
          </button>
          <button
            onClick={() => setView("back")}
            className={`px-4 py-2 rounded-md ${
              view === "back" ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            后视图
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex justify-center">
          <BodyMap
            gender={gender}
            view={view}
            onSelectPart={handlePartSelect}
            selectedBodyPartId={selectedBodyPart?._id}
            bodyParts={bodyParts}
          />
          <div className="ml-4 text-sm text-gray-500 hidden lg:block">
            <h3 className="font-semibold mb-2">操作提示:</h3>
            <ul className="list-disc pl-4">
              <li>鼠标悬停在身体部位上方，颜色变化表示可选区域</li>
              <li>点击身体部位查看详细信息</li>
              <li>选中的部位将高亮显示为红色</li>
              <li>使用上方按钮切换性别和视角</li>
            </ul>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="mt-6">
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              ) : selectedBodyPart ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    {selectedBodyPart.name}
                  </h2>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="info" className="flex-1">
                        详细信息
                      </TabsTrigger>
                      <TabsTrigger value="media" className="flex-1">
                        图片 & 视频
                      </TabsTrigger>
                      <TabsTrigger value="muscles" className="flex-1">
                        相关肌肉
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-4">
                      <p className="text-gray-700">
                        {selectedBodyPart.description}
                      </p>

                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">训练建议</h3>
                        <p className="text-gray-700">
                          对于{selectedBodyPart.name}
                          的训练，建议每周安排2-3次专项训练，结合复合动作和针对性训练动作，逐步增加负荷，确保充分的恢复时间。
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="media">
                      {selectedBodyPart.imageUrls &&
                      selectedBodyPart.imageUrls.length > 0 ? (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3">
                            图片资料
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {selectedBodyPart.imageUrls.map((url, index) => (
                              <div
                                key={index}
                                className="relative h-40 overflow-hidden rounded-md border border-gray-200"
                              >
                                <img
                                  src={url}
                                  alt={`${selectedBodyPart.name} 图片 ${
                                    index + 1
                                  }`}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 my-2">暂无图片资料</p>
                      )}

                      {selectedBodyPart.videoUrls &&
                      selectedBodyPart.videoUrls.length > 0 ? (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-3">
                            视频资料
                          </h3>
                          <div className="space-y-4">
                            {selectedBodyPart.videoUrls.map((url, index) => {
                              const embedUrl = getYouTubeEmbedUrl(url);
                              return embedUrl ? (
                                <div key={index} className="aspect-video">
                                  <iframe
                                    src={embedUrl}
                                    title={`${selectedBodyPart.name} 视频 ${
                                      index + 1
                                    }`}
                                    className="w-full h-full rounded-md"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                              ) : (
                                <div
                                  key={index}
                                  className="p-4 bg-gray-100 rounded-md"
                                >
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    查看视频 {index + 1}
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 mt-4">暂无视频资料</p>
                      )}
                    </TabsContent>

                    <TabsContent value="muscles">
                      {relatedMuscles.length > 0 ? (
                        <div className="space-y-4">
                          {relatedMuscles.map((muscle) => (
                            <div
                              key={muscle._id}
                              className={`p-4 rounded-lg border ${
                                muscle._id === selectedMuscle?._id
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                              onClick={() => setSelectedMuscle(muscle)}
                            >
                              <h3 className="text-lg font-semibold mb-2">
                                {muscle.name}
                              </h3>
                              <p className="text-gray-700">
                                {muscle.description}
                              </p>

                              {muscle.imageUrls &&
                                muscle.imageUrls.length > 0 && (
                                  <div className="mt-3 grid grid-cols-2 gap-2">
                                    {muscle.imageUrls
                                      .slice(0, 2)
                                      .map((url, index) => (
                                        <div
                                          key={index}
                                          className="relative h-24 overflow-hidden rounded-md"
                                        >
                                          <img
                                            src={url}
                                            alt={`${muscle.name} 图片 ${
                                              index + 1
                                            }`}
                                            className="object-cover w-full h-full"
                                          />
                                        </div>
                                      ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <p className="text-gray-500">暂无相关肌肉信息</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-500">请在人体模型上选择一个部位</p>
                  <p className="text-sm text-gray-400 mt-2">
                    点击身体的不同部位可以查看详细信息
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 调试信息 */}
          <div className="mt-4">
            <details className="bg-gray-100 p-4 rounded-lg">
              <summary className="font-medium cursor-pointer">调试信息</summary>
              <div className="mt-2 text-sm">
                <p>当前加载的身体部位数量: {bodyParts.length}</p>
                <p>当前加载的肌肉类型数量: {muscleTypes.length}</p>
                <p>使用测试数据: {useTestData ? "是" : "否"}</p>
                <p>选中的部位ID: {selectedBodyPart?._id || "无"}</p>
                <p>选中的部位名称: {selectedBodyPart?.name || "无"}</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
