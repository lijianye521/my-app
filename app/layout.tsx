import type { Metadata } from "next";
import "./globals.css";
import { ClientSessionWrapper } from "@/components/SessionWrapper";
import { Toaster } from "react-hot-toast";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";
import zhCN from 'antd/locale/zh_CN';
import ConsoleFilter from "@/components/ConsoleFilter";

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
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          /* 全局图标大小调整 - 比默认大一些 */
          .anticon {
            font-size: 18px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
          
          /* 按钮中的图标 */
          .ant-btn .anticon {
            font-size: 18px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
          
          /* 菜单中的图标 */
          .ant-menu .anticon {
            font-size: 20px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
          
          /* 表格中的图标 */
          .ant-table .anticon {
            font-size: 18px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
          
          /* 卡片标题中的图标 */
          .ant-card-head .anticon {
            font-size: 20px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
          
          /* 表单中的图标 */
          .ant-form .anticon {
            font-size: 18px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
          
          /* 图标选择器中的图标 */
          .ant-modal .anticon {
            font-size: 20px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
          
          /* 卡片内容区域的图标居中 - 保持默认颜色 */
          .ant-card-body .anticon {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: auto !important;
          }
          
          /* 平台/服务卡片中的图标容器 - 保持默认颜色 */
          .ant-card .anticon {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          /* 只有渐变背景容器中的图标才是白色 */
          div[style*="linear-gradient(135deg"] .anticon {
            color: white !important;
          }
          
          /* 特定的圆形图标容器（48x48像素的渐变背景） */
          div[style*="width: 48"][style*="height: 48"][style*="linear-gradient"] .anticon {
            color: white !important;
          }
          
          /* Tailwind样式覆盖 - 确保Ant Design图标继承text-white类 */
          .text-white .anticon,
          .anticon.text-white {
            color: white !important;
          }
          
          /* 表单对话框中图标预览区域的白色图标 */
          .ant-modal .ant-form-item div[style*="backgroundColor"][style*="display: flex"] svg,
          .ant-modal .ant-form-item div[style*="backgroundColor"][style*="alignItems: center"] svg {
            color: white !important;
            fill: white !important;
          }
          
          /* 表单中预览区域背景色容器内的图标 */
          div[style*="backgroundColor"][style*="borderRadius"][style*="display: flex"] svg {
            color: white !important;
            fill: white !important;
          }
          
          /* 大号图标（特殊场景） */
          .anticon-lg {
            font-size: 24px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
          
          /* 超大图标（特殊场景） */
          .anticon-xl {
            font-size: 28px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
          
          /* 小号图标（特殊场景） */
          .anticon-sm {
            font-size: 16px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
          }
        `}} />
      </head>
      <body>
        <ConsoleFilter />
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
                
                // 图标大小配置（通过字体大小控制）
                sizeUnit: 4, // 基础尺寸单位
                sizeStep: 4, // 尺寸步长
                
                // 阴影
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                boxShadowSecondary: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
              },
              components: {
                Button: {
                  borderRadius: 8,
                  paddingInline: 16,
                  paddingBlock: 8,
                },
                Card: {
                  borderRadius: 12,
                  paddingLG: 24,
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
                },
                Table: {
                  fontSize: 14,
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
