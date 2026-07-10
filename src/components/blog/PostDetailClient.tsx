"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, ChevronRight, Clock3, Home, Loader2, SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { posts as initialPosts } from "@/data/posts";
import type { Post } from "@/types";
import { CTABox } from "@/components/common/CTABox";
import { PostCard } from "./PostCard";

export function PostDetailClient() {
  const slug = useSearchParams().get("slug") ?? "";
  const [items, setItems] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/posts")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { items: Post[] }) => { if (mounted) setItems(data.items); })
      .catch(() => undefined)
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const post = useMemo(() => items.find((item) => item.slug === slug) ?? null, [items, slug]);
  const related = useMemo(() => post ? items.filter((item) => item.id !== post.id && item.category === post.category).slice(0, 3) : [], [items, post]);

  if (loading && !post) return <Loading />;
  if (!post) return <NotFound />;

  return (
    <>
      <article>
        <header className="bg-primary-800 py-12 text-white sm:py-16">
          <div className="container-page max-w-4xl">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-primary-100" aria-label="Đường dẫn trang">
              <Link href="/" className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Trang chủ</Link>
              <ChevronRight className="h-3.5 w-3.5" /><Link href="/tin-tuc">Tin tức</Link>
            </nav>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300">{post.category}</span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-primary-100">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-xs text-primary-100">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {post.date}</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> Khoảng 5 phút đọc</span>
            </div>
          </div>
        </header>
        <div className="container-page grid max-w-5xl items-start gap-8 py-14 lg:grid-cols-[1fr_260px]">
          <div className="max-w-none">
            <p className="whitespace-pre-line text-lg font-medium leading-8 text-slate-700">{post.content}</p>
            <h2 className="mt-10 text-2xl font-extrabold text-ink">Gợi ý áp dụng</h2>
            <p className="mt-4 leading-8 text-slate-600">Hãy bắt đầu bằng mục tiêu nhỏ, theo dõi sự tiến bộ theo từng tuần và trao đổi sớm với gia sư khi có điều chưa phù hợp. Một kế hoạch vừa sức và đều đặn thường hiệu quả hơn việc học dồn.</p>
          </div>
          <aside className="rounded-2xl border border-slate-100 bg-slate-50 p-5 lg:sticky lg:top-24">
            <h2 className="font-bold text-ink">Bạn cần hỗ trợ?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Gửi nhu cầu để trung tâm tư vấn gia sư theo môn học, lịch học và ngân sách.</p>
            <Link href="/dang-ky-tim-gia-su" className="button-primary mt-5 w-full px-3">Tìm gia sư phù hợp</Link>
          </aside>
        </div>
      </article>
      {related.length > 0 && <section className="section-space bg-slate-50/70"><div className="container-page"><h2 className="mb-7 text-2xl font-extrabold text-ink">Bài viết liên quan</h2><div className="grid gap-5 md:grid-cols-3">{related.map((item, index) => <PostCard key={item.id} post={item} index={index} />)}</div></div></section>}
      <CTABox />
    </>
  );
}

function Loading() {
  return <section className="section-space bg-slate-50/70"><div className="container-page flex min-h-[360px] flex-col items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-primary-600" /><p className="mt-3 text-sm text-slate-500">Đang tải bài viết...</p></div></section>;
}

function NotFound() {
  return <section className="section-space bg-slate-50/70"><div className="container-page"><div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-card"><SearchX className="mx-auto h-12 w-12 text-slate-300" /><h1 className="mt-4 text-2xl font-extrabold text-ink">Không tìm thấy bài viết</h1><p className="mt-2 text-sm text-slate-500">Bài viết có thể đã được cập nhật hoặc ngừng hiển thị.</p><Link href="/tin-tuc" className="button-primary mt-6">Xem tất cả bài viết</Link></div></div></section>;
}
