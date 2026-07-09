import Link from "next/link";
import { ArrowRight, CheckCircle2, Quote } from "lucide-react";
import { learningGroups } from "@/data/site";
import { SectionTitle } from "@/components/common/SectionTitle";

export function IntroSection() {
  return (
    <section className="section-space bg-slate-50/70">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative mx-auto w-full max-w-[480px]">
          <div className="aspect-[4/4.3] rounded-[32px] bg-gradient-to-br from-primary-100 to-primary-50 p-6">
            <div className="flex h-full flex-col justify-between overflow-hidden rounded-[26px] bg-primary-700 p-8 text-white">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Quote className="h-7 w-7 text-amber-300" />
              </span>
              <blockquote className="text-2xl font-bold leading-relaxed sm:text-3xl">
                “Khi được thấu hiểu, mỗi học sinh đều có thể tiến bộ theo cách riêng.”
              </blockquote>
              <div className="border-t border-white/15 pt-5">
                <strong className="block">Đội ngũ Tài Năng</strong>
                <span className="text-sm text-primary-100">Luôn lắng nghe và đồng hành</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-2 rounded-2xl bg-white p-4 shadow-soft sm:-right-7">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-9 w-9 text-emerald-500" />
              <div><strong className="block text-xl">98%</strong><span className="text-xs text-slate-500">Phản hồi tích cực</span></div>
            </div>
          </div>
        </div>

        <div>
          <SectionTitle
            eyebrow="Về Gia Sư Tài Năng"
            title="Đồng hành đúng cách, tiến bộ bền vững"
            description="Chúng tôi lắng nghe nhu cầu của từng gia đình, sàng lọc hồ sơ và gợi ý người dạy phù hợp về kiến thức, phong cách lẫn lịch học."
            align="left"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {learningGroups.map(({ title, icon: Icon }) => (
              <div key={title} className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary-100">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-slate-700">{title}</span>
              </div>
            ))}
          </div>
          <Link href="/gioi-thieu" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary-600 transition hover:gap-3">
            Tìm hiểu thêm về Tài Năng <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
