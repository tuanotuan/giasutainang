import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-slate-50 py-16 text-center">
      <div className="container-page">
        <SearchX className="mx-auto h-14 w-14 text-primary-300" />
        <span className="mt-5 block text-sm font-black tracking-[.2em] text-primary-600">404</span>
        <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Trang bạn tìm không tồn tại</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-500">Liên kết có thể đã thay đổi hoặc nội dung chưa được cập nhật.</p>
        <Link href="/" className="button-primary mt-7"><ArrowLeft className="h-4 w-4" /> Về trang chủ</Link>
      </div>
    </section>
  );
}
