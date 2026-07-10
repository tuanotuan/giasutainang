import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopContactBar } from "@/components/layout/TopContactBar";
import { FloatingContactButtons } from "@/components/common/FloatingContactButtons";
import { ConsultingChat } from "@/components/common/ConsultingChat";
import { siteConfig } from "@/data/site";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: [{ url: `${siteConfig.logo}?v=2`, type: "image/jpeg" }],
    shortcut: [`${siteConfig.logo}?v=2`],
    apple: [{ url: `${siteConfig.logo}?v=2`, type: "image/jpeg" }],
  },
  title: {
    default: "Gia Sư Tài Năng | Dạy kèm tại nhà và online",
    template: "%s | Gia Sư Tài Năng",
  },
  description:
    "Kết nối phụ huynh với gia sư phù hợp theo môn học, khu vực, trình độ và ngân sách.",
  keywords: ["gia sư", "gia sư tại nhà", "gia sư online", "tìm gia sư", "dạy kèm"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Gia Sư Tài Năng",
    title: "Gia Sư Tài Năng | Dạy kèm tại nhà và online",
    description: "Kết nối phụ huynh với gia sư phù hợp theo nhu cầu học tập.",
    images: [{ url: siteConfig.logo, width: 1600, height: 1600, alt: `Logo ${siteConfig.name}` }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={beVietnamPro.variable} data-site-version="2026-07-smart-tools">
        <a href="#noi-dung-chinh" className="fixed left-4 top-3 z-[110] -translate-y-20 rounded-lg bg-primary-800 px-4 py-2 text-sm font-bold text-white transition focus:translate-y-0">
          Chuyển đến nội dung chính
        </a>
        <TopContactBar />
        <Header />
        <main id="noi-dung-chinh">{children}</main>
        <Footer />
        <FloatingContactButtons />
        <ConsultingChat />
      </body>
    </html>
  );
}
