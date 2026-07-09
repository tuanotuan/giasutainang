import type { Metadata } from "next";
import { ListingHero } from "@/components/common/ListingHero";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Tin tức và tư vấn học tập",
  description: "Kinh nghiệm tìm gia sư, phương pháp học tập, luyện thi và hướng dẫn dành cho phụ huynh, học sinh.",
};

export default function BlogPage() {
  return (
    <>
      <ListingHero
        eyebrow="Góc chia sẻ Tài Năng"
        title="Tin tức & tư vấn học tập"
        description="Những gợi ý ngắn gọn, thực tế để gia đình và người học đưa ra lựa chọn phù hợp."
      />
      <BlogList />
    </>
  );
}
