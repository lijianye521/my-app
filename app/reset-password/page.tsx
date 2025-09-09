"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // 已经导入toast，不需要useToast hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!username || !email || !newPassword || !confirmPassword) {
      toast.error("请填写所有字段");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("密码长度至少为6位");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "密码重置失败");
      }
      
      toast.success("密码重置成功，请使用新密码登录");
      
      // 清空表单
      setUsername("");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      
      // 2秒后跳转到登录页
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error: any) {
      toast.error(error.message || "重置失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">重置密码</CardTitle>
          <CardDescription className="text-center">
            输入您的账号信息和新密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入注册时使用的邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="请输入新密码（至少6位）"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "重置中..." : "重置密码"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm">
            记起密码了？{" "}
            <Link 
              href="/login" 
              className="text-blue-500 hover:underline"
            >
              返回登录
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}