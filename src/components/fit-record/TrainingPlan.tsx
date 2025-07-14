"use client"
import { trainingPlans } from "@/module/fit-record/data";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export function TrainingPlan() {
  const [currentPlanId, setCurrentPlanId] = useState(trainingPlans[0].id);

  const currentPlan = trainingPlans.find(plan => plan.id === currentPlanId) || trainingPlans[0];
  
  // 获取当天的训练计划
  const today = new Date().getDay(); // 0-6，0是周日
  const dayIndex = today === 0 ? 6 : today - 1; // 转换为周一为0的索引
  const todaySchedule = currentPlan.schedule[dayIndex];
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {trainingPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setCurrentPlanId(plan.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              currentPlanId === plan.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {plan.name}
          </button>
        ))}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">{currentPlan.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {currentPlan.duration} · {currentPlan.targetMuscles.join(', ')}
            </p>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">完成度</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {currentPlan.completionPercentage}%
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress 
            value={currentPlan.completionPercentage}
            className="h-2"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            进度：{currentPlan.progressRate}
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold mb-3">今日训练计划</h3>
        {todaySchedule ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                日 {todaySchedule.day}
              </span>
              <span className="font-medium">
                {todaySchedule.focus}
              </span>
            </div>
            
            {todaySchedule.exercises.length > 0 ? (
              <div className="space-y-4">
                {todaySchedule.exercises.map((exercise, index) => (
                  <div key={index} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {exercise.sets} 组 × {exercise.repsRange}
                      </span>
                    </div>
                    <div className="flex mt-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mr-2">
                        休息: {exercise.rest}
                      </span>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        标记为完成
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium mt-4">
                  开始训练
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">🎉</div>
                <h4 className="font-medium text-lg mb-1">今日休息日</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  恢复对肌肉生长至关重要。今天可以做一些轻度拉伸或有氧活动。
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            暂无今日训练计划
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">周计划概览</h3>
          <button className="text-xs text-blue-600 dark:text-blue-400">查看全部</button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {currentPlan.schedule.map((day, index) => (
            <div 
              key={index} 
              className={`p-2 rounded text-center ${
                index === dayIndex 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <div className="text-xs">{index + 1}</div>
              <div className="text-xs font-medium mt-1 truncate w-full">
                {day.exercises.length > 0 ? day.focus : "休息"}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
          <button className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            导出计划
          </button>
          <button className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            调整计划
          </button>
        </div>
      </div>
    </div>
  );
} 