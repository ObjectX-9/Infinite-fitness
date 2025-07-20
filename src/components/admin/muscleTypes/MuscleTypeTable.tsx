import { Button } from "@/components/ui/button";
import { MuscleType } from "@/model/fit-record/BodyType/muscleType/type";
import { BodyPartType } from "@/model/fit-record/BodyType/bodyPartType/type";
import { getMuscleTypeLabel } from "./const";
import { getCategoryLabel } from "@/components/admin/bodyParts/const";

interface MuscleTypeTableProps {
  muscleTypes: MuscleType[];
  bodyParts: BodyPartType[];
  loading: boolean;
  onEdit: (muscleType: MuscleType) => void;
  onDelete: (id: string) => void;
}

/**
 * 肌肉类型表格组件
 * @param props 组件属性
 * @returns 肌肉类型表格组件
 */
export function MuscleTypeTable({
  muscleTypes,
  bodyParts,
  loading,
  onEdit,
  onDelete,
}: MuscleTypeTableProps) {
  /**
   * 获取身体部位名称
   * @param bodyPartId 身体部位ID
   * @returns 身体部位名称
   */
  const getBodyPartName = (bodyPartId?: string) => {
    if (!bodyPartId) return "-";
    const bodyPart = bodyParts.find((bp) => bp._id === bodyPartId);
    return bodyPart ? getCategoryLabel(bodyPart.name) : "-";
  };

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 text-left">名称</th>
            <th className="p-2 text-left">描述</th>
            <th className="p-2 text-left">所属部位</th>
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
          ) : muscleTypes.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                暂无数据
              </td>
            </tr>
          ) : (
            muscleTypes.map((muscleType) => (
              <tr key={muscleType._id} className="border-b">
                <td className="p-2 max-w-[150px]">
                  <div
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    title={getMuscleTypeLabel(muscleType.name)}
                  >
                    {getMuscleTypeLabel(muscleType.name)}
                  </div>
                </td>
                <td className="p-2 max-w-[200px]">
                  <div
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    title={muscleType.description}
                  >
                    {muscleType.description}
                  </div>
                </td>
                <td className="p-2 max-w-[150px]">
                  <div
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    title={getBodyPartName(muscleType.bodyPartId)}
                  >
                    {getBodyPartName(muscleType.bodyPartId)}
                  </div>
                </td>
                <td className="p-2">{muscleType.order}</td>
                <td className="p-2">{muscleType.isCustom ? "是" : "否"}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(muscleType)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(muscleType._id)}
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
