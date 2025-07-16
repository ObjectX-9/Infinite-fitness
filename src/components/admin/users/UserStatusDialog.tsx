import { User, UserStatus } from "@/model/user/type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * 用户状态修改弹窗组件：提供修改用户状态的界面
 * @param props - 组件属性
 * @returns 状态修改弹窗组件
 */
interface UserStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  newStatus: UserStatus;
  setNewStatus: (status: UserStatus) => void;
  onStatusChange: () => Promise<void>;
  getStatusVariant: (status: UserStatus) => "default" | "destructive" | "outline" | "secondary";
}

export function UserStatusDialog({
  open,
  onOpenChange,
  currentUser,
  newStatus,
  setNewStatus,
  onStatusChange,
  getStatusVariant,
}: UserStatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改用户状态</DialogTitle>
          <DialogDescription>
            更改用户 {currentUser?.username} 的状态
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-status" className="text-right">
              当前状态
            </Label>
            <div className="col-span-3">
              {currentUser && (
                <Badge variant={getStatusVariant(currentUser.status)}>
                  {currentUser.status}
                </Badge>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-status" className="text-right">
              新状态
            </Label>
            <Select
              value={newStatus}
              onValueChange={(value: UserStatus) => setNewStatus(value)}
            >
              <SelectTrigger className="col-span-3" id="new-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserStatus.ACTIVE}>正常</SelectItem>
                <SelectItem value={UserStatus.INACTIVE}>未激活</SelectItem>
                <SelectItem value={UserStatus.LOCKED}>已锁定</SelectItem>
                <SelectItem value={UserStatus.DELETED}>已删除</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button onClick={onStatusChange}>确认修改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 