import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { navigation, siteConfig } from "@/data/site";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-[76px] sm:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${siteConfig.name} - Trang chủ`}>
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-primary-100 bg-white shadow-lg shadow-primary-600/20 sm:h-12 sm:w-12 sm:rounded-2xl">
            <Image src={siteConfig.logo} alt="" fill sizes="48px" priority className="scale-[1.35] object-cover object-[50%_35%]" />
          </span>
          <span>
            <strong className="block text-[15px] leading-tight text-primary-800 min-[375px]:text-base sm:text-lg">{siteConfig.name}</strong>
            <small className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:block">
              {siteConfig.tagline}
            </small>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 py-7 text-[13px] font-semibold text-slate-700 transition hover:text-primary-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex xl:hidden">
          <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="button-primary min-h-11 px-4 py-2">
            <Phone className="h-4 w-4" />
            Gọi tư vấn
          </a>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
