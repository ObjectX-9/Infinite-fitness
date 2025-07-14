import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FitTimeline } from "@/components/fit-record/FitTimeline";
import { GrowthRecord } from "@/components/fit-record/GrowthRecord";
import { TrainingPlan } from "@/components/fit-record/TrainingPlan";

export default function FitRecordPage() {
  return (
    <main className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">健身记录</h1>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="timeline">时间线</TabsTrigger>
          <TabsTrigger value="growth">增长记录</TabsTrigger>
          <TabsTrigger value="plan">训练计划</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-0">
          <FitTimeline />
        </TabsContent>
        
        <TabsContent value="growth" className="mt-0">
          <GrowthRecord />
        </TabsContent>
        
        <TabsContent value="plan" className="mt-0">
          <TrainingPlan />
        </TabsContent>
      </Tabs>
    </main>
  );
} 