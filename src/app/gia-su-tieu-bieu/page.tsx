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
        eyebrow="Hồ sơ được sàng lọc"
        title="Danh sách gia sư tiêu biểu"
        description="Khám phá đội ngũ gia sư đa dạng và dùng bộ lọc để tìm hồ sơ phù hợp với nhu cầu học tập."
      />
      <TutorList />
    </>
  );
}
