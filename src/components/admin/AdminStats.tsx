import { GraduationCap, School, UserRoundSearch, Users } from "lucide-react";

export function AdminStats({ students, tutors, openClasses, newRequests }: { students: number; tutors: number; openClasses: number; newRequests: number }) {
  const stats = [
    { label: "Tổng học sinh", value: students, icon: Users, tone: "bg-blue-50 text-blue-600" },
    { label: "Tổng gia sư", value: tutors, icon: GraduationCap, tone: "bg-violet-50 text-violet-600" },
    { label: "Lớp chưa giao", value: openClasses, icon: School, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Yêu cầu mới", value: newRequests, icon: UserRoundSearch, tone: "bg-amber-50 text-amber-600" },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon, tone }) => <article key={label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-6 w-6" /></span><div><strong className="block text-2xl font-extrabold text-ink">{value}</strong><span className="text-xs text-slate-500">{label}</span></div></article>)}</div>;
}
