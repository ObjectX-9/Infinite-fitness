import { UserStatus } from "@/model/user/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

/**
 * 用户搜索栏组件：实现用户搜索和状态筛选功能
 * @param props - 组件属性
 * @returns 搜索栏组件
 */
interface UserSearchBarProps {
  keyword: string;
  status: UserStatus | "all";
  onSearch: (keyword: string, status: UserStatus | "all") => void;
}

export function UserSearchBar({
  keyword,
  status,
  onSearch,
}: UserSearchBarProps) {

  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索用户名、邮箱或电话"
          value={keyword}
          onChange={(e) => onSearch(e.target.value, status)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(keyword, status)}
          className="pl-8"
        />
      </div>
      <Select
        value={status}
        onValueChange={(value: UserStatus | "all") => onSearch(keyword, value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="选择状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value={UserStatus.ACTIVE}>正常</SelectItem>
          <SelectItem value={UserStatus.INACTIVE}>未激活</SelectItem>
          <SelectItem value={UserStatus.LOCKED}>已锁定</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={() => onSearch(keyword, status)}>搜索</Button>
    </div>
  );
} 