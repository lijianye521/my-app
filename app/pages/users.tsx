import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserCog, AlertCircle, CheckCircle2, Plus, Key, UserPlus } from "lucide-react";
import { UserItem } from "./types";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UsersManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  
  // 修改密码相关状态
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // 添加用户相关状态
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    email: ""
  });
  const [isAddUserLoading, setIsAddUserLoading] = useState(false);

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
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordDialogOpen(true);
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
  
  // 处理添加用户表单变更
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理添加用户提交
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.confirmPassword) {
      toast.error("请填写所有必填字段");
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }
    
    try {
      setIsAddUserLoading(true);
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          nickname: newUser.nickname,
          email: newUser.email,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "添加用户失败");
      }
      
      toast.success("用户添加成功");
      setIsAddUserDialogOpen(false);
      
      // 重置表单
      setNewUser({
        username: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        email: ""
      });
      
      // 重新加载用户列表
      hasInitialFetchedRef.current = false;
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "添加用户时出错");
    } finally {
      setIsAddUserLoading(false);
    }
  };

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
        <h2 className="text-2xl font-bold">用户管理</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{users.length}个用户</Badge>
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
          
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddUserDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            添加用户
          </Button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
              <tr key={user.id} className="hover:bg-gray-50">
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
      
      {/* 添加用户对话框 */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加新用户</DialogTitle>
            <DialogDescription>
              创建一个新的用户账号
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                用户名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="请输入用户名"
                value={newUser.username}
                onChange={handleNewUserChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nickname">昵称</Label>
              <Input
                id="nickname"
                name="nickname"
                placeholder="请输入昵称"
                value={newUser.nickname}
                onChange={handleNewUserChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="请输入邮箱"
                value={newUser.email}
                onChange={handleNewUserChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                密码 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                value={newUser.password}
                onChange={handleNewUserChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                确认密码 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                value={newUser.confirmPassword}
                onChange={handleNewUserChange}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddUserDialogOpen(false)}
              disabled={isAddUserLoading}
            >
              取消
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={isAddUserLoading}
            >
              {isAddUserLoading ? "添加中..." : "添加用户"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
