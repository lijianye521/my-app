import "./globals.css";
import type { Metadata } from "next";
import { ClientSessionWrapper } from "@/components/SessionWrapper";

// 服务器组件的元数据
export const metadata: Metadata = {
  title: "Wind Stock Toolbox",
  description: "Wind Stock Enterprise Toolbox",
};

// 服务器组件布局
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientSessionWrapper>
          {children}
        </ClientSessionWrapper>
      </body>
    </html>
  );
}
