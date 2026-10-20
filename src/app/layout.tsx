import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "서울바른내과 | 당신의 건강에, 바른 기준을 더하다",
  description: "서울바른내과 메인 페이지 데모. 건강검진, 소화기내시경, 초음파와 일상 속 건강관리를 위한 진료 안내를 만나보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
