import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/site";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/common/SectionTitle";

const tones: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
  orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-500",
  green: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
  violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600",
  rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-600",
  cyan: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600",
};

export function ServiceGrid() {
  return (
    <section className="section-space bg-slate-50/70">
      <div className="container-page">
        <SectionTitle
          eyebrow="Dịch vụ nổi bật"
          title="Học theo nhu cầu, tiến bộ theo mục tiêu"
          description="Các chương trình linh hoạt cho từng độ tuổi, nền tảng kiến thức và mục tiêu học tập."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, description, icon: Icon, tone }) => (
            <Link href="/dich-vu" key={title} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-start justify-between">
                <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:text-white", tones[tone])}>
                  <Icon className="h-7 w-7" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary-600" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
