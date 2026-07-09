import type { Metadata } from "next";
import { ListingHero } from "@/components/common/ListingHero";
import { ClassCard } from "@/components/classes/ClassCard";
import { RegisterTutorForm } from "@/components/forms/RegisterTutorForm";
import { RegisterTutorSidebar } from "@/components/forms/RegistrationSidebar";
import { SectionTitle } from "@/components/common/SectionTitle";
import { classes } from "@/data/classes";

export const metadata: Metadata = {
  title: "Đăng ký trở thành gia sư",
  description: "Tạo hồ sơ gia sư, chọn lớp phù hợp với chuyên môn và chủ động lịch dạy cùng Gia Sư Tài Năng.",
};

export default function RegisterTutorPage() {
  return (
    <>
      <ListingHero
        eyebrow="Cùng lan tỏa tri thức"
        title="Đăng ký trở thành gia sư"
        description="Hoàn thiện hồ sơ để được xác minh và nhận gợi ý lớp phù hợp với chuyên môn, khu vực và thời gian của bạn."
      />
      <section className="section-space bg-slate-50/70">
        <div className="container-page grid items-start gap-7 lg:grid-cols-[1fr_340px]">
          <RegisterTutorForm />
          <RegisterTutorSidebar />
        </div>
      </section>
      <section className="section-space bg-white">
        <div className="container-page">
          <SectionTitle
            eyebrow="Lớp đang chờ"
            title="Một vài lớp mới gợi ý"
            description="Sau khi hồ sơ được xác minh, bạn có thể chọn các lớp phù hợp để đăng ký nhận."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {classes.filter((item) => item.status !== "assigned").slice(0, 3).map((item) => <ClassCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>
    </>
  );
}
