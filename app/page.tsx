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

  // 获取平台和服务数据
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/platforms');
        const data = await response.json();
        
        if (data.platforms) {
          setPlatforms(data.platforms);
        }
        
        if (data.services) {
          setServices(data.services);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('获取数据失败:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 检查登录状态
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login"); // 使用replace替代push以防止回退
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  // 处理登出
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
    router.replace("/login");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    router.replace("/login");
    return null; // 等待重定向到登录页面
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* 移除了顶部标题栏，将登录信息移至右上角 */}
      <div className="flex justify-end px-6 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            欢迎, {session.user?.name || session.user?.username || "用户"}
          </span>
          <button 
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            退出登录
          </button>
        </div>
      </div>

      <EnterpriseStockToolboxClient 
        initialPlatforms={platforms} 
        initialServices={services}
      />
    </main>
  );
}

