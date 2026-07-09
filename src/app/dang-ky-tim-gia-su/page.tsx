import type { Metadata } from "next";
import { ListingHero } from "@/components/common/ListingHero";
import { FindTutorForm } from "@/components/forms/FindTutorForm";
import { FindTutorSidebar } from "@/components/forms/RegistrationSidebar";

export const metadata: Metadata = {
  title: "Đăng ký tìm gia sư",
  description: "Gửi nhu cầu tìm gia sư tại nhà hoặc online và nhận tư vấn miễn phí từ Gia Sư Tài Năng.",
};

export default function FindTutorPage() {
  return (
    <>
      <ListingHero
        eyebrow="Tư vấn hoàn toàn miễn phí"
        title="Đăng ký tìm gia sư"
        description="Điền thông tin nhu cầu học tập, Tài Năng sẽ liên hệ để tư vấn và gợi ý hồ sơ phù hợp."
      />
      <section className="section-space bg-slate-50/70">
        <div className="container-page grid items-start gap-7 lg:grid-cols-[1fr_340px]">
          <FindTutorForm />
          <FindTutorSidebar />
        </div>
      </section>
    </>
  );
}
