"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timelineData } from "@/module/fit-record/data";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import Image from "next/image";

// 定义类型
interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
}

interface PhotoContent {
  imageUrl: string;
  caption: string;
}

interface WorkoutContent {
  workoutName: string;
  duration: number;
  exercises: Exercise[];
  feeling: string;
  points: number;
}

interface RecoveryContent {
  sleepHours: number;
  fatigue: string;
  soreMuscles: string[];
  notes: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
};

const getEmojiForFeeling = (feeling: string) => {
  const feelings: Record<string, string> = {
    great: "😄",
    good: "🙂",
    normal: "😐",
    tired: "😓",
    exhausted: "🥵"
  };
  return feelings[feeling] || "😐";
};

const getEmojiForFatigue = (fatigue: string) => {
  const levels: Record<string, string> = {
    none: "✅",
    low: "🟢",
    medium: "🟡",
    high: "🔴"
  };
  return levels[fatigue] || "⚪";
};

export function FitTimeline() {
  return (
    <div className="space-y-6">
      {timelineData.map((item) => (
        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/100" />
              <AvatarFallback>用户</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="font-medium text-sm">我的健身记录</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.date)}</p>
            </div>
          </div>

          {item.type === 'photo' && (
            <div className="rounded-lg overflow-hidden mt-2">
              <Image 
                src={(item.content as PhotoContent).imageUrl || "https://placehold.co/300x400"} 
                alt="健身照片" 
                width={300} 
                height={400} 
                className="w-full object-cover rounded-lg" 
              />
              <p className="mt-2 text-sm">{(item.content as PhotoContent).caption}</p>
            </div>
          )}

          {item.type === 'workout' && (
            <div className="mt-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{(item.content as WorkoutContent).workoutName}</h3>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                  {(item.content as WorkoutContent).duration}分钟
                </span>
              </div>
              
              <div className="mt-3 space-y-2">
                {(item.content as WorkoutContent).exercises.map((exercise, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between">
                      <span>{exercise.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {exercise.sets}组 × {exercise.reps}次
                      </span>
                    </div>
                    <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
                      <div className="h-1 bg-blue-500 rounded-full" style={{ width: `${(index + 1) * 25}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <span className="text-lg mr-1">{getEmojiForFeeling((item.content as WorkoutContent).feeling)}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">感觉良好</span>
                </div>
                <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                  +{(item.content as WorkoutContent).points} 积分
                </div>
              </div>
            </div>
          )}

          {item.type === 'recovery' && (
            <div className="mt-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">恢复日</h3>
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                  睡眠 {(item.content as RecoveryContent).sleepHours}小时
                </span>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center">
                  <span className="text-lg mr-1">{getEmojiForFatigue((item.content as RecoveryContent).fatigue)}</span>
                  <span className="text-sm">疲劳度: {(item.content as RecoveryContent).fatigue === 'low' ? '轻微' : '中等'}</span>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">酸痛部位: 
                    {(item.content as RecoveryContent).soreMuscles.map((muscle, index) => (
                      <span key={index} className="ml-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {muscle}
                      </span>
                    ))}
                  </p>
                </div>
                
                <p className="mt-2 text-sm">{(item.content as RecoveryContent).notes}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-center py-4">
        <button className="text-blue-500 dark:text-blue-400 text-sm font-medium">
          查看更多记录
        </button>
      </div>
    </div>
  );
} 