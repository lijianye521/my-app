import type { Metadata } from "next";
import "./globals.css";
import { ClientSessionWrapper } from "@/components/SessionWrapper";
import { Toaster } from "react-hot-toast";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";
import zhCN from 'antd/locale/zh_CN';

export const metadata: Metadata = {
  title: "Stock Lab",
  description: "Enterprise Stock Toolbox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                // 基于CSS变量的颜色配置，保持与现有设计一致
                colorPrimary: '#171717', // 使用CSS变量的primary色
                colorSuccess: '#10b981', // green-500  
                colorWarning: '#f59e0b', // yellow-500
                colorError: '#e7000b', // 使用CSS变量的destructive色
                colorInfo: '#06b6d4', // cyan-500
                
                // 背景和文本
                colorBgBase: '#ffffff', // background
                colorTextBase: '#0a0a0a', // foreground
                colorBgContainer: '#ffffff', // card background
                colorBorder: '#e5e5e5', // border
                colorBorderSecondary: '#f5f5f5', // lighter border
                
                // 边框和圆角
                borderRadius: 10, // 更圆润的边角，匹配现有设计
                borderRadiusLG: 12,
                borderRadiusSM: 6,
                
                // 字体和大小
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: 14,
                fontSizeLG: 16,
                fontSizeSM: 12,
                
                // 内间距
                padding: 16,
                paddingLG: 24,
                paddingSM: 12,
                paddingXS: 8,
                
                // 阴影
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                boxShadowSecondary: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
              },
              components: {
                Button: {
                  colorPrimary: '#171717', // 主色
                  colorPrimaryHover: '#262626', // 悬停色
                  colorPrimaryActive: '#404040', // 激活色
                  colorPrimaryBorder: '#171717', // 边框色
                  borderRadius: 10,
                  paddingInline: 16,
                  paddingBlock: 8,
                  primaryShadow: 'none', // 移除阴影
                },
                Card: {
                  borderRadius: 12,
                  paddingLG: 24,
                  padding: 16, // 默认内边距
                  paddingSM: 12, // 小型卡片内边距
                  colorBorderSecondary: '#f0f0f0', // 边框色
                  boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03)', // 阴影
                },
                Input: {
                  borderRadius: 8,
                  paddingInline: 12,
                  paddingBlock: 8,
                },
                Modal: {
                  borderRadius: 12,
                },
                Tag: {
                  borderRadius: 6,
                },
                Menu: {
                  itemSelectedBg: '#f5f5f5', // 选中状态的浅灰色背景
                  itemHoverBg: '#fafafa', // 悬停状态的背景
                  itemSelectedColor: '#171717', // 选中状态的文字颜色
                  itemActiveBg: '#f5f5f5', // 点击时的背景色，与选中色保持一致
                  itemPadding: '12px 16px', // 增加菜单项内边距
                  iconMarginInlineEnd: 12, // 图标与文字的间距
                }
              },
              algorithm: theme.defaultAlgorithm,
            }}
          >
            <ClientSessionWrapper>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: '8px',
                  },
                  success: {
                    style: {
                      background: '#10B981',
                    },
                    iconTheme: {
                      primary: 'white',
                      secondary: '#10B981',
                    },
                  },
                  error: {
                    style: {
                      background: '#EF4444',
                    },
                    iconTheme: {
                      primary: 'white',
                      secondary: '#EF4444',
                    },
                  },
                }}
              />
            </ClientSessionWrapper>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
