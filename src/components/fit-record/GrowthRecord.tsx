"use client"
import { growthData } from "@/module/fit-record/data";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function GrowthRecord() {
  const latestMeasurement = growthData.bodyMeasurements[growthData.bodyMeasurements.length - 1];
  const firstMeasurement = growthData.bodyMeasurements[0];
  const latestStrength = growthData.strengthProgress[growthData.strengthProgress.length - 1];
  const firstStrength = growthData.strengthProgress[0];
  const latestBody = growthData.bodyComposition[growthData.bodyComposition.length - 1];
  const firstBody = growthData.bodyComposition[0];

  // 计算增长率
  const getGrowthRate = (current: number, initial: number) => {
    return ((current - initial) / initial * 100).toFixed(1);
  };

  // 获取正负变化的类名
  const getChangeClass = (change: number) => {
    return change > 0 
      ? "text-green-600 dark:text-green-400" 
      : change < 0 
        ? "text-red-600 dark:text-red-400" 
        : "text-gray-500 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="measurements" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="measurements">身体围度</TabsTrigger>
          <TabsTrigger value="strength">力量增长</TabsTrigger>
          <TabsTrigger value="composition">体脂率</TabsTrigger>
        </TabsList>
        
        <TabsContent value="measurements" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">胸围 (cm)</div>
              <div className="text-2xl font-bold mt-1">{latestMeasurement.chest}</div>
              <div className={`text-xs mt-1 ${getChangeClass(latestMeasurement.chest - firstMeasurement.chest)}`}>
                {latestMeasurement.chest - firstMeasurement.chest > 0 ? '+' : ''}
                {latestMeasurement.chest - firstMeasurement.chest} ({getGrowthRate(latestMeasurement.chest, firstMeasurement.chest)}%)
              </div>
              <Progress className="h-1 mt-2" value={(latestMeasurement.chest / 120) * 100} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">腰围 (cm)</div>
              <div className="text-2xl font-bold mt-1">{latestMeasurement.waist}</div>
              <div className={`text-xs mt-1 ${getChangeClass(latestMeasurement.waist - firstMeasurement.waist)}`}>
                {latestMeasurement.waist - firstMeasurement.waist > 0 ? '+' : ''}
                {latestMeasurement.waist - firstMeasurement.waist} ({getGrowthRate(latestMeasurement.waist, firstMeasurement.waist)}%)
              </div>
              <Progress className="h-1 mt-2" value={(latestMeasurement.waist / 100) * 100} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">臀围 (cm)</div>
              <div className="text-2xl font-bold mt-1">{latestMeasurement.hip}</div>
              <div className={`text-xs mt-1 ${getChangeClass(latestMeasurement.hip - firstMeasurement.hip)}`}>
                {latestMeasurement.hip - firstMeasurement.hip > 0 ? '+' : ''}
                {latestMeasurement.hip - firstMeasurement.hip} ({getGrowthRate(latestMeasurement.hip, firstMeasurement.hip)}%)
              </div>
              <Progress className="h-1 mt-2" value={(latestMeasurement.hip / 120) * 100} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">大腿围 (cm)</div>
              <div className="text-2xl font-bold mt-1">{latestMeasurement.thigh}</div>
              <div className={`text-xs mt-1 ${getChangeClass(latestMeasurement.thigh - firstMeasurement.thigh)}`}>
                {latestMeasurement.thigh - firstMeasurement.thigh > 0 ? '+' : ''}
                {latestMeasurement.thigh - firstMeasurement.thigh} ({getGrowthRate(latestMeasurement.thigh, firstMeasurement.thigh)}%)
              </div>
              <Progress className="h-1 mt-2" value={(latestMeasurement.thigh / 70) * 100} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">手臂围 (cm)</div>
              <div className="text-2xl font-bold mt-1">{latestMeasurement.arm}</div>
              <div className={`text-xs mt-1 ${getChangeClass(latestMeasurement.arm - firstMeasurement.arm)}`}>
                {latestMeasurement.arm - firstMeasurement.arm > 0 ? '+' : ''}
                {latestMeasurement.arm - firstMeasurement.arm} ({getGrowthRate(latestMeasurement.arm, firstMeasurement.arm)}%)
              </div>
              <Progress className="h-1 mt-2" value={(latestMeasurement.arm / 50) * 100} />
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              提示: 每月测量一次身体围度，保持相同的测量位置以确保数据准确性。
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="strength" className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">卧推 (kg)</div>
                  <div className="text-2xl font-bold mt-1">{latestStrength.benchPress}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getChangeClass(latestStrength.benchPress - firstStrength.benchPress)}`}>
                    {latestStrength.benchPress - firstStrength.benchPress > 0 ? '+' : ''}
                    {latestStrength.benchPress - firstStrength.benchPress} kg
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getGrowthRate(latestStrength.benchPress, firstStrength.benchPress)}% 增长
                  </div>
                </div>
              </div>
              <Progress className="h-1 mt-3" value={(latestStrength.benchPress / 150) * 100} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">深蹲 (kg)</div>
                  <div className="text-2xl font-bold mt-1">{latestStrength.squat}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getChangeClass(latestStrength.squat - firstStrength.squat)}`}>
                    {latestStrength.squat - firstStrength.squat > 0 ? '+' : ''}
                    {latestStrength.squat - firstStrength.squat} kg
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getGrowthRate(latestStrength.squat, firstStrength.squat)}% 增长
                  </div>
                </div>
              </div>
              <Progress className="h-1 mt-3" value={(latestStrength.squat / 200) * 100} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">硬拉 (kg)</div>
                  <div className="text-2xl font-bold mt-1">{latestStrength.deadlift}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getChangeClass(latestStrength.deadlift - firstStrength.deadlift)}`}>
                    {latestStrength.deadlift - firstStrength.deadlift > 0 ? '+' : ''}
                    {latestStrength.deadlift - firstStrength.deadlift} kg
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getGrowthRate(latestStrength.deadlift, firstStrength.deadlift)}% 增长
                  </div>
                </div>
              </div>
              <Progress className="h-1 mt-3" value={(latestStrength.deadlift / 250) * 100} />
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-300">
              提示: 力量增长是肌肉发展的重要指标。记录你的1RM（一次性最大重量）或5RM来跟踪进展。
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="composition" className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">体重 (kg)</div>
                  <div className="text-2xl font-bold mt-1">{latestBody.weight}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getChangeClass(latestBody.weight - firstBody.weight)}`}>
                    {latestBody.weight - firstBody.weight > 0 ? '+' : ''}
                    {latestBody.weight - firstBody.weight} kg
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getGrowthRate(latestBody.weight, firstBody.weight)}% 变化
                  </div>
                </div>
              </div>
              <Progress className="h-1 mt-3" value={(latestBody.weight / 100) * 100} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">体脂率 (%)</div>
                  <div className="text-2xl font-bold mt-1">{latestBody.bodyFat}%</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getChangeClass(-(latestBody.bodyFat - firstBody.bodyFat))}`}>
                    {latestBody.bodyFat - firstBody.bodyFat > 0 ? '+' : ''}
                    {latestBody.bodyFat - firstBody.bodyFat}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getGrowthRate(latestBody.bodyFat, firstBody.bodyFat)}% 变化
                  </div>
                </div>
              </div>
              <Progress className="h-1 mt-3" value={(latestBody.bodyFat / 30) * 100} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">肌肉量 (kg)</div>
                  <div className="text-2xl font-bold mt-1">{latestBody.muscleMass}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getChangeClass(latestBody.muscleMass - firstBody.muscleMass)}`}>
                    {latestBody.muscleMass - firstBody.muscleMass > 0 ? '+' : ''}
                    {latestBody.muscleMass - firstBody.muscleMass} kg
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getGrowthRate(latestBody.muscleMass, firstBody.muscleMass)}% 增长
                  </div>
                </div>
              </div>
              <Progress className="h-1 mt-3" value={(latestBody.muscleMass / 80) * 100} />
            </div>
            
            <div className="flex gap-2 mt-2">
              <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg flex-1 text-sm font-medium">
                输入新数据
              </button>
              <button className="bg-blue-500 text-white p-3 rounded-lg flex-1 text-sm font-medium">
                分析趋势
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 