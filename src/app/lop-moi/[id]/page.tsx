import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CalendarDays, ChevronRight, Clock3, Home, MapPin, UserCheck, Users } from "lucide-react";
import { classes } from "@/data/classes";
import { formatCurrency } from "@/lib/utils";
import { ReceiveClassForm } from "@/components/forms/ReceiveClassForm";
import { ClassCard } from "@/components/classes/ClassCard";

interface PageProps { params: Promise<{ id: string }> }
export function generateStaticParams() { return classes.map((item) => ({ id: item.id })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = classes.find((entry) => entry.id === id);
  return item ? { title: `${item.code} - ${item.title}`, description: `Lớp ${item.subject} tại ${item.area}, ${item.sessionsPerWeek} buổi mỗi tuần.` } : {};
}

export default async function ClassDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = classes.find((entry) => entry.id === id);
  if (!item) notFound();
  const related = classes.filter((entry) => entry.id !== item.id && (entry.subject === item.subject || entry.area === item.area)).slice(0, 3);
  return (
    <>
      <section className="bg-primary-800 py-12 text-white">
        <div className="container-page"><nav className="mb-6 flex items-center gap-2 text-xs text-primary-100"><Link href="/" className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Trang chủ</Link><ChevronRight className="h-3.5 w-3.5" /><Link href="/lop-moi">Lớp mới</Link></nav><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">{item.status === "assigned" ? "Đã giao" : "Đang tuyển"}</span><h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{item.title}</h1><p className="mt-3 text-primary-100">{item.code} · Đăng ngày {item.createdAt}</p></div>
      </section>
      <section className="section-space bg-slate-50/70">
        <div className="container-page grid items-start gap-7 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-card sm:grid-cols-2">
              <Detail icon={BookOpen} label="Môn / lớp" value={`${item.subject} · ${item.grade}`} />
              <Detail icon={Users} label="Học viên / học lực" value={`${item.studentCount} học viên · ${item.studentLevel}`} />
              <Detail icon={MapPin} label="Khu vực" value={`${item.address}, ${item.area}`} />
              <Detail icon={CalendarDays} label="Lịch học" value={`${item.sessionsPerWeek} buổi/tuần · ${item.schedule}`} />
              <Detail icon={Clock3} label="Thời lượng" value={`${item.duration}/buổi`} />
              <Detail icon={UserCheck} label="Yêu cầu gia sư" value={item.tutorRequirement} />
            </div>
            <article className="rounded-2xl bg-white p-6 shadow-card"><h2 className="font-bold text-ink">Ghi chú từ phụ huynh</h2><p className="mt-3 text-sm leading-7 text-slate-600">{item.note}</p></article>
            <div className="rounded-2xl bg-primary-800 p-6 text-white"><span className="text-xs text-primary-100">Mức phí / lương mỗi buổi</span><strong className="mt-1 block text-3xl text-amber-300">{formatCurrency(item.salary)}</strong><p className="mt-3 text-xs text-primary-100">Mức phí mô phỏng, được thống nhất lại trước khi nhận lớp.</p></div>
          </div>
          {item.status === "assigned" ? <div className="rounded-2xl bg-white p-7 text-center shadow-card"><UserCheck className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 font-bold">Lớp đã được giao</h2><p className="mt-2 text-sm text-slate-500">Bạn có thể xem các lớp liên quan bên dưới.</p></div> : <ReceiveClassForm classCode={item.code} />}
        </div>
      </section>
      <section className="section-space bg-white"><div className="container-page"><h2 className="mb-7 text-2xl font-extrabold text-ink">Lớp liên quan</h2><div className="grid gap-5 md:grid-cols-3">{related.map((entry) => <ClassCard key={entry.id} item={entry} />)}</div></div></section>
    </>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon className="h-5 w-5" /></span><div><span className="text-xs text-slate-400">{label}</span><strong className="mt-1 block text-sm text-slate-700">{value}</strong></div></div>;
}
