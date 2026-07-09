import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import type { Post } from "@/types";

const gradients = [
  "from-blue-100 to-cyan-50 text-blue-600",
  "from-emerald-100 to-teal-50 text-emerald-600",
  "from-amber-100 to-orange-50 text-amber-600",
];

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className={`flex h-44 items-center justify-center bg-gradient-to-br ${gradients[index % gradients.length]}`}>
        <BookOpen className="h-14 w-14 opacity-70 transition group-hover:scale-110" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold">
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-primary-700">{post.category}</span>
          <span className="flex items-center gap-1 text-slate-400"><CalendarDays className="h-3.5 w-3.5" />{post.date}</span>
        </div>
        <h3 className="mt-4 text-lg font-bold leading-7 text-ink transition group-hover:text-primary-600">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{post.excerpt}</p>
        <Link href={`/tin-tuc/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-primary-600">
          Đọc bài viết <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
