import Link from "next/link";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { siteConfig } from "@/data/site";

export function CTABox() {
  return (
    <section id="tu-van" className="bg-white py-14 sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-primary-800 to-primary-600 px-6 py-12 text-center shadow-2xl shadow-primary-900/20 sm:px-12 lg:py-14">
          <div className="absolute -left-14 -top-16 h-48 w-48 rounded-full border-[30px] border-white/5" />
          <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-amber-300/10" />
          <Sparkles className="relative mx-auto mb-4 h-7 w-7 text-amber-300" />
          <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl">Chưa biết bắt đầu từ đâu?</h2>
          <p className="relative mx-auto mt-4 max-w-2xl leading-7 text-primary-100">
            Chia sẻ mục tiêu học tập, Tài Năng sẽ tư vấn lộ trình và gợi ý hồ sơ gia sư phù hợp hoàn toàn miễn phí.
          </p>
          <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dang-ky-tim-gia-su" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-600">
              Đăng ký tìm gia sư <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15">
              <Phone className="h-4 w-4" /> {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
