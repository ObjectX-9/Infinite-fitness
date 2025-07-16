import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * 管理员权限设置弹窗组件：设置或取消用户的管理员权限
 * @param props - 组件属性
 * @returns 管理员权限设置弹窗组件
 */
interface AdminRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSettingAdmin: boolean;
  onAdminChange: () => Promise<void>;
  loading: boolean;
}

export function AdminRoleDialog({
  open,
  onOpenChange,
  isSettingAdmin,
  onAdminChange,
  loading,
}: AdminRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSettingAdmin ? "设置为管理员" : "取消管理员权限"}
          </DialogTitle>
          <DialogDescription>
            {isSettingAdmin
              ? "确定要将该用户设置为系统管理员吗？管理员拥有所有系统权限。"
              : "确定要取消该用户的管理员权限吗？"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            onClick={onAdminChange}
            disabled={loading}
            variant={isSettingAdmin ? "default" : "destructive"}
          >
            {loading ? "处理中..." : isSettingAdmin ? "确认设置" : "确认取消"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 