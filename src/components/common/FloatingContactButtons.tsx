import Link from "next/link";
import { MessageCircle, Phone, UserRoundSearch } from "lucide-react";
import { siteConfig } from "@/data/site";

export function FloatingContactButtons() {
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-7 sm:right-6">
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
        <span className="hidden sm:inline">Đăng ký tìm gia sư</span>
      </Link>
    </div>
  );
}
