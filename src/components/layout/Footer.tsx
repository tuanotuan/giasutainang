import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Facebook,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "@/data/site";

const footerLinks = [
  {
    title: "Dành cho phụ huynh",
    links: [
      ["Tìm gia sư miễn phí", "/dang-ky-tim-gia-su"],
      ["Gia sư tiêu biểu", "/gia-su-tieu-bieu"],
      ["Lớp mới", "/lop-moi"],
      ["Tham khảo bảng giá", "/bang-gia-gia-su"],
    ],
  },
  {
    title: "Về Tài Năng",
    links: [
      ["Giới thiệu trung tâm", "/gioi-thieu"],
      ["Dịch vụ gia sư", "/dich-vu"],
      ["Tin tức học tập", "/tin-tuc"],
      ["Liên hệ hỗ trợ", "/lien-he"],
    ],
  },
  {
    title: "Dành cho gia sư",
    links: [
      ["Đăng ký làm gia sư", "/dang-ky-tro-thanh-gia-su"],
      ["Tìm lớp phù hợp", "/lop-moi"],
      ["Điều khoản sử dụng", "/dieu-khoan-su-dung"],
      ["Chính sách bảo mật", "/chinh-sach-bao-mat"],
    ],
  },
] as const;

const cleanPhone = siteConfig.phone.replace(/\s/g, "");

export function Footer() {
  return (
    <footer id="footer" className="overflow-hidden bg-[#071f35] text-slate-300">
      <div className="border-b border-white/10 bg-[#0b2b48]">
        <div className="container-page flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between lg:py-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-300">
              Tư vấn và kết nối hoàn toàn miễn phí
            </p>
            <h2 className="mt-2 text-xl font-bold leading-snug text-white sm:text-2xl">
              Chia sẻ nhu cầu, Tài Năng giúp bạn tìm gia sư phù hợp
            </h2>
          </div>
          <Link
            href="/dang-ky-tim-gia-su"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Đăng ký tìm gia sư <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.15fr_2fr] lg:gap-14 lg:py-14">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white shadow-lg">
              <Image src={siteConfig.logo} alt={`Logo ${siteConfig.name}`} fill sizes="64px" className="object-cover" />
            </span>
            <span>
              <strong className="block text-lg text-white">{siteConfig.name}</strong>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">{siteConfig.tagline}</span>
            </span>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Đồng hành cùng phụ huynh trong việc tìm người dạy phù hợp theo môn học, khu vực, lịch học và ngân sách của gia đình.
          </p>

          <div className="mt-6 space-y-1 text-sm">
            <a className="flex min-h-11 items-start gap-3 rounded-lg py-2 transition hover:text-white" href={`tel:${cleanPhone}`}>
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
              <span><span className="block text-xs text-slate-500">Hotline & Zalo</span><strong className="text-white">{siteConfig.phone}</strong></span>
            </a>
            <a className="flex min-h-11 items-center gap-3 rounded-lg py-2 break-all transition hover:text-white" href={`mailto:${siteConfig.email}`}>
              <Mail className="h-5 w-5 shrink-0 text-sky-400" />{siteConfig.email}
            </a>
            <p className="flex min-h-11 items-start gap-3 py-2"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />{siteConfig.address}</p>
            <p className="flex min-h-11 items-center gap-3 py-2"><Clock3 className="h-5 w-5 shrink-0 text-sky-400" />Làm việc: {siteConfig.hours}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 sm:gap-8">
          {footerLinks.map(({ title, links }) => (
            <div key={title}>
              <h2 className="mb-4 text-sm font-bold text-white">{title}</h2>
              <ul className="space-y-1 text-sm">
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link className="inline-flex min-h-10 items-center py-2 leading-5 transition hover:text-white" href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page pb-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Bảo vệ thông tin người dùng</h2>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
                Thông tin đăng ký chỉ được sử dụng để tư vấn và kết nối học tập, theo chính sách bảo mật của trung tâm.
              </p>
            </div>
          </div>
          <Link href="/chinh-sach-bao-mat" className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-sky-300 transition hover:text-white">
            Xem chính sách <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.name}. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-3">
            <span className="mr-1 text-slate-500">Kết nối với chúng tôi</span>
            <a href={siteConfig.facebook} target="_blank" rel="noreferrer" aria-label={`Facebook ${siteConfig.name}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary-500"><Facebook className="h-5 w-5" /></a>
            <a href={siteConfig.zalo} target="_blank" rel="noreferrer" aria-label={`Zalo ${siteConfig.name}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary-500"><MessageCircle className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
