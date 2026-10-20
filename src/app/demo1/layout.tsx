import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "서울바른내과 | Demo 1 · 레퍼런스 버전",
};

export default function DemoOneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
