"use client";

import { Search, SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { posts as initialPosts } from "@/data/posts";
import type { Post } from "@/types";
import { Pagination } from "@/components/common/Pagination";
import { PostCard } from "./PostCard";

const PAGE_SIZE = 6;

export function BlogList() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [category, setCategory] = useState("Tất cả");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    fetch("/api/posts")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { items: Post[] }) => setPosts(data.items))
      .catch(() => undefined);
  }, []);
  const categories = ["Tất cả", ...Array.from(new Set(posts.map((post) => post.category)))];
  const filtered = useMemo(() => {
    const query = keyword.toLocaleLowerCase("vi");
    return posts.filter(
      (post) =>
        (category === "Tất cả" || post.category === category) &&
        (!query || `${post.title} ${post.excerpt}`.toLocaleLowerCase("vi").includes(query)),
    );
  }, [category, keyword, posts]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateCategory = (next: string) => {
    setCategory(next);
    setPage(1);
  };

  return (
    <section className="section-space bg-slate-50/70">
      <div className="container-page">
        <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => { setKeyword(event.target.value); setPage(1); }}
              className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              placeholder="Tìm bài viết..."
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updateCategory(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${category === item ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <p className="mb-5 text-sm text-slate-500">Có <strong className="text-ink">{filtered.length}</strong> bài viết</p>
        {visible.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((post, index) => <PostCard key={post.id} post={post} index={index} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
            <SearchX className="mx-auto h-11 w-11 text-slate-300" />
            <h2 className="mt-4 text-lg font-bold text-ink">Chưa tìm thấy bài viết</h2>
            <p className="mt-2 text-sm text-slate-500">Thử từ khóa khác hoặc chọn lại danh mục.</p>
          </div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  );
}
