import type { Metadata } from "next";
import "./globals.css";
import "./styles.css";
import "./visit-information.css";

import "./header-brand.css";
import "./director-profile.css";
import "./clinic-refinement.css";
import "./endoscopy-refinement.css";
import "./ultrasound-refinement.css";
import "./dialysis-refinement.css";
import "./equipment-refinement.css";
import "./vaccination-refinement.css";
import "./mobile-polish.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://seoul-bareun.vercel.app"),
  title: "서울 바른내과",
  description: "서울바른내과 · 건강검진센터 · 인공신장실. 한정석 원장의 내시경 진료, 정밀 초음파, 만성질환 관리와 투석 상담을 안내합니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "서울바른내과",
    url: "/",
    title: "서울바른내과 | 건강검진센터 · 인공신장실",
    description: "충분히 듣고, 쉽게 설명합니다. 진료 안내와 오시는 길을 확인해 보세요.",
    images: [{
      url: "/images/social/seoul-bareun-share-v2.png",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "서울바른내과 · 건강검진센터 | 인공신장실",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "서울바른내과 | 건강검진센터 · 인공신장실",
    description: "충분히 듣고, 쉽게 설명합니다. 진료 안내와 오시는 길을 확인해 보세요.",
    images: ["/images/social/seoul-bareun-share-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
