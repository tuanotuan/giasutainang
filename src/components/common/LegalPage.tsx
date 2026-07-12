import { ListingHero } from "./ListingHero";

export function LegalPage({ title, description, sections }: { title: string; description: string; sections: { title: string; content: string }[] }) {
  return (
    <>
      <ListingHero eyebrow="Thông tin minh bạch" title={title} description={description} />
      <article className="section-space bg-white">
        <div className="container-page max-w-3xl">
          <p className="rounded-2xl bg-amber-50 p-5 text-sm leading-7 text-amber-900">Nội dung dưới đây dùng để minh bạch quy trình tiếp nhận thông tin trên website, không thay thế tư vấn pháp lý chuyên môn.</p>
          <div className="mt-8 space-y-9">
            {sections.map((section, index) => <section key={section.title}><h2 className="text-xl font-extrabold text-ink">{index + 1}. {section.title}</h2><p className="mt-3 leading-8 text-slate-600">{section.content}</p></section>)}
          </div>
          <p className="mt-10 border-t border-slate-100 pt-5 text-xs text-slate-400">Cập nhật lần cuối: 12/07/2026.</p>
        </div>
      </article>
    </>
  );
}
