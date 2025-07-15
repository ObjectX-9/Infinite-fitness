"use client";
import { TrainingDay } from "@/module/fit-record/trainingPlan/type";
import { SetType, TrainingSet } from "@/module/fit-record/trainingPlan/SetTypes";
import { calculateVolume } from "@/module/fit-record/trainingPlan/SetTypes";
import { PlanExerciseItem } from "@/module/fit-record/trainingPlan/type";
import { useState } from "react";
import { ExerciseDetail } from "./ExerciseDetail";

interface ScheduleContentProps {
  selectedSchedule: TrainingDay;
}

// 跟踪每个训练的完成状态
interface TrainingProgress {
  [exerciseId: string]: {
    isStarted: boolean;
    isCompleted: boolean;
    completedSets: number;
    totalSets: number;
  }
}

export function ScheduleContent({ selectedSchedule }: ScheduleContentProps) {
  const [selectedExercise, setSelectedExercise] = useState<PlanExerciseItem | null>(null);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({});

  // 获取训练组类型对应的显示文本
  const getSetTypeText = (type: SetType): string => {
    return type;
  };

  // 格式化训练组摘要
  const formatSetSummary = (exercise: PlanExerciseItem): string => {
    if (!exercise.trainingSets || exercise.trainingSets.length === 0) {
      return "未设置组数";
    }
    
    const totalSets = exercise.trainingSets.reduce(
      (acc: number, set: TrainingSet) => acc + set.sets.length, 
      0
    );
    
    // 计算总容量（重量 × 次数）
    const totalVolume = exercise.trainingSets.reduce(
      (acc: number, set: TrainingSet) => acc + calculateVolume(set.sets), 
      0
    ).toFixed(0);
    
    // 如果有进度记录，显示完成组数
    const progress = exercise.id && trainingProgress[exercise.id];
    if (progress && progress.isStarted) {
      return `${progress.completedSets}/${totalSets} 组 | ${totalVolume}kg`;
    }
    
    return `${totalSets} 组 | ${totalVolume}kg`;
  };

  // 获取训练状态
  const getExerciseStatus = (exercise: PlanExerciseItem) => {
    if (!exercise.id || !trainingProgress[exercise.id]) {
      return "未开始";
    }
    
    const progress = trainingProgress[exercise.id];
    if (progress.isCompleted) {
      return "已完成";
    } else if (progress.isStarted) {
      return "进行中";
    } else {
      return "未开始";
    }
  };

  // 获取训练状态颜色
  const getExerciseStatusColor = (exercise: PlanExerciseItem) => {
    const status = getExerciseStatus(exercise);
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "进行中":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // 处理训练完成更新
  const handleTrainingUpdate = (
    exercise: PlanExerciseItem, 
    isCompleted: boolean, 
    completedSets: number
  ) => {
    if (!exercise.id) return;
    
    const totalSets = exercise.trainingSets.reduce(
      (acc, set) => acc + set.sets.length, 
      0
    );
    
    setTrainingProgress(prev => ({
      ...prev,
      [exercise.id]: {
        isStarted: true,
        isCompleted,
        completedSets,
        totalSets
      }
    }));
    
    setSelectedExercise(null);
  };
  
  // 开始新训练
  const startNewWorkout = () => {
    // 重置所有训练进度
    setTrainingProgress({});
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm min-h-[300px]">
      {selectedSchedule && selectedSchedule.exercises.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                {selectedSchedule.isRestDay ? "休息日" : "训练日"}
              </span>
              <h3 className="font-semibold text-lg">{selectedSchedule.name}</h3>
            </div>
            
            {/* 显示进度 */}
            {Object.keys(trainingProgress).length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {Object.values(trainingProgress).filter(p => p.isCompleted).length}/{selectedSchedule.exercises.length} 已完成
              </div>
            )}
          </div>

          <div className="space-y-3">
            {selectedSchedule.exercises.map((exercise, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">{exercise.name}</span>
                    
                    {/* 训练状态标签 */}
                    {exercise.id && trainingProgress[exercise.id] && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getExerciseStatusColor(exercise)}`}>
                        {getExerciseStatus(exercise)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatSetSummary(exercise)}
                  </div>
                </div>
                
                {/* 显示训练组类型 */}
                <div className="mt-2 text-xs">
                  {exercise.trainingSets && exercise.trainingSets.map((set: TrainingSet, setIndex: number) => (
                    <div key={setIndex} className="inline-block mr-2 mb-2 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-md">
                      {getSetTypeText(set.type)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
              onClick={() => {
                // 选择第一个未完成的训练动作
                const firstUncompletedExercise = selectedSchedule.exercises.find(ex => 
                  !ex.id || !trainingProgress[ex.id] || !trainingProgress[ex.id].isCompleted
                );
                if (firstUncompletedExercise) {
                  setSelectedExercise(firstUncompletedExercise);
                }
              }}
            >
              {Object.keys(trainingProgress).length > 0 ? "继续训练" : "开始训练"}
            </button>
            
            {Object.keys(trainingProgress).length > 0 && (
              <button 
                className="w-full border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={startNewWorkout}
              >
                重新开始
              </button>
            )}
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
      
      {/* 训练详情弹窗 */}
      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onComplete={(isCompleted, completedSets) => 
            handleTrainingUpdate(selectedExercise, isCompleted, completedSets)
          }
        />
      )}
    </div>
  );
}
