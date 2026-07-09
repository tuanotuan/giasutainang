import type { Metadata } from "next";
import { Info } from "lucide-react";
import { ListingHero } from "@/components/common/ListingHero";
import { PricingTable } from "@/components/pricing/PricingTable";
import { CTABox } from "@/components/common/CTABox";

export const metadata: Metadata = {
  title: "Bảng giá gia sư tham khảo",
  description: "Tham khảo học phí gia sư sinh viên, giáo viên, online và luyện thi theo cấp học.",
};

export default function PricingPage() {
  return (
    <>
      <ListingHero eyebrow="Minh bạch & dễ tham khảo" title="Bảng giá gia sư tham khảo" description="Mức phí tham khảo theo tháng, giúp gia đình dự trù ngân sách trước khi nhận tư vấn." />
      <section className="section-space bg-slate-50/70">
        <div className="container-page">
          <PricingTable />
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-slate-600">
            <h2 className="flex items-center gap-2 font-bold text-primary-800"><Info className="h-5 w-5" /> Lưu ý về học phí</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Mỗi buổi thường kéo dài khoảng 90 phút.</li>
              <li>Học phí có thể thay đổi theo môn, khu vực, số học viên và trình độ gia sư.</li>
              <li>Học phí được thanh toán trực tiếp theo thỏa thuận giữa gia đình và gia sư.</li>
            </ul>
          </div>
        </div>
      </section>
      <CTABox />
    </>
  );
}
