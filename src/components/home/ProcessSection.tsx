import { processSteps } from "@/data/site";
import { SectionTitle } from "@/components/common/SectionTitle";

export function ProcessSection() {
  return (
    <section className="section-space bg-white">
      <div className="container-page">
        <SectionTitle
          eyebrow="Quy trình đơn giản"
          title="4 bước tìm gia sư phù hợp"
          description="Từ lúc chia sẻ nhu cầu đến khi bắt đầu học, gia đình luôn có chuyên viên đồng hành."
        />
        <div className="relative grid gap-5 md:grid-cols-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-9 hidden border-t-2 border-dashed border-primary-200 md:block" />
          {processSteps.map((item, index) => (
            <article key={item.title} className="relative rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card">
              <span className="relative mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full border-8 border-white bg-primary-600 text-xl font-extrabold text-white shadow-lg shadow-primary-600/20">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
