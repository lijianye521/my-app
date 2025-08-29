import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, UserCog, AlertCircle, CheckCircle2, Plus, Key, UserPlus, 
  Trash2, AlertTriangle, CheckSquare, Square, X 
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UserItem } from "./types";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RegisterForm from "@/components/RegisterForm";

export default function UsersManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  
  // 多选相关状态
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // 修改密码相关状态
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // 使用ref来跟踪是否已经发送请求，避免重复请求
  const hasInitialFetchedRef = useRef(false);
  
  // 直接从session中获取管理员状态
  const isAdmin = session?.user?.role === "admin";

  // 获取用户列表数据 - 使用useCallback缓存函数
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("正在获取用户列表...");
      const response = await fetch("/api/users");
      
      if (!response.ok) {
        if (response.status === 403) {
          toast.error("获取用户数据失败：没有访问权限");
          return;
        }
        
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
        console.log("用户列表获取成功:", result.data.length);
      } else {
        toast.error(result.error || "获取用户列表失败");
      }
    } catch (error) {
      console.error("获取用户列表发生错误:", error);
      toast.error("获取用户数据时发生错误，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 只有管理员才获取用户列表，并且只获取一次
  useEffect(() => {
    // 如果已经获取过数据且不是刷新页面，直接返回
    if (hasInitialFetchedRef.current) return;
    
    if (session && isAdmin) {
      hasInitialFetchedRef.current = true; // 标记为已获取
      fetchUsers();
    } else if (session) {
      // 非管理员直接设置为非加载状态
      setIsLoading(false); 
    }
  }, [session, isAdmin, fetchUsers]);

  // 获取角色标签
  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <Badge className="bg-red-500 hover:bg-red-600">管理员</Badge>;
    }
    return <Badge variant="secondary">普通用户</Badge>;
  };

  // 获取状态标签
  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Badge className="bg-green-500 hover:bg-green-600">激活</Badge>;
    }
    return <Badge variant="destructive">禁用</Badge>;
  };
  
  // 打开修改密码对话框
  const openPasswordDialog = (user: UserItem) => {
    // 检查是否有多个用户被选中
    if (selectedUserIds.length > 1) {
      toast.error("修改密码时只能选择一个用户，请取消多选后重试");
      return;
    }
    
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordDialogOpen(true);
  };
  
  // 处理复选框变更
  const handleCheckboxChange = (userId: string) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        // 如果已经选中，则取消选中
        const newSelected = prev.filter(id => id !== userId);
        setSelectAll(false);
        return newSelected;
      } else {
        // 否则添加到选中列表
        const newSelected = [...prev, userId];
        // 如果全部选中，则将selectAll设为true
        if (newSelected.length === users.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectAll) {
      // 如果当前是全选状态，则取消全选
      setSelectedUserIds([]);
      setSelectAll(false);
    } else {
      // 否则全选
      setSelectedUserIds(users.map(user => user.id));
      setSelectAll(true);
    }
  };

  // 批量删除选中的用户
  const handleBatchDelete = async () => {
    if (selectedUserIds.length === 0) {
      toast.error("请先选择要删除的用户");
      return;
    }

    try {
      // 创建一个结果跟踪对象
      const results = {
        total: selectedUserIds.length,
        success: 0,
        failed: 0,
        errors: [] as string[]
      };
      
      // 逐个删除用户，而不是使用Promise.all
      // 这样即使某些请求失败，其他请求仍然可以继续
      for (const userId of selectedUserIds) {
        try {
          const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE"
          });
          
          // 检查响应状态
          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
              // 尝试解析为JSON
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error || `删除失败(${response.status})`;
            } catch {
              // 如果无法解析为JSON，使用状态码
              errorMessage = `删除失败(${response.status})`;
            }
            
            console.error(`删除用户 ${userId} 失败:`, errorMessage);
            results.failed++;
            results.errors.push(`ID:${userId} - ${errorMessage}`);
            continue;
          }
          
          const data = await response.json();
          if (data.success) {
            results.success++;
          } else {
            results.failed++;
            results.errors.push(`ID:${userId} - ${data.error || '未知错误'}`);
          }
        } catch (err) {
          console.error(`删除用户 ${userId} 时出错:`, err);
          results.failed++;
          results.errors.push(`ID:${userId} - 请求处理错误`);
        }
      }

      // 展示结果
      if (results.success > 0) {
        toast.success(`成功删除 ${results.success} 个用户`);
        
        // 从用户列表中移除已删除的用户
        const successIds = selectedUserIds.filter((_, index) => index < results.success);
        setUsers(prev => prev.filter(user => !successIds.includes(user.id)));
        
        // 清空选中状态
        setSelectedUserIds([]);
        setSelectAll(false);
      }
      
      // 如果有失败的，显示错误
      if (results.failed > 0) {
        console.error("删除失败详情:", results.errors);
        toast.error(`${results.failed} 个用户删除失败，请查看控制台了解详情`);
      }
    } catch (error) {
      console.error("批量删除用户失败:", error);
      toast.error("删除用户时发生错误");
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  };
  
  // 处理密码修改提交
  const handlePasswordChange = async () => {
    if (!selectedUser) return;
    
    if (!newPassword || !confirmPassword) {
      toast.error("请输入密码");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }
    
    try {
      setIsPasswordLoading(true);
      
      const response = await fetch(`/api/users/${selectedUser.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "修改密码失败");
      }
      
      toast.success(`已成功修改用户 ${selectedUser.username} 的密码`);
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "修改密码时出错");
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  // 不再需要单独的注册成功处理函数

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card className="bg-amber-50 border-amber-200 my-6">
          <CardContent className="p-6">
            <div className="flex items-center text-amber-800 mb-4">
              <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0" />
              <p>只有管理员才能访问此页面。</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push("/pages/dashboard")}
              className="mt-2"
            >
              返回仪表板
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">用户管理</h2>
          <Badge variant="secondary">{users.length}个用户</Badge>
          {selectedUserIds.length > 0 && (
            <Badge variant="destructive">{selectedUserIds.length}个用户已选中</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              // 手动刷新时重置状态，允许获取数据
              hasInitialFetchedRef.current = false;
              fetchUsers();
            }}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            刷新数据
          </Button>
          
          {selectedUserIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              批量删除 ({selectedUserIds.length})
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                添加用户
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>添加新用户</DialogTitle>
                <DialogDescription>
                  创建一个新的用户账号
                </DialogDescription>
              </DialogHeader>
              <RegisterForm 
                onSuccess={() => {
                  // 重新加载用户列表
                  hasInitialFetchedRef.current = false;
                  fetchUsers();
                }} 
                isDialog={true} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center">
                <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="全选"
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                密码 (加密存储)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                昵称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                邮箱
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                更新时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className={`hover:bg-gray-50 ${selectedUserIds.includes(user.id) ? 'bg-blue-50' : ''}`}
                onClick={() => handleCheckboxChange(user.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={() => handleCheckboxChange(user.id)}
                      aria-label={`选择用户 ${user.username}`}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{user.password}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.nickname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.is_active)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleString('zh-CN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.updated_at).toLocaleString('zh-CN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPasswordDialog(user)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Key className="h-4 w-4 mr-1" />
                    修改密码
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="flex items-center p-6 text-blue-800">
            <Users className="h-6 w-6 mr-3 flex-shrink-0" />
            <p>暂无用户数据。</p>
          </CardContent>
        </Card>
      )}
      
      {/* 修改密码对话框 */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
            <DialogDescription>
              为用户 {selectedUser?.username} 设置新密码
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="输入新密码"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入新密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPasswordDialogOpen(false)}
              disabled={isPasswordLoading}
            >
              取消
            </Button>
            <Button 
              onClick={handlePasswordChange}
              disabled={isPasswordLoading}
            >
              {isPasswordLoading ? "处理中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 添加用户对话框组件已移至按钮旁 */}
      
      {/* 批量删除确认对话框 */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              确认删除
            </DialogTitle>
            <DialogDescription>
              您确定要删除选中的 {selectedUserIds.length} 个用户吗？此操作不可恢复。
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm mb-4">
              <p>警告：删除用户将同时删除与其相关的所有数据！</p>
            </div>
            
            <ul className="max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
              {users
                .filter(user => selectedUserIds.includes(user.id))
                .map(user => (
                  <li key={user.id} className="py-1 flex items-center">
                    <CheckSquare className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="font-medium">{user.username}</span>
                    {user.nickname && <span className="text-gray-500 ml-2">({user.nickname})</span>}
                    {user.role === 'admin' && <Badge className="ml-2 bg-red-500">管理员</Badge>}
                  </li>
                ))}
            </ul>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              取消
            </Button>
            <Button 
              variant="destructive"
              onClick={handleBatchDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
