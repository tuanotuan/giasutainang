import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BookOpen, CalendarDays, ChevronRight, Clock3, GraduationCap, Home, MapPin, UserRound } from "lucide-react";
import { tutors } from "@/data/tutors";
import { TutorCard, TutorStatusBadge } from "@/components/tutors/TutorCard";

interface PageProps { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return tutors.map((tutor) => ({ id: tutor.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tutor = tutors.find((item) => item.id === id);
  return tutor ? { title: `Gia sư ${tutor.name}`, description: `${tutor.level} ${tutor.major}, nhận dạy ${tutor.subjects.join(", ")}.` } : {};
}

export default async function TutorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const tutor = tutors.find((item) => item.id === id);
  if (!tutor) notFound();
  const initials = tutor.name.split(" ").slice(-2).map((word) => word[0]).join("");
  const related = tutors.filter((item) => item.id !== tutor.id && item.subjects.some((subject) => tutor.subjects.includes(subject))).slice(0, 4);

  return (
    <>
      <section className="bg-primary-800 py-10 text-white">
        <div className="container-page">
          <nav className="mb-7 flex items-center gap-2 text-xs text-primary-100" aria-label="Breadcrumb"><Link href="/" className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Trang chủ</Link><ChevronRight className="h-3.5 w-3.5" /><Link href="/gia-su-tieu-bieu">Gia sư</Link></nav>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <span className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl border-4 border-white/20 bg-primary-600 text-3xl font-extrabold">{initials}</span>
            <div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300">{tutor.code}</span>
              <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{tutor.name}</h1>
              <p className="mt-2 text-primary-100">{tutor.level} · {tutor.major}</p>
              <div className="mt-3"><TutorStatusBadge tutor={tutor} /></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-space bg-slate-50/70">
        <div className="container-page grid items-start gap-7 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-card sm:grid-cols-2">
              <Info icon={UserRound} label="Năm sinh / giới tính" value={`${tutor.birthYear} · ${tutor.gender}`} />
              <Info icon={GraduationCap} label="Trường / đơn vị" value={tutor.school} />
              <Info icon={BookOpen} label="Môn dạy" value={tutor.subjects.join(", ")} />
              <Info icon={Award} label="Lớp dạy" value={tutor.grades.join(", ")} />
              <Info icon={MapPin} label="Khu vực" value={tutor.areas.join(", ")} />
              <Info icon={Clock3} label="Thời gian rảnh" value={tutor.availableTimes.join(", ")} />
            </div>
            {[
              ["Kinh nghiệm giảng dạy", tutor.experience],
              ["Thành tích", tutor.achievements.join(". ")],
              ["Phong cách giảng dạy", tutor.teachingStyle],
            ].map(([title, content]) => <article key={title} className="rounded-2xl bg-white p-6 shadow-card"><h2 className="text-lg font-bold text-ink">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{content}</p></article>)}
          </div>
          <aside className="rounded-2xl bg-white p-6 shadow-card lg:sticky lg:top-24">
            <span className="text-xs text-slate-500">Học phí tham khảo</span>
            <strong className="mt-1 block text-2xl text-accent-600">{tutor.expectedSalary}</strong>
            <p className="mt-4 text-xs leading-5 text-slate-500">Mức phí được thống nhất theo môn học, lịch học và hình thức dạy.</p>
            <Link href={`/dang-ky-tim-gia-su?tutor=${tutor.code}`} className="button-primary mt-5 w-full">Yêu cầu gia sư này</Link>
            <Link href="/dang-ky-tim-gia-su" className="button-secondary mt-3 w-full">Đăng ký tư vấn</Link>
          </aside>
        </div>
      </section>
      <section className="section-space bg-white">
        <div className="container-page"><h2 className="mb-7 text-2xl font-extrabold text-ink">Gia sư liên quan</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <TutorCard key={item.id} tutor={item} />)}</div></div>
      </section>
    </>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon className="h-5 w-5" /></span><div><span className="block text-xs text-slate-400">{label}</span><strong className="mt-1 block text-sm text-slate-700">{value}</strong></div></div>;
}
