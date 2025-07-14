"use client";
import { TrainingDay } from "@/module/fit-record/trainingPlan/type";

interface ScheduleContentProps {
  selectedSchedule: TrainingDay;
}

export function ScheduleContent({ selectedSchedule }: ScheduleContentProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm min-h-[300px]">
      {selectedSchedule && selectedSchedule.exercises.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
              {selectedSchedule.isRestDay ? "休息日" : "训练日"}
            </span>
            <h3 className="font-semibold text-lg">{selectedSchedule.name}</h3>
          </div>

          <div className="space-y-3">
            {selectedSchedule.exercises.map((exercise, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">{exercise.name}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {exercise.sets} 组 × {exercise.reps}{" "}
                  {exercise.weight ? `(${exercise.weight}kg)` : ""}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors">
              开始训练
            </button>
            <button className="w-full border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              查看详细计划
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h4 className="font-medium text-lg mb-2 text-gray-900 dark:text-gray-100">
            暂无日程
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {selectedSchedule.isRestDay
              ? "今天是休息日，让身体充分恢复"
              : "今天没有安排训练计划"}
          </p>
        </div>
      )}
    </div>
  );
}
