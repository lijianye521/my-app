"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import EnterpriseStockToolboxClient from "@/components/EnterpriseStockToolboxClient";
import { PlatformItem, ServiceItem } from "./pages/types";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [redirected, setRedirected] = useState(false);

  // 获取平台和服务数据
  useEffect(() => {
    // 只有在登录状态下才获取数据
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  // 检查登录状态
  useEffect(() => {
    if (status === "unauthenticated" && !redirected) {
      // 使用window.location进行重定向，避免Next.js路由问题
      setRedirected(true);
      window.location.href = "/login";
    }
  }, [status, redirected]);

  // 单独的获取数据函数
  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch('/api/platforms');
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.platforms) {
        setPlatforms(data.platforms);
      }
      
      if (data.services) {
        setServices(data.services);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  // 处理登出
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      // 使用window.location替代router.replace
      window.location.href = "/login";
    } catch (error) {
      console.error("登出错误:", error);
      // 即使出错也尝试重定向
      window.location.href = "/login";
    }
  };

  if (status === "loading" || (loading && status === "authenticated")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 没有会话且尚未重定向，显示加载状态
  if (!session && !redirected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 确认已经登录才渲染内容
  if (session) {
    return (
      <main className="min-h-screen flex flex-col">


        <EnterpriseStockToolboxClient 
          initialPlatforms={platforms} 
          initialServices={services}
        />
      </main>
    );
  }

  // 最后的兜底返回，应该不会执行到这里
  return null;
}

