import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { assurances, reasons } from "@/data/site";
import { SectionTitle } from "@/components/common/SectionTitle";

export function WhyChooseUs() {
  return (
    <section className="section-space overflow-hidden bg-primary-800">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <SectionTitle
            eyebrow="An tâm lựa chọn"
            title="Vì sao gia đình chọn Tài Năng?"
            description="Không chỉ kết nối, chúng tôi còn theo sát chất lượng để việc học thực sự mang lại thay đổi."
            align="left"
            light
          />
          <div className="space-y-3">
            {assurances.map((item) => (
              <p key={item} className="flex items-center gap-3 text-sm text-white">
                <ShieldCheck className="h-5 w-5 shrink-0 text-amber-300" />
                {item}
              </p>
            ))}
          </div>
          <Link href="/dang-ky-tim-gia-su" className="mt-7 inline-flex items-center gap-2 font-bold text-amber-300 transition hover:gap-3">
            Nhận tư vấn ngay <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.11]">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-primary-100">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
