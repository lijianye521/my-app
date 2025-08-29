import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface RegisterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isDialog?: boolean;
}

export default function RegisterForm({ onSuccess, onCancel, isDialog = false }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !confirmPassword) {
      toast.error("请填写所有必填字段");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          nickname,
          email,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "注册失败");
      }
      
      toast.success("用户添加成功");
      
      // 清空表单
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setNickname("");
      setEmail("");
      
      // 执行成功回调
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "用户添加失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">用户名 <span className="text-red-500">*</span></Label>
        <Input
          id="username"
          placeholder="请输入用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nickname">昵称</Label>
        <Input
          id="nickname"
          placeholder="请输入昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          type="email"
          placeholder="请输入邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">密码 <span className="text-red-500">*</span></Label>
        <Input
          id="password"
          type="password"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">确认密码 <span className="text-red-500">*</span></Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {isDialog ? (
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "注册中..." : "添加用户"}
          </Button>
        </div>
      ) : (
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "注册中..." : "注册"}
        </Button>
      )}
    </form>
  );
}
