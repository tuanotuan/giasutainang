import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ClassDetailClient } from "@/components/classes/ClassDetailClient";

export const metadata: Metadata = {
  title: "Chi tiết lớp mới",
  description: "Thông tin lớp mới cần gia sư tại Gia Sư Tài Năng.",
};

export default function ClassDetailQueryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ClassDetailClient />
    </Suspense>
  );
}

function Loading() {
  return (
    <section className="section-space bg-slate-50/70">
      <div className="container-page flex min-h-[360px] flex-col items-center justify-center text-center">
        <Loader2 className="h-9 w-9 animate-spin text-primary-600" />
        <p className="mt-3 text-sm text-slate-500">Đang tải thông tin lớp...</p>
      </div>
    </section>
  );
}
