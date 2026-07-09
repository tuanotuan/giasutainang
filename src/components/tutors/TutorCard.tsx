import Link from "next/link";
import { BookOpen, GraduationCap, MapPin, Star } from "lucide-react";
import type { Tutor } from "@/types";

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const initials = tutor.name.split(" ").slice(-2).map((word) => word[0]).join("");

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative flex h-32 items-end bg-gradient-to-br from-primary-100 via-primary-50 to-amber-50 p-5">
        <span className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-primary-700 shadow-sm">
          {tutor.code}
        </span>
        <div className="flex h-20 w-20 translate-y-8 items-center justify-center rounded-2xl border-4 border-white bg-primary-600 text-xl font-extrabold text-white shadow-lg">
          {initials}
        </div>
      </div>
      <div className="p-5 pt-11">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-ink">{tutor.name}</h3>
            <p className="mt-1 text-xs font-semibold text-primary-600">{tutor.level} · {tutor.birthYear}</p>
          </div>
          <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">
            <Star className="h-3.5 w-3.5 fill-current" /> {tutor.rating}
          </span>
        </div>
        <div className="mt-4 space-y-2 text-xs leading-5 text-slate-500">
          <p className="flex gap-2"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />{tutor.school} · {tutor.major}</p>
          <p className="flex gap-2"><BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />{tutor.subjects.join(", ")} · {tutor.grades.join(", ")}</p>
          <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />{tutor.areas.join(", ")}</p>
        </div>
        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
          <Link href={`/gia-su-tieu-bieu/${tutor.id}`} className="flex h-10 flex-1 items-center justify-center rounded-xl border border-primary-200 text-xs font-bold text-primary-700 transition hover:bg-primary-50">
            Xem hồ sơ
          </Link>
          <Link href={`/dang-ky-tim-gia-su?tutor=${tutor.code}`} className="flex h-10 flex-1 items-center justify-center rounded-xl bg-primary-600 text-xs font-bold text-white transition hover:bg-primary-700">
            Chọn gia sư
          </Link>
        </div>
      </div>
    </article>
  );
}
