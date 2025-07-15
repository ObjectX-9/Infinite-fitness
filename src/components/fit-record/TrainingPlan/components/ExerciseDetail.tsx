"use client";
import { PlanExerciseItem } from "@/module/fit-record/trainingPlan/type";
import { SetType, BaseSet } from "@/module/fit-record/trainingPlan/SetTypes";
import { useState, useEffect, useRef } from "react";

interface ExerciseDetailProps {
  exercise: PlanExerciseItem;
  onClose: () => void;
  onComplete?: (isCompleted: boolean, completedSets: number) => void;
}

// 训练状态接口
interface TrainingStatus {
  currentSetGroupIndex: number;  // 当前训练组索引
  currentSetIndex: number;       // 当前组索引
  completed: boolean[][];        // 完成状态二维数组 [训练组索引][组索引]
  isResting: boolean;           // 是否正在休息
  restTimeRemaining: number;    // 剩余休息时间
  isCompleted: boolean;         // 整个训练是否已完成
}

export function ExerciseDetail({ exercise, onClose, onComplete }: ExerciseDetailProps) {
  const [expandedSetIndex, setExpandedSetIndex] = useState<number | null>(0); // 默认展开第一个训练组
  const [isTrainingMode, setIsTrainingMode] = useState(false); // 是否处于训练模式
  
  // 初始化训练状态
  const initTrainingStatus = (): TrainingStatus => {
    const completed = exercise.trainingSets.map(set => 
      new Array(set.sets.length).fill(false)
    );
    
    return {
      currentSetGroupIndex: 0,
      currentSetIndex: 0,
      completed,
      isResting: false,
      restTimeRemaining: 0,
      isCompleted: false
    };
  };
  
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>(initTrainingStatus());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // 获取训练组类型的显示名称
  const getSetTypeLabel = (type: SetType): string => {
    return type;
  };
  
  // 获取训练组类型的特点描述
  const getSetTypeDescription = (type: SetType): string => {
    switch(type) {
      case SetType.NORMAL:
        return "常规训练组，保持相同重量和次数";
      case SetType.DROP_SET:
        return "递减训练组，逐渐减少重量，连续完成多组";
      case SetType.PYRAMID_UP:
        return "金字塔递增组，逐渐增加重量，减少次数";
      case SetType.PYRAMID_DOWN:
        return "金字塔递减组，逐渐减少重量，增加次数";
      case SetType.PYRAMID_FULL:
        return "全金字塔组，先增加重量后减少重量";
      case SetType.SUPER_SET:
        return "超级组，连续完成两个不同的动作";
      case SetType.GIANT_SET:
        return "巨人组，连续完成三个或更多动作";
      default:
        return "自定义训练组";
    }
  };
  
  // 获取当前训练组和训练项
  const getCurrentTrainingSet = () => {
    if (trainingStatus.isCompleted) {
      return null;
    }
    
    const currentSetGroup = exercise.trainingSets[trainingStatus.currentSetGroupIndex];
    if (!currentSetGroup) return null;
    
    const currentSet = currentSetGroup.sets[trainingStatus.currentSetIndex];
    if (!currentSet) return null;
    
    return { 
      currentSetGroup, 
      currentSet,
      setGroupIndex: trainingStatus.currentSetGroupIndex,
      setIndex: trainingStatus.currentSetIndex 
    };
  };
  
  // 开始休息倒计时
  const startRestTimer = (seconds: number) => {
    setTrainingStatus(prev => ({
      ...prev,
      isResting: true,
      restTimeRemaining: seconds
    }));
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTrainingStatus(prev => {
        if (prev.restTimeRemaining <= 1) {
          // 倒计时结束
          clearInterval(timerRef.current!);
          return {
            ...prev,
            isResting: false,
            restTimeRemaining: 0
          };
        }
        
        return {
          ...prev,
          restTimeRemaining: prev.restTimeRemaining - 1
        };
      });
    }, 1000);
  };
  
  // 标记当前训练组完成
  const markCurrentSetCompleted = () => {
    const current = getCurrentTrainingSet();
    if (!current) return;
    
    const { setGroupIndex, setIndex } = current;
    
    // 更新完成状态
    setTrainingStatus(prev => {
      const newCompleted = [...prev.completed];
      newCompleted[setGroupIndex][setIndex] = true;
      
      // 计算已完成的组数
      const totalCompletedSets = newCompleted.reduce((acc, group) => {
        return acc + group.filter(isCompleted => isCompleted).length;
      }, 0);
      
      // 检查是否需要移动到下一组
      let nextSetGroupIndex = setGroupIndex;
      let nextSetIndex = setIndex + 1;
      let isAllCompleted = false;
      
      // 如果当前训练组内的所有组都完成了
      if (nextSetIndex >= exercise.trainingSets[setGroupIndex].sets.length) {
        nextSetIndex = 0;
        nextSetGroupIndex++;
        
        // 如果所有训练组都完成了
        if (nextSetGroupIndex >= exercise.trainingSets.length) {
          isAllCompleted = true;
          
          // 调用完成回调
          if (onComplete) {
            onComplete(true, totalCompletedSets);
          }
        }
      }
      
      // 获取休息时间
      const restTime = current.currentSet.restTime || 60; // 默认60秒
      
      // 如果不是最后一组，开始休息倒计时
      if (!isAllCompleted) {
        startRestTimer(restTime);
      }
      
      return {
        ...prev,
        completed: newCompleted,
        currentSetGroupIndex: nextSetGroupIndex,
        currentSetIndex: nextSetIndex,
        isCompleted: isAllCompleted,
      };
    });
  };
  
  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 开始训练
  const startTraining = () => {
    setIsTrainingMode(true);
    setTrainingStatus(initTrainingStatus());
    // 默认展开当前训练组
    setExpandedSetIndex(0);
  };
  
  // 训练视图
  const renderTrainingView = () => {
    const current = getCurrentTrainingSet();
    
    if (trainingStatus.isCompleted) {
      return (
        <div className="p-4 text-center">
          <div className="mb-4">
            <svg 
              className="w-16 h-16 mx-auto text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">训练完成！</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">干得好！你完成了所有训练组</p>
          <button
            onClick={() => {
              // 计算总完成组数
              const totalCompletedSets = trainingStatus.completed.reduce((acc, group) => {
                return acc + group.filter(isCompleted => isCompleted).length;
              }, 0);
              
              // 调用完成回调
              if (onComplete) {
                onComplete(true, totalCompletedSets);
              }
              
              setIsTrainingMode(false);
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            返回详情
          </button>
        </div>
      );
    }
    
    if (!current) {
      return <div>无法获取当前训练信息</div>;
    }
    
    const { currentSetGroup, currentSet, setIndex } = current;
    
    return (
      <div className="p-4">
        {/* 休息倒计时 */}
        {trainingStatus.isResting && (
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 text-center">
            <h3 className="font-semibold text-lg mb-1">休息时间</h3>
            <div className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-2">
              {formatTime(trainingStatus.restTimeRemaining)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              准备下一组训练...
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="font-semibold mb-1">当前训练组</h3>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-medium">{getSetTypeLabel(currentSetGroup.type)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getSetTypeDescription(currentSetGroup.type)}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">当前组</h3>
          <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300">第 {setIndex + 1} 组 / {currentSetGroup.sets.length}</span>
              <span className="font-semibold">{currentSet.reps} 次</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-700 dark:text-gray-300">重量</span>
              <span className="font-semibold">{currentSet.weight} kg</span>
            </div>
            {currentSet.rpe !== undefined && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">RPE</span>
                <span className="font-semibold">{currentSet.rpe}</span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={markCurrentSetCompleted}
          disabled={trainingStatus.isResting}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            trainingStatus.isResting
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {trainingStatus.isResting ? "休息中..." : "完成此组"}
        </button>
      </div>
    );
  };
  
  // 详情视图
  const renderDetailView = () => {
    return (
      <>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* 动作信息 */}
          {exercise.muscleGroup && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                主要肌群: {exercise.muscleGroup}
              </p>
              {exercise.subMuscleGroups && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  具体部位: {exercise.subMuscleGroups.join(', ')}
                </p>
              )}
            </div>
          )}
          
          {/* 训练组列表 */}
          <div className="space-y-4">
            {exercise.trainingSets.map((trainingSet, index) => (
              <div 
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* 训练组标题 */}
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 cursor-pointer"
                  onClick={() => setExpandedSetIndex(expandedSetIndex === index ? null : index)}
                >
                  <div>
                    <span className="font-medium">{getSetTypeLabel(trainingSet.type)}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {getSetTypeDescription(trainingSet.type)}
                    </p>
                  </div>
                  <div className="text-gray-400">
                    {expandedSetIndex === index ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* 训练组详情 */}
                {expandedSetIndex === index && (
                  <div className="p-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 dark:text-gray-400">
                          <th className="pb-2">组数</th>
                          <th className="pb-2">重量(kg)</th>
                          <th className="pb-2">次数</th>
                          {trainingSet.sets.some(s => s.rpe !== undefined) && <th className="pb-2">RPE</th>}
                          {trainingSet.sets.some(s => s.restTime !== undefined) && <th className="pb-2">休息(秒)</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {trainingSet.sets.map((set: BaseSet, setIndex: number) => (
                          <tr key={setIndex} className="border-t border-gray-100 dark:border-gray-700">
                            <td className="py-2">{setIndex + 1}</td>
                            <td className="py-2">{set.weight}</td>
                            <td className="py-2">{set.reps}</td>
                            {trainingSet.sets.some(s => s.rpe !== undefined) && (
                              <td className="py-2">{set.rpe || '-'}</td>
                            )}
                            {trainingSet.sets.some(s => s.restTime !== undefined) && (
                              <td className="py-2">{set.restTime || '-'}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* 训练组笔记 */}
                    {trainingSet.notes && (
                      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <p className="font-medium">笔记:</p>
                        <p>{trainingSet.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* 训练动作笔记 */}
          {exercise.notes && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-sm">动作笔记:</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{exercise.notes}</p>
            </div>
          )}
        </div>
        
        {/* 底部按钮 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={startTraining}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            开始训练
          </button>
        </div>
      </>
    );
  };

  // 关闭并保存进度
  const handleClose = () => {
    // 如果正在训练模式且已经有完成的组，则保存进度
    if (isTrainingMode) {
      // 计算总完成组数
      const totalCompletedSets = trainingStatus.completed.reduce((acc, group) => {
        return acc + group.filter(isCompleted => isCompleted).length;
      }, 0);
      
      // 只有在有完成的组时才调用回调
      if (totalCompletedSets > 0 && onComplete) {
        onComplete(trainingStatus.isCompleted, totalCompletedSets);
      }
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-4 rounded-lg shadow-lg overflow-hidden">
        {/* 头部 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            {isTrainingMode ? `训练: ${exercise.name}` : exercise.name}
          </h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* 内容 */}
        {isTrainingMode ? renderTrainingView() : renderDetailView()}
      </div>
    </div>
  );
} 