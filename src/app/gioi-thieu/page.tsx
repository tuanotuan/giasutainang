import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Eye, HeartHandshake, Target, Users } from "lucide-react";
import { ListingHero } from "@/components/common/ListingHero";
import { ProcessSection } from "@/components/home/ProcessSection";
import { StatsSection } from "@/components/home/StatsSection";
import { SectionTitle } from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Tìm hiểu sứ mệnh, cam kết và quy trình sàng lọc gia sư tại Gia Sư Tài Năng.",
};

export default function AboutPage() {
  const values = [
    { icon: Target, title: "Sứ mệnh", text: "Giúp mỗi học sinh tiếp cận người dạy và cách học phù hợp với chính mình." },
    { icon: Eye, title: "Tầm nhìn", text: "Trở thành cầu nối giáo dục đáng tin cậy, rõ ràng và dễ tiếp cận cho mọi gia đình." },
    { icon: HeartHandshake, title: "Giá trị", text: "Lắng nghe chân thành, hành động có trách nhiệm và ưu tiên tiến bộ bền vững." },
  ];
  return (
    <>
      <ListingHero eyebrow="Kết nối tri thức" title="Về Gia Sư Tài Năng" description="Trung tâm kết nối người dạy, nhu cầu học tập và mục tiêu tiến bộ của mỗi gia đình." />
      <section className="section-space bg-white">
        <div className="container-page">
          <SectionTitle eyebrow="Câu chuyện Tài Năng" title="Sự phù hợp quan trọng hơn một hồ sơ thật dài" description="Chúng tôi tin rằng kết quả học tập đến từ mối quan hệ tích cực giữa người dạy, học sinh và gia đình." />
          <div className="grid gap-5 md:grid-cols-3">{values.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-slate-100 p-6 text-center shadow-card"><Icon className="mx-auto h-8 w-8 text-primary-600" /><h2 className="mt-4 text-xl font-bold text-ink">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p></article>)}</div>
        </div>
      </section>
      <StatsSection />
      <ProcessSection />
      <section className="section-space bg-primary-800 text-white">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div><span className="text-xs font-bold uppercase tracking-[.16em] text-amber-300">Quy trình kiểm duyệt</span><h2 className="mt-3 text-3xl font-extrabold">Mỗi hồ sơ đi qua nhiều lớp thông tin</h2><p className="mt-4 leading-7 text-primary-100">Thông tin học vấn, kinh nghiệm, môn dạy và khu vực được đối chiếu trước khi hồ sơ được giới thiệu.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">{["Tiếp nhận hồ sơ", "Đối chiếu thông tin", "Trao đổi chuyên môn", "Theo dõi phản hồi"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4"><BadgeCheck className="h-5 w-5 text-amber-300" /><span className="text-sm font-bold">{index + 1}. {item}</span></div>)}</div>
        </div>
      </section>
      <section className="py-16 text-center"><Users className="mx-auto h-9 w-9 text-primary-600" /><h2 className="mt-4 text-3xl font-extrabold text-ink">Sẵn sàng tìm người đồng hành?</h2><Link href="/dang-ky-tim-gia-su" className="button-primary mt-6">Đăng ký tìm gia sư <ArrowRight className="h-4 w-4" /></Link></section>
    </>
  );
}
