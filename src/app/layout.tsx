import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "성남시 생활 정보 - 우리 동네 축제·행사 & 지원금 혜택",
  description:
    "공공데이터포털 기반 성남시의 최신 축제/행사 일정과 맞춤형 복지·청년·출산 지원금 혜택을 한눈에 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-amber-50/40 text-slate-800 selection:bg-amber-200 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
