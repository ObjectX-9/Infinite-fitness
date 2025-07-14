"use client";
import { mockTrainingPlans } from "@/module/fit-record/trainingPlan";
import {
  TrainingPlan as TrainingPlanType,
  TrainingDay,
} from "@/module/fit-record/trainingPlan/type";
import { useState } from "react";
import { ScheduleContent } from "./components/ScheduleContent";
import { getCurrentWeekDates } from "@/lib/time";

export function TrainingPlan() {
  const [currentPlanId, setCurrentPlanId] = useState(mockTrainingPlans[0].id);
  const [selectedDayIndex, setSelectedDayIndex] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  ); // 转换为周一为0的索引

  const currentPlan: TrainingPlanType =
    mockTrainingPlans.find((plan) => plan.id === currentPlanId) ||
    mockTrainingPlans[0];

  const weekDates = getCurrentWeekDates();
  const weekDays = ["一", "二", "三", "四", "五", "六", "日"];
  const today = new Date();
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  // 获取当天的训练日程，将selectedDayIndex (周一为0) 转换为 dayOfWeek (周日为0)
  const dayOfWeek = selectedDayIndex === 6 ? 0 : selectedDayIndex + 1;
  const selectedSchedule: TrainingDay | undefined = currentPlan.days.find(
    (day) => day.dayOfWeek === dayOfWeek
  ) || {
    id: "empty",
    name: "未安排训练",
    dayOfWeek: dayOfWeek,
    isRestDay: true,
    exercises: [],
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">我的日程</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
      </div>

      {/* 计划选择器 */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {mockTrainingPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setCurrentPlanId(plan.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              currentPlanId === plan.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {plan.name}
          </button>
        ))}
      </div>

      {/* 周日期选择器 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const isToday = index === todayIndex;
            const isSelected = index === selectedDayIndex;

            return (
              <button
                key={index}
                onClick={() => setSelectedDayIndex(index)}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900"
                    : isToday
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <span className="text-xs font-medium mb-1">
                  {weekDays[index]}
                </span>
                <span className="text-lg font-semibold">{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 日程内容 */}
      <ScheduleContent selectedSchedule={selectedSchedule} />
    </div>
  );
}
