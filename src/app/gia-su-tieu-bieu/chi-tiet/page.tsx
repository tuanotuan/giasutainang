import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { TutorDetailClient } from "@/components/tutors/TutorDetailClient";

export const metadata: Metadata = {
  title: "Chi tiết gia sư",
  description: "Thông tin chuyên môn, kinh nghiệm và lịch dạy của gia sư tại Gia Sư Tài Năng.",
};

export default function TutorDetailQueryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TutorDetailClient />
    </Suspense>
  );
}

function Loading() {
  return (
    <section className="section-space bg-slate-50/70">
      <div className="container-page flex min-h-[360px] flex-col items-center justify-center text-center">
        <Loader2 className="h-9 w-9 animate-spin text-primary-600" />
        <p className="mt-3 text-sm text-slate-500">Đang tải hồ sơ gia sư...</p>
      </div>
    </section>
  );
}
