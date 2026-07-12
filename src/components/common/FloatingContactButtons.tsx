"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, UserRoundSearch } from "lucide-react";
import { siteConfig } from "@/data/site";
import { useFooterVisibility } from "@/lib/useFooterVisibility";

export function FloatingContactButtons() {
  const pathname = usePathname();
  const footerVisible = useFooterVisibility();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
    <nav aria-label="Liên hệ nhanh" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-20px_rgba(15,23,42,.45)] backdrop-blur sm:hidden">
      <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex min-w-0 min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold text-primary-700"><Phone className="h-5 w-5" /> Gọi tư vấn</a>
      <a href={siteConfig.zalo} target="_blank" rel="noreferrer" className="flex min-w-0 min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold text-emerald-700"><MessageCircle className="h-5 w-5" /> Nhắn Zalo</a>
      <Link href="/dang-ky-tim-gia-su" className="flex min-w-0 min-h-16 flex-col items-center justify-center gap-1 rounded-xl bg-amber-50 text-[10px] font-bold text-accent-600"><UserRoundSearch className="h-5 w-5" /> Tìm gia sư</Link>
    </nav>
    <div className={`fixed bottom-7 right-6 z-40 hidden flex-col items-end gap-2 transition duration-200 sm:flex ${footerVisible ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}>
      <a
        href={siteConfig.zalo}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat Zalo"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <a
        href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
        aria-label="Gọi ngay"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:scale-105"
      >
        <Phone className="h-5 w-5" />
      </a>
      <Link
        href="/dang-ky-tim-gia-su"
        className="flex h-12 items-center gap-2 rounded-full bg-accent-500 px-4 text-xs font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-accent-600"
      >
        <UserRoundSearch className="h-5 w-5" />
        <span>Đăng ký tìm gia sư</span>
      </Link>
    </div>
    <div className="h-[calc(4.5rem+env(safe-area-inset-bottom))] sm:hidden" aria-hidden="true" />
    </>
  );
}
