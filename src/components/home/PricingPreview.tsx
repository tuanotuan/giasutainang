"use client";

import Link from "next/link";
import { ArrowRight, Check, GraduationCap, Laptop, School, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { featuredPrices } from "@/data/prices";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { PriceItem } from "@/types";

const icons = [GraduationCap, School, Laptop, Target];

export function PricingPreview() {
  const [items, setItems] = useState<PriceItem[]>(featuredPrices);

  useEffect(() => {
    fetch("/api/prices")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { items?: PriceItem[] }) => data.items?.length && setItems(data.items.slice(0, 4)))
      .catch(() => undefined);
  }, []);

  return (
    <section className="section-space bg-white">
      <div className="container-page">
        <SectionTitle
          eyebrow="Học phí minh bạch"
          title="Bảng giá gia sư tham khảo"
          description="Mức phí có thể thay đổi theo môn học, số buổi, khu vực và yêu cầu chuyên môn."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[index] ?? GraduationCap;
            const price = item.studentTutorPrice || item.teacherTutorPrice;
            return (
              <article key={item.id} className={`relative rounded-2xl border p-6 ${index === 1 ? "border-primary-500 bg-primary-600 text-white shadow-xl shadow-primary-600/20" : "border-slate-100 bg-white shadow-card"}`}>
                {index === 1 && <span className="absolute -top-3 right-5 rounded-full bg-accent-500 px-3 py-1 text-[10px] font-bold uppercase text-white">Phổ biến</span>}
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 1 ? "bg-white/15" : "bg-primary-50 text-primary-600"}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{item.category}</h3>
                <p className={`mt-1 text-xs ${index === 1 ? "text-primary-100" : "text-slate-500"}`}>{item.subjectOrGrade}</p>
                <div className="my-5">
                  <strong className="text-xl">{price}</strong>
                  <span className={`block text-[10px] ${index === 1 ? "text-primary-100" : "text-slate-400"}`}>tham khảo mỗi tháng</span>
                </div>
                {[item.sessionsPerWeek, `${item.duration}/buổi`, "Tư vấn miễn phí"].map((value) => (
                  <p key={value} className={`mb-2 flex items-center gap-2 text-xs ${index === 1 ? "text-primary-50" : "text-slate-600"}`}>
                    <Check className={`h-4 w-4 ${index === 1 ? "text-amber-300" : "text-emerald-500"}`} /> {value}
                  </p>
                ))}
              </article>
            );
          })}
        </div>
        <div className="mt-9 text-center">
          <Link href="/bang-gia-gia-su" className="button-secondary">
            Xem bảng giá chi tiết <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
