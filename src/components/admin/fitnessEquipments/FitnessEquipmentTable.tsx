import { Button } from "@/components/ui/button";
import { FitnessEquipment } from "@/model/fit-record/fitnessEquipment/type";
import { fitnessEquipmentBusiness } from "@/app/business/fitnessEquipment";

interface FitnessEquipmentTableProps {
  fitnessEquipments: FitnessEquipment[];
  loading: boolean;
  onEdit: (fitnessEquipment: FitnessEquipment) => void;
  onDelete: (id: string) => void;
}

/**
 * 健身器械表格组件
 * @param props 组件属性
 * @returns 健身器械表格组件
 */
export function FitnessEquipmentTable({
  fitnessEquipments,
  loading,
  onEdit,
  onDelete,
}: FitnessEquipmentTableProps) {
  /**
   * 获取类别显示名称
   */
  const getCategoryLabel = (category: string) => {
    return fitnessEquipmentBusiness.getCategoryLabel(category);
  };

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 text-left">名称</th>
            <th className="p-2 text-left">类别</th>
            <th className="p-2 text-left">描述</th>
            <th className="p-2 text-left">图片</th>
            <th className="p-2 text-left">排序</th>
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
          ) : fitnessEquipments.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                暂无数据
              </td>
            </tr>
          ) : (
            fitnessEquipments.map((fitnessEquipment) => (
              <tr key={fitnessEquipment._id} className="border-b">
                <td className="p-2">{fitnessEquipment.name}</td>
                <td className="p-2">{getCategoryLabel(fitnessEquipment.category)}</td>
                <td className="p-2">
                  {fitnessEquipment.description.length > 50
                    ? `${fitnessEquipment.description.substring(0, 50)}...`
                    : fitnessEquipment.description}
                </td>
                <td className="p-2">
                  {fitnessEquipment.imageUrls && fitnessEquipment.imageUrls.length > 0 ? (
                    <img
                      src={fitnessEquipment.imageUrls[0]}
                      alt={fitnessEquipment.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/40?text=N/A";
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2">{fitnessEquipment.order}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(fitnessEquipment)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(fitnessEquipment._id)}
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