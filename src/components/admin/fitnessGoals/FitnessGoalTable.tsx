import { Button } from "@/components/ui/button";
import { FitnessGoal } from "@/model/fit-record/ExerciseItem/fitnessGoal/type";

interface FitnessGoalTableProps {
  fitnessGoals: FitnessGoal[];
  loading: boolean;
  onEdit: (fitnessGoal: FitnessGoal) => void;
  onDelete: (id: string) => void;
}

/**
 * 训练目标表格组件
 * @param props 组件属性
 * @returns 训练目标表格组件
 */
export function FitnessGoalTable({
  fitnessGoals,
  loading,
  onEdit,
  onDelete,
}: FitnessGoalTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 text-left">名称</th>
            <th className="p-2 text-left">描述</th>
            <th className="p-2 text-left">图片</th>
            <th className="p-2 text-left">排序</th>
            <th className="p-2 text-left">自定义</th>
            <th className="p-2 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                加载中...
              </td>
            </tr>
          ) : fitnessGoals.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                暂无数据
              </td>
            </tr>
          ) : (
            fitnessGoals.map((fitnessGoal) => (
              <tr key={fitnessGoal._id} className="border-b">
                <td className="p-2">{fitnessGoal.name}</td>
                <td className="p-2">{fitnessGoal.description}</td>
                <td className="p-2">
                  {fitnessGoal.imageUrls && fitnessGoal.imageUrls.length > 0 ? (
                    <img
                      src={fitnessGoal.imageUrls[0]}
                      alt={fitnessGoal.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/40?text=N/A";
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2">{fitnessGoal.order}</td>
                <td className="p-2">{fitnessGoal.isCustom ? '是' : '否'}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(fitnessGoal)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(fitnessGoal._id)}
                    >
                      删除
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 