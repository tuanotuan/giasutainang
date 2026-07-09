import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { ListingHero } from "@/components/common/ListingHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = { title: "Liên hệ", description: "Liên hệ Gia Sư Tài Năng để được tư vấn về nhu cầu học tập và hồ sơ gia sư." };

export default function ContactPage() {
  const contacts = [
    { icon: MapPin, label: "Địa chỉ", value: siteConfig.address },
    { icon: Phone, label: "Hotline", value: siteConfig.phone },
    { icon: Mail, label: "Email", value: siteConfig.email },
    { icon: Clock3, label: "Giờ làm việc", value: siteConfig.hours },
  ];
  return (
    <>
      <ListingHero eyebrow="Luôn sẵn sàng lắng nghe" title="Liên hệ Tài Năng" description="Gửi câu hỏi hoặc chia sẻ nhu cầu, đội ngũ tư vấn sẽ phản hồi trong giờ làm việc." />
      <section className="section-space bg-slate-50/70">
        <div className="container-page grid items-start gap-7 lg:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-4">
            {contacts.map(({ icon: Icon, label, value }) => <div key={label} className="flex gap-4 rounded-2xl bg-white p-5 shadow-card"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon className="h-5 w-5" /></span><div><span className="text-xs text-slate-400">{label}</span><strong className="mt-1 block text-sm text-slate-700">{value}</strong></div></div>)}
            <div className="flex aspect-[16/8] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white text-sm font-bold text-slate-400">Khu vực văn phòng trung tâm</div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
