import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, Clock3, Home } from "lucide-react";
import { CTABox } from "@/components/common/CTABox";
import { PostCard } from "@/components/blog/PostCard";
import { posts } from "@/data/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const related = posts.filter((item) => item.category === post.category && item.id !== post.id).slice(0, 3);

  return (
    <>
      <article>
        <header className="bg-primary-800 py-12 text-white sm:py-16">
          <div className="container-page max-w-4xl">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-primary-100" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Trang chủ</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/tin-tuc">Tin tức</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="line-clamp-1 text-white">{post.title}</span>
            </nav>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300">{post.category}</span>
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-primary-100">{post.excerpt}</p>
            <div className="mt-6 flex gap-5 text-xs text-primary-100">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {post.date}</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> 5 phút đọc</span>
            </div>
          </div>
        </header>
        <div className="container-page grid max-w-5xl items-start gap-8 py-14 lg:grid-cols-[1fr_260px]">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg font-medium leading-8 text-slate-700">{post.content}</p>
            <h2 id="bat-dau" className="mt-10 text-2xl font-black text-ink">Bắt đầu từ việc quan sát đúng</h2>
            <p className="mt-4 leading-8 text-slate-600">Mỗi học sinh có điểm xuất phát và nhịp tiếp thu riêng. Trước khi thay đổi lịch học hoặc tăng bài tập, gia đình nên dành thời gian nhìn lại điều trẻ đang hiểu, điều còn vướng và cảm xúc đi kèm khi học.</p>
            <h2 id="thuc-hanh" className="mt-10 text-2xl font-black text-ink">Biến mục tiêu thành hành động nhỏ</h2>
            <p className="mt-4 leading-8 text-slate-600">Một mục tiêu tốt cần cụ thể, có thể theo dõi và vừa đủ thử thách. Thay vì nói “học tốt hơn”, hãy chọn một việc có thể thực hiện trong tuần, sau đó cùng đánh giá để điều chỉnh.</p>
            <h3 className="mt-8 text-xl font-bold text-ink">Gợi ý cho gia đình</h3>
            <ul className="mt-4 space-y-3 pl-5 text-slate-600">
              <li className="list-disc">Lắng nghe phản hồi của học sinh sau mỗi buổi học.</li>
              <li className="list-disc">Theo dõi sự tiến bộ bằng kỹ năng cụ thể, không chỉ điểm số.</li>
              <li className="list-disc">Trao đổi sớm với gia sư khi có điều chưa phù hợp.</li>
            </ul>
            <h2 id="ket-luan" className="mt-10 text-2xl font-black text-ink">Kết luận</h2>
            <p className="mt-4 leading-8 text-slate-600">Sự đồng hành bền vững đến từ những điều chỉnh nhỏ nhưng đều đặn. Khi gia đình, học sinh và người dạy cùng hiểu mục tiêu, quá trình học sẽ nhẹ nhàng và hiệu quả hơn.</p>
          </div>
          <aside className="rounded-2xl border border-slate-100 bg-slate-50 p-5 lg:sticky lg:top-24">
            <h2 className="font-bold text-ink">Mục lục</h2>
            <nav className="mt-4 space-y-3 text-sm text-slate-600">
              <a href="#bat-dau" className="block hover:text-primary-600">1. Quan sát đúng</a>
              <a href="#thuc-hanh" className="block hover:text-primary-600">2. Hành động nhỏ</a>
              <a href="#ket-luan" className="block hover:text-primary-600">3. Kết luận</a>
            </nav>
            <Link href="/dang-ky-tim-gia-su" className="button-primary mt-6 w-full px-3">Tìm gia sư phù hợp</Link>
          </aside>
        </div>
      </article>
      {related.length > 0 && (
        <section className="section-space bg-slate-50/70">
          <div className="container-page">
            <h2 className="mb-7 text-2xl font-black text-ink">Bài viết liên quan</h2>
            <div className="grid gap-5 md:grid-cols-3">{related.map((item, index) => <PostCard key={item.id} post={item} index={index} />)}</div>
          </div>
        </section>
      )}
      <CTABox />
    </>
  );
}
