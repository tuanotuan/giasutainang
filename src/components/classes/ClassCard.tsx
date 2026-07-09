import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import type { ClassItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

const statusMap = {
  open: { label: "Đang tuyển", className: "bg-emerald-50 text-emerald-600" },
  discount: { label: "Ưu tiên", className: "bg-amber-50 text-amber-600" },
  assigned: { label: "Đã giao", className: "bg-slate-100 text-slate-500" },
};

export function ClassCard({ item }: { item: ClassItem }) {
  const status = statusMap[item.status];
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-primary-100 hover:shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-primary-700">{item.code}</span>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}>{status.label}</span>
      </div>
      <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-6 text-ink">{item.title}</h3>
      <div className="mt-4 grid gap-2 text-xs text-slate-500">
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-500" />{item.area} · {item.learningMode}</p>
        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary-500" />{item.sessionsPerWeek} buổi/tuần · {item.schedule}</p>
        <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary-500" />{item.duration}/buổi</p>
        <p className="flex items-center gap-2"><Users className="h-4 w-4 text-primary-500" />{item.studentCount} học viên · Học lực {item.studentLevel}</p>
      </div>
      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="mb-4"><span className="block text-[10px] text-slate-400">Mức phí/buổi</span><strong className="text-sm text-accent-600">{formatCurrency(item.salary)}</strong></div>
        <div className="grid grid-cols-2 gap-2">
          <Link href={`/lop-moi/${item.id}`} className="flex h-10 items-center justify-center rounded-xl border border-primary-200 text-xs font-bold text-primary-700 transition hover:bg-primary-50">
            Xem chi tiết
          </Link>
          <Link href={`/lop-moi/${item.id}#nhan-lop`} className={`flex h-10 items-center justify-center rounded-xl text-xs font-bold transition ${item.status === "assigned" ? "pointer-events-none bg-slate-100 text-slate-400" : "bg-primary-600 text-white hover:bg-primary-700"}`}>
            {item.status === "assigned" ? "Đã giao" : "Nhận lớp"}
          </Link>
        </div>
      </div>
    </article>
  );
}
