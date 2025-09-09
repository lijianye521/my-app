import type { Metadata } from "next";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
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
    <html lang="zh-CN">
      <body>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              // 基础色彩配置
              colorPrimary: '#171717',
              colorSuccess: '#10b981',
              colorWarning: '#f59e0b', 
              colorError: '#ef4444',
              colorInfo: '#06b6d4',
              
              // 背景色
              colorBgBase: '#ffffff',
              colorBgContainer: '#ffffff',
              colorBgElevated: '#ffffff',
              
              // 文本色
              colorText: '#0a0a0a',
              colorTextSecondary: '#6b7280',
              colorTextTertiary: '#9ca3af',
              
              // 边框
              colorBorder: '#e5e5e5',
              colorBorderSecondary: '#f0f0f0',
              
              // 字体
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: 14,
              fontSizeLG: 16,
              fontSizeSM: 12,
              
              // 圆角
              borderRadius: 8,
              borderRadiusLG: 12,
              borderRadiusSM: 6,
              
              // 间距
              padding: 16,
              paddingLG: 24,
              paddingSM: 12,
              paddingXS: 8,
            },
            components: {
              // Button 配置
              Button: {
                borderRadius: 8,
                controlHeight: 36,
                paddingInline: 16,
                fontWeight: 500,
              },
              
              // Card 配置
              Card: {
                borderRadius: 12,
                paddingLG: 24,
                headerBg: 'transparent',
              },
              
              // Input 配置
              Input: {
                borderRadius: 8,
                controlHeight: 36,
                paddingInline: 12,
              },
              
              // Modal 配置
              Modal: {
                borderRadius: 12,
                paddingContentHorizontal: 24,
                paddingMD: 24,
              },
              
              // Form 配置
              Form: {
                labelFontSize: 14,
                labelColor: '#374151',
                verticalLabelPadding: '0 0 8px 0',
              },
              
              // Select 配置
              Select: {
                borderRadius: 8,
                controlHeight: 36,
              },
              
              // Tag 配置
              Tag: {
                borderRadius: 6,
                fontSizeSM: 12,
              },
              
              // Menu 配置
              Menu: {
                itemSelectedBg: '#f5f5f5',
                itemHoverBg: '#fafafa',
                itemSelectedColor: '#171717',
                itemActiveBg: '#f5f5f5',
                itemPadding: '12px 16px',
                iconMarginInlineEnd: 12,
                itemHeight: 44,
              },
              
              // Table 配置
              Table: {
                borderRadius: 8,
                headerBg: '#fafafa',
                headerColor: '#374151',
                headerSortActiveBg: '#f0f0f0',
              },
            },
            algorithm: theme.defaultAlgorithm,
          }}
        >
          <AntdRegistry>
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
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}