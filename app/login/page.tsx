"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import AuthNotification from "@/components/AuthNotification";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();
  
  // 通知状态
  const [notification, setNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  } | null>(null);

  // 当页面加载时检查本地存储中是否有保存的凭据
  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      try {
        const { username, password } = JSON.parse(savedCredentials);
        setUsername(username);
        setPassword(password);
        setRememberMe(true);
      } catch (error) {
        console.error('解析保存的凭据出错:', error);
        // 如果解析出错，清除本地存储中的数据
        localStorage.removeItem('savedCredentials');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setNotification({
        show: true,
        title: "登录失败",
        message: "请输入用户名和密码",
        type: "error"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setNotification({
          show: true,
          title: "登录失败",
          message: "用户名或密码错误",
          type: "error"
        });
      } else {
        // 如果勾选了"记住我"，则保存凭据到本地存储
        if (rememberMe) {
          localStorage.setItem('savedCredentials', JSON.stringify({ username, password }));
        } else {
          // 如果没有勾选，确保删除任何已保存的凭据
          localStorage.removeItem('savedCredentials');
        }
        
        setNotification({
          show: true,
          title: "登录成功",
          message: "欢迎回来！",
          type: "success"
        });
        
        // 短暂延迟后跳转，以便看到成功消息
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };
//123
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {notification && notification.show && (
        <AuthNotification
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
          <CardDescription className="text-center">
            输入您的用户名和密码登录系统
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
                <Link 
                  href="/reset-password" 
                  className="text-sm text-blue-500 hover:underline"
                >
                  忘记密码？
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* 记住密码选项 */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe} 
                onCheckedChange={(checked: boolean | "indeterminate") => setRememberMe(checked === true)}
              />
              <Label 
                htmlFor="rememberMe" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                记住我
              </Label>
            </div>
            
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              disabled={loading}
              style={{ 
                backgroundColor: '#000000', 
                borderColor: '#000000',
                color: '#ffffff'
              }}
            >
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm">
            没有账号？{" "}请向系统管理员李建业申请账号
            {/* <Link 
              href="/register" 
              className="text-blue-500 hover:underline"
            >
              立即注册
            </Link> */}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 