import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "서울바른내과 | 내과 전문 진료 · 건강검진",
  description: "내과 전문 진료를 중심으로 소화기 진료, 건강검진, 초음파와 만성질환 관리를 안내하는 서울바른내과 홈페이지 데모입니다.",
};

export default function DemoTwoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
