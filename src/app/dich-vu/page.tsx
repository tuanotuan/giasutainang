import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenCheck } from "lucide-react";
import { ListingHero } from "@/components/common/ListingHero";
import { CTABox } from "@/components/common/CTABox";
import { serviceContents } from "@/data/services";

export const metadata: Metadata = {
  title: "Dịch vụ gia sư",
  description: "Các dịch vụ dạy kèm 1-1, học nhóm, luyện thi, ngoại ngữ và năng khiếu tại Gia Sư Tài Năng.",
};

export default function ServicesPage() {
  return (
    <>
      <ListingHero eyebrow="Học theo nhu cầu" title="Dịch vụ gia sư" description="Chọn hình thức và chương trình phù hợp với mục tiêu, lịch học và ngân sách của gia đình." />
      <section className="section-space bg-slate-50/70">
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {serviceContents.map((service) => (
            <Link key={service.slug} href={`/dich-vu/${service.slug}`} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"><BookOpenCheck className="h-6 w-6" /></span>
              <h2 className="mt-5 text-lg font-bold text-ink">{service.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{service.summary}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-primary-600">Xem chi tiết <ArrowUpRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>
      <CTABox />
    </>
  );
}
