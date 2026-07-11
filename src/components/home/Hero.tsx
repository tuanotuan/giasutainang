import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Gift,
  MapPin,
  Play,
  Search,
  Star,
  Users,
} from "lucide-react";
import { areas, grades, subjects } from "@/data/site";

const selectClass =
  "h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-amber-50/70">
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary-100/60 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />
      <div className="container-page relative grid items-center gap-8 py-10 sm:min-h-[640px] sm:gap-12 sm:py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div>
          <span className="eyebrow">
            <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
            Kết nối đúng người · Học đúng cách
          </span>
          <h1 className="max-w-3xl break-words text-[32px] font-extrabold leading-[1.15] tracking-tight text-ink min-[390px]:text-[34px] sm:text-5xl lg:text-[56px]">
            Tìm gia sư dạy kèm{" "}
            <span className="relative text-primary-600">
              tại nhà & online
              <svg className="absolute -bottom-2 left-0 hidden h-3 w-full text-accent-400 sm:block" viewBox="0 0 320 12" fill="none" aria-hidden="true">
                <path d="M3 8.5C74 1.5 216 1 317 5.5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>{" "}
            nhanh chóng
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8">
            Kết nối phụ huynh với gia sư phù hợp theo môn học, khu vực, trình độ và ngân sách.
          </p>
          <div className="mt-5 flex max-w-xl items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 shadow-sm sm:px-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Gift className="h-5 w-5" />
            </span>
            <p className="text-sm leading-5">
              <strong className="block text-base font-extrabold uppercase tracking-wide text-emerald-700 sm:text-lg">Miễn phí tư vấn & kết nối</strong>
              Phụ huynh không trả phí giới thiệu gia sư.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link href="/dang-ky-tim-gia-su" className="button-primary">
              Tìm gia sư miễn phí
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/gia-su-tieu-bieu" className="button-secondary">
              <Play className="h-4 w-4 fill-primary-100" />
              Xem gia sư tiêu biểu
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
            {["Không phí kết nối", "Hồ sơ minh bạch", "Hỗ trợ xuyên suốt"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-[500px] sm:block">
          <div className="absolute -left-8 top-16 h-24 w-24 rounded-full border-[18px] border-primary-100/80" />
          <div className="relative overflow-hidden rounded-[32px] bg-primary-800 p-6 shadow-2xl shadow-primary-900/20 sm:p-8">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-bl-full bg-primary-700" />
            <div className="relative">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Học tập hứng khởi</span>
                  <p className="mt-2 max-w-[270px] text-2xl font-bold leading-snug text-white">
                    Mỗi buổi học là một bước tiến mới
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <BookOpenCheck className="h-6 w-6" />
                </span>
              </div>

              <div className="grid h-56 grid-cols-2 gap-3 sm:h-64">
                <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-amber-300 to-accent-500 p-5 text-primary-900">
                  <div className="flex -space-x-2">
                    {["AN", "MK", "TM"].map((item) => (
                      <span key={item} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber-300 bg-white text-[10px] font-extrabold text-primary-700">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div>
                    <Users className="mb-2 h-7 w-7" />
                    <strong className="block text-2xl">Đa dạng</strong>
                    <span className="text-xs font-semibold">Môn học & cấp lớp</span>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-3xl bg-white p-4">
                    <div className="flex items-center gap-1 text-accent-500">
                      {[1, 2, 3, 4, 5].map((item) => <Star key={item} className="h-3.5 w-3.5 fill-current" />)}
                    </div>
                    <strong className="mt-3 block text-xl text-ink">Sát nhu cầu</strong>
                    <span className="text-xs text-slate-500">Tư vấn theo từng gia đình</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-3xl bg-primary-600 p-4 text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <strong className="block">TP.HCM</strong>
                      <span className="text-xs text-primary-100">và học online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft sm:-left-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Check className="h-5 w-5" />
            </span>
            <div>
              <strong className="block text-sm text-ink">Tiếp nhận nhanh chóng</strong>
              <span className="text-xs text-slate-500">Trao đổi rõ nhu cầu trước khi ghép</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page relative pb-8 lg:-mb-12 lg:translate-y-1/2 lg:pb-0">
        <form action="/gia-su-tieu-bieu" className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end lg:p-5">
          <label className="text-xs font-bold text-slate-600">
            <span className="mb-2 block">Môn học</span>
            <select name="subject" className={selectClass} defaultValue="">
              <option value="">Chọn môn học</option>
              {subjects.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-slate-600">
            <span className="mb-2 block">Lớp</span>
            <select name="grade" className={selectClass} defaultValue="">
              <option value="">Chọn lớp học</option>
              {grades.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-slate-600">
            <span className="mb-2 block">Khu vực</span>
            <select name="area" className={selectClass} defaultValue="">
              <option value="">Chọn khu vực</option>
              {areas.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-slate-600">
            <span className="mb-2 block">Hình thức</span>
            <select name="mode" className={selectClass} defaultValue="">
              <option value="">Chọn hình thức</option>
              <option>Tại nhà</option>
              <option>Online</option>
            </select>
          </label>
          <button type="submit" className="button-primary h-12 px-5">
            <Search className="h-4 w-4" />
            Tìm kiếm
          </button>
        </form>
      </div>
    </section>
  );
}
