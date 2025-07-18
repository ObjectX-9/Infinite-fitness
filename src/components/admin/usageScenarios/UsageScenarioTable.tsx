import { Button } from "@/components/ui/button";
import { UsageScenario } from "@/model/fit-record/ExerciseItem/usageScenarios/type";

interface UsageScenarioTableProps {
  usageScenarios: UsageScenario[];
  loading: boolean;
  onEdit: (usageScenario: UsageScenario) => void;
  onDelete: (id: string) => void;
}

/**
 * 使用场景表格组件
 * @param props 组件属性
 * @returns 使用场景表格组件
 */
export function UsageScenarioTable({
  usageScenarios,
  loading,
  onEdit,
  onDelete,
}: UsageScenarioTableProps) {
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
          ) : usageScenarios.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                暂无数据
              </td>
            </tr>
          ) : (
            usageScenarios.map((usageScenario) => (
              <tr key={usageScenario._id} className="border-b">
                <td className="p-2">{usageScenario.name}</td>
                <td className="p-2">{usageScenario.description}</td>
                <td className="p-2">
                  {usageScenario.imageUrls && usageScenario.imageUrls.length > 0 ? (
                    <img
                      src={usageScenario.imageUrls[0]}
                      alt={usageScenario.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/40?text=N/A";
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2">{usageScenario.order}</td>
                <td className="p-2">{usageScenario.isCustom ? '是' : '否'}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(usageScenario)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(usageScenario._id)}
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