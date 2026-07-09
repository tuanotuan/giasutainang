"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { posts as initialPosts } from "@/data/posts";
import type { Post } from "@/types";
import { PostCard } from "@/components/blog/PostCard";
import { SectionTitle } from "@/components/common/SectionTitle";

export function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  useEffect(() => {
    fetch("/api/posts")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { items: Post[] }) => setPosts(data.items))
      .catch(() => undefined);
  }, []);
  return (
    <section className="section-space bg-slate-50/70">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <SectionTitle eyebrow="Góc đồng hành" title="Tin tức & tư vấn mới" description="Kiến thức thiết thực cho phụ huynh, học sinh và gia sư." align="left" />
          <Link href="/tin-tuc" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-primary-600">
            Xem tất cả bài viết <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => <PostCard key={post.id} post={post} index={index} />)}
        </div>
      </div>
    </section>
  );
}
