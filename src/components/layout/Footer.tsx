import Link from "next/link";
import Image from "next/image";
import { Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

const footerLinks = {
  "Dịch vụ": [
    ["Dạy kèm 1-1", "/dich-vu/day-kem-1-1-tai-nha-hoac-online"],
    ["Gia sư ngoại ngữ", "/dich-vu/gia-su-ngoai-ngu"],
    ["Gia sư năng khiếu", "/dich-vu/gia-su-nang-khieu"],
    ["Luyện thi chuyển cấp", "/dich-vu/luyen-thi-chuyen-cap"],
  ],
  "Thông tin": [
    ["Về Tài Năng", "/gioi-thieu"],
    ["Bảng học phí", "/bang-gia-gia-su"],
    ["Tin tức", "/tin-tuc"],
    ["Liên hệ", "/lien-he"],
  ],
  "Hỗ trợ": [
    ["Đăng ký tìm gia sư", "/dang-ky-tim-gia-su"],
    ["Trở thành gia sư", "/dang-ky-tro-thanh-gia-su"],
    ["Chính sách bảo mật", "/chinh-sach-bao-mat"],
    ["Điều khoản sử dụng", "/dieu-khoan-su-dung"],
  ],
};

export function Footer() {
  return (
    <footer id="footer" className="bg-[#0a2943] text-slate-300">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_2fr] lg:py-16">
        <div>
          <div className="mb-5 flex items-center gap-3 text-white">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white">
              <Image src={siteConfig.logo} alt={`Logo ${siteConfig.name}`} fill sizes="64px" className="object-cover" />
            </span>
            <div>
              <strong className="block text-lg">{siteConfig.name}</strong>
              <span className="text-xs text-primary-100">{siteConfig.tagline}</span>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            Nền tảng kết nối gia đình với đội ngũ gia sư tận tâm, đồng hành để mỗi học sinh tìm thấy cách học phù hợp.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />{siteConfig.address}</p>
            <a className="flex gap-3 transition hover:text-white" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}><Phone className="h-4 w-4 shrink-0 text-primary-400" />{siteConfig.phone}</a>
            <a className="flex gap-3 transition hover:text-white" href={`mailto:${siteConfig.email}`}><Mail className="h-4 w-4 shrink-0 text-primary-400" />{siteConfig.email}</a>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h2 className="mb-4 font-bold text-white">{title}</h2>
              <ul className="space-y-3 text-sm">
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link className="transition hover:text-white" href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 text-xs sm:flex-row">
          <p>© 2026 Gia Sư Tài Năng. Hồ sơ gia sư và lớp học hiện là dữ liệu mẫu.</p>
          <div className="flex gap-2">
            <a href={siteConfig.facebook} target="_blank" rel="noreferrer" aria-label="Facebook Gia Sư Tài Năng" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary-500"><Facebook className="h-4 w-4" /></a>
            <a href={siteConfig.zalo} target="_blank" rel="noreferrer" aria-label="Zalo Gia Sư Tài Năng" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary-500"><MessageCircle className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
