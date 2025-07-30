import type { Metadata } from "next";
import "./globals.css";
import { ClientSessionWrapper } from "@/components/SessionWrapper";
import { Toaster } from "react-hot-toast";

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
      </body>
    </html>
  );
}
