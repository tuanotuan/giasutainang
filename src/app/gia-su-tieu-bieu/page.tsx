import type { Metadata } from "next";
import { ListingHero } from "@/components/common/ListingHero";
import { TutorList } from "@/components/tutors/TutorList";

export const metadata: Metadata = {
  title: "Danh sách gia sư tiêu biểu",
  description: "Tìm kiếm và lựa chọn gia sư theo môn học, lớp, khu vực, trình độ và giới tính.",
};

export default function TutorsPage() {
  return (
    <>
      <ListingHero
        eyebrow="Danh sách tham khảo"
        title="Danh sách gia sư tiêu biểu"
        description="Tìm gia sư phù hợp theo môn học, cấp lớp, khu vực và định hướng học tập của gia đình."
      />
      <TutorList />
    </>
  );
}
