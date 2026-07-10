"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, CalendarDays, ChevronRight, Clock3, Home, Loader2, MapPin, SearchX, UserCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { classes as initialClasses } from "@/data/classes";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ClassItem } from "@/types";
import { ReceiveClassForm } from "@/components/forms/ReceiveClassForm";
import { ClassCard } from "./ClassCard";

export function ClassDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [items, setItems] = useState<ClassItem[]>(initialClasses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/classes")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { items: ClassItem[] }) => {
        if (mounted) setItems(data.items);
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const item = useMemo(() => items.find((entry) => entry.id === id) ?? null, [id, items]);
  const related = useMemo(
    () => item ? items.filter((entry) => entry.id !== item.id && (entry.subject === item.subject || entry.area === item.area)).slice(0, 3) : [],
    [item, items],
  );

  if (loading && !item) {
    return (
      <section className="section-space bg-slate-50/70">
        <div className="container-page flex min-h-[360px] flex-col items-center justify-center text-center">
          <Loader2 className="h-9 w-9 animate-spin text-primary-600" />
          <p className="mt-3 text-sm text-slate-500">Đang tải thông tin lớp...</p>
        </div>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="section-space bg-slate-50/70">
        <div className="container-page">
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-card">
            <SearchX className="mx-auto h-12 w-12 text-slate-300" />
            <h1 className="mt-4 text-2xl font-extrabold text-ink">Không tìm thấy lớp</h1>
            <p className="mt-2 text-sm text-slate-500">Lớp có thể đã được xóa hoặc mã truy cập chưa đúng.</p>
            <Link href="/lop-moi" className="button-primary mt-6 inline-flex">Xem danh sách lớp</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-primary-800 py-12 text-white">
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-primary-100">
            <Link href="/" className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Trang chủ</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/lop-moi">Lớp mới</Link>
          </nav>
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
            {item.status === "assigned" ? "Đã giao" : "Đang tuyển"}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{item.title}</h1>
          <p className="mt-3 text-primary-100">{item.code} · Đăng ngày {formatDate(item.createdAt)}</p>
        </div>
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
            <article className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="font-bold text-ink">Ghi chú từ phụ huynh</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.note || "Trung tâm sẽ trao đổi chi tiết khi gia sư đăng ký nhận lớp."}</p>
            </article>
            <div className="rounded-2xl bg-primary-800 p-6 text-white">
              <span className="text-xs text-primary-100">Mức phí / lương mỗi buổi</span>
              <strong className="mt-1 block text-3xl text-amber-300">{formatCurrency(item.salary)}</strong>
              <p className="mt-3 text-xs text-primary-100">Mức phí được thống nhất lại trước khi nhận lớp.</p>
            </div>
          </div>
          {item.status === "assigned" ? (
            <div className="rounded-2xl bg-white p-7 text-center shadow-card">
              <UserCheck className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-4 font-bold">Lớp đã được giao</h2>
              <p className="mt-2 text-sm text-slate-500">Bạn có thể xem các lớp liên quan bên dưới.</p>
            </div>
          ) : (
            <ReceiveClassForm classCode={item.code} />
          )}
        </div>
      </section>
      {related.length > 0 && (
        <section className="section-space bg-white">
          <div className="container-page">
            <h2 className="mb-7 text-2xl font-extrabold text-ink">Lớp liên quan</h2>
            <div className="grid gap-5 md:grid-cols-3">{related.map((entry) => <ClassCard key={entry.id} item={entry} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon className="h-5 w-5" /></span>
      <div>
        <span className="text-xs text-slate-400">{label}</span>
        <strong className="mt-1 block text-sm text-slate-700">{value}</strong>
      </div>
    </div>
  );
}
