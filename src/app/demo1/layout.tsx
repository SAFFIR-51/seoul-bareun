import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "서울 바른내과 데모버전",
};

export default function DemoOneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
