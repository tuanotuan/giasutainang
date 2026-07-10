import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { PostDetailClient } from "@/components/blog/PostDetailClient";

export const metadata: Metadata = {
  title: "Bài viết tư vấn",
  description: "Bài viết và kinh nghiệm học tập từ Gia Sư Tài Năng.",
};

export default function PostDetailQueryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PostDetailClient />
    </Suspense>
  );
}

function Loading() {
  return <section className="section-space bg-slate-50/70"><div className="container-page flex min-h-[360px] flex-col items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-primary-600" /><p className="mt-3 text-sm text-slate-500">Đang tải bài viết...</p></div></section>;
}
