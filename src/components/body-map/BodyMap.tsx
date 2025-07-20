/**
 * 功能：身体地图组件，使用SVG实现身体部位的可交互显示
 */
"use client";

import React, { useEffect, useState } from "react";
import { BodyPartType } from "@/model/fit-record/BodyType/bodyPartType/type";
import { EBodyPartTypeCategory } from "@/model/fit-record/BodyType/bodyPartType/type";

interface BodyMapProps {
  gender: "male" | "female";
  view: "front" | "back";
  onSelectPart: (partId: string) => void;
  selectedBodyPartId?: string;
  bodyParts?: BodyPartType[];
}

/**
 * 身体地图组件
 * @param props - 组件属性
 * @returns 身体地图组件
 */
const BodyMap: React.FC<BodyMapProps> = ({
  gender,
  view,
  onSelectPart,
  selectedBodyPartId,
  bodyParts = [],
}) => {
  const [svgContent, setSvgContent] = useState<string>("");

  // 根据性别和视角选择SVG图片
  const getSvgPath = () => {
    if (gender === "male") {
      return view === "front" ? "/maleFontBody.svg" : "/maleBackBody.svg";
    } else {
      return view === "front" ? "/femaleFontBody.svg" : "/femaleBackBody.svg";
    }
  };

  // 根据部位类别获取对应SVG中的id
  const getPartIdByCategoryName = (category: string): string => {
    switch (category.toLowerCase()) {
      case EBodyPartTypeCategory.CHEST:
        return "chest";
      case EBodyPartTypeCategory.BACK:
        return "back";
      case EBodyPartTypeCategory.ARM:
        return "biceps"; // 或者 "forearms"
      case EBodyPartTypeCategory.LEG:
        return "quads"; // 或者 "calves"
      case EBodyPartTypeCategory.ABDOMEN:
        return "abdominals";
      case EBodyPartTypeCategory.HIPS:
        return "obliques";
      case EBodyPartTypeCategory.SHOULDER:
        return "front-shoulders";
      default:
        return "";
    }
  };

  // 加载SVG内容
  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(getSvgPath());
        let svgText = await response.text();

        // 修复SVG颜色问题 - 替换可能的黑色或当前颜色为浅灰色
        svgText = svgText.replace(/fill="black"/g, 'fill="#d1d5db"');
        svgText = svgText.replace(/fill="currentColor"/g, 'fill="#d1d5db"');
        svgText = svgText.replace(
          /class="bodymap[^"]*"/g,
          'class="bodymap" style="fill:#d1d5db;stroke:#484a68;stroke-width:1px"'
        );

        setSvgContent(svgText);
      } catch (error) {
        console.error("加载SVG失败:", error);
      }
    };

    fetchSvg();
  }, [gender, view]);

  // 设置点击事件和初始化颜色
  useEffect(() => {
    if (!svgContent) return;

    // 等待DOM更新后添加事件
    setTimeout(() => {
      const svgContainer = document.getElementById("body-map-container");
      if (!svgContainer) return;

      // 首先设置所有部位为默认颜色
      const allParts = svgContainer.querySelectorAll(".bodymap");
      allParts.forEach((part) => {
        part.setAttribute(
          "style",
          "fill: #d1d5db; stroke: #484a68; stroke-width: 1px; cursor: pointer;"
        );
      });

      const bodyPartElements = svgContainer.querySelectorAll(".bodymap");

      bodyPartElements.forEach((part) => {
        // 为每个部位添加点击事件
        part.addEventListener("click", (e) => {
          e.stopPropagation(); // 阻止事件冒泡

          const partId = part.id;
          console.log("点击的部位ID:", partId);

          // 找到对应的身体部位
          const bodyPart = bodyParts.find(
            (p) => getPartIdByCategoryName(p.name) === partId
          );

          if (bodyPart) {
            console.log("找到匹配的身体部位:", bodyPart.name, bodyPart._id);

            // 立即更新所有部位颜色
            allParts.forEach((p) => {
              p.setAttribute(
                "style",
                "fill: #d1d5db; stroke: #484a68; stroke-width: 1px; cursor: pointer;"
              );
            });

            // 立即高亮点击的部位
            part.setAttribute(
              "style",
              "fill: #ef4444; stroke: #484a68; stroke-width: 1px; cursor: pointer;"
            );

            // 通知父组件
            onSelectPart(bodyPart._id);
          } else {
            console.log("没有找到匹配的身体部位");
            console.log("当前bodyParts:", bodyParts);
          }
        });

        // 添加鼠标悬停效果
        part.addEventListener("mouseenter", () => {
          // 不要覆盖已选中的红色
          const selectedBodyPart = bodyParts.find(
            (p) => p._id === selectedBodyPartId
          );
          const selectedPartId = selectedBodyPart
            ? getPartIdByCategoryName(selectedBodyPart.name)
            : "";

          if (part.id !== selectedPartId) {
            part.setAttribute(
              "style",
              "fill: #f87171; stroke: #484a68; stroke-width: 1px; cursor: pointer;"
            ); // 悬停颜色
          }
        });

        part.addEventListener("mouseleave", () => {
          const selectedBodyPart = bodyParts.find(
            (p) => p._id === selectedBodyPartId
          );
          const selectedPartId = selectedBodyPart
            ? getPartIdByCategoryName(selectedBodyPart.name)
            : "";

          if (part.id === selectedPartId) {
            part.setAttribute(
              "style",
              "fill: #ef4444; stroke: #484a68; stroke-width: 1px; cursor: pointer;"
            ); // 被选中的部位保持高亮
          } else {
            part.setAttribute(
              "style",
              "fill: #d1d5db; stroke: #484a68; stroke-width: 1px; cursor: pointer;"
            ); // 恢复默认颜色
          }
        });
      });
    }, 100);
  }, [svgContent, bodyParts, selectedBodyPartId, onSelectPart]);

  // 高亮选中的部位
  useEffect(() => {
    if (!svgContent || !selectedBodyPartId) return;

    const selectedBodyPart = bodyParts.find(
      (part) => part._id === selectedBodyPartId
    );
    if (!selectedBodyPart) return;

    const svgPartId = getPartIdByCategoryName(selectedBodyPart.name);
    const svgContainer = document.getElementById("body-map-container");
    if (!svgContainer) return;

    // 先重置所有部位的颜色
    const allParts = svgContainer.querySelectorAll(".bodymap");
    allParts.forEach((part) => {
      part.setAttribute(
        "style",
        "fill: #d1d5db; stroke: #484a68; stroke-width: 1px; cursor: pointer;"
      ); // 默认颜色
    });

    // 高亮选中的部位
    const selectedPart = svgContainer.querySelector(`#${svgPartId}`);
    if (selectedPart) {
      selectedPart.setAttribute(
        "style",
        "fill: #ef4444; stroke: #484a68; stroke-width: 1px; cursor: pointer;"
      ); // 高亮颜色
    }
  }, [svgContent, selectedBodyPartId, bodyParts]);

  return (
    <div className="relative w-full max-w-md">
      <style jsx global>{`
        .bodymap {
          fill: #d1d5db;
          stroke: #484a68;
          stroke-width: 1px;
          transition: fill 0.2s ease;
          cursor: pointer;
        }
        .bodymap:hover {
          fill: #f87171;
        }
        .bodymap.selected {
          fill: #ef4444;
        }
      `}</style>
      {svgContent ? (
        <div
          id="body-map-container"
          className="w-full cursor-pointer"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default BodyMap;
