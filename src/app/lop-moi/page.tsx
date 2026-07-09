import type { Metadata } from "next";
import { ListingHero } from "@/components/common/ListingHero";
import { ClassList } from "@/components/classes/ClassList";

export const metadata: Metadata = {
  title: "Lớp mới cần gia sư",
  description: "Danh sách lớp mới cần gia sư tại TP.HCM và online, có bộ lọc môn học, khu vực, lịch dạy và mức lương.",
};

export default function NewClassesPage() {
  return (
    <>
      <ListingHero
        eyebrow="Cập nhật thường xuyên"
        title="Lớp mới cần gia sư"
        description="Tìm lớp phù hợp với chuyên môn, khu vực và thời gian của bạn. Toàn bộ thông tin bên dưới là dữ liệu mô phỏng."
      />
      <ClassList />
    </>
  );
}
