import type { Metadata, Viewport } from "next";
import { themeScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlanForMe",
  description: "총분량과 마감일만 입력하면 하루 할당량을 자동 계산해 주는 스마트 플래너",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F7F4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="mx-auto w-full max-w-[440px] min-h-full flex-1">{children}</div>
      </body>
    </html>
  );
}
