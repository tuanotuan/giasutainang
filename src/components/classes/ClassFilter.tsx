"use client";

import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { areas, grades, subjects } from "@/data/site";
import type { ClassFilterValues } from "@/lib/filters";

interface ClassFilterProps {
  value: ClassFilterValues;
  onChange: (value: ClassFilterValues) => void;
}

export const initialClassFilters: ClassFilterValues = {
  keyword: "",
  subject: "",
  grade: "",
  area: "",
  learningMode: "",
  sessionsPerWeek: "",
  minimumSalary: "",
  status: "",
  sort: "newest",
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100";

export function ClassFilter({ value, onChange }: ClassFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const update = (key: keyof ClassFilterValues, nextValue: string) =>
    onChange({ ...value, [key]: nextValue } as ClassFilterValues);
  const activeCount = Object.entries(value).filter(([key, fieldValue]) => key !== "sort" && Boolean(fieldValue)).length;

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);

  const fields = (
    <>
      <label className="block">
        <span className="mb-2 block text-xs font-bold text-slate-600">Từ khóa</span>
        <span className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={value.keyword}
            onChange={(event) => update("keyword", event.target.value)}
            className={`${inputClass} pl-9`}
            placeholder="Mã lớp, môn học..."
          />
        </span>
      </label>
      <FilterSelect label="Môn học" value={value.subject} options={subjects} onChange={(next) => update("subject", next)} />
      <FilterSelect label="Lớp" value={value.grade} options={grades} onChange={(next) => update("grade", next)} />
      <FilterSelect label="Khu vực" value={value.area} options={[...areas, "Online"]} onChange={(next) => update("area", next)} />
      <FilterSelect label="Hình thức học" value={value.learningMode} options={["Tại nhà", "Online", "Học nhóm"]} onChange={(next) => update("learningMode", next)} />
      <FilterSelect label="Số buổi/tuần" value={value.sessionsPerWeek} options={["1", "2", "3", "4", "5", "6", "7"]} onChange={(next) => update("sessionsPerWeek", next)} suffix=" buổi" />
      <FilterSelect
        label="Lương tối thiểu"
        value={value.minimumSalary}
        options={["180000", "220000", "280000", "350000"]}
        optionLabels={["Từ 180.000đ", "Từ 220.000đ", "Từ 280.000đ", "Từ 350.000đ"]}
        onChange={(next) => update("minimumSalary", next)}
      />
      <FilterSelect
        label="Trạng thái"
        value={value.status}
        options={["open", "assigned", "discount"]}
        optionLabels={["Chưa giao", "Đã giao", "Giảm phí / ưu tiên"]}
        onChange={(next) => update("status", next)}
      />
      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => onChange(initialClassFilters)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
        >
          <RotateCcw className="h-4 w-4" /> Xóa {activeCount} bộ lọc
        </button>
      )}
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white font-bold text-primary-700 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Bộ lọc {activeCount > 0 && `(${activeCount})`}
      </button>
      <aside className="hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-card lg:sticky lg:top-24 lg:block">
        <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
          <SlidersHorizontal className="h-5 w-5 text-primary-600" />
          <h2 className="font-bold text-ink">Lọc lớp mới</h2>
        </div>
        <div className="space-y-4">{fields}</div>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/40" onClick={() => setMobileOpen(false)} aria-label="Đóng bộ lọc" />
          <aside className="absolute bottom-0 left-0 right-0 flex max-h-[92dvh] flex-col rounded-t-3xl bg-white">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="flex items-center gap-2 font-bold"><SlidersHorizontal className="h-5 w-5 text-primary-600" /> Lọc lớp mới</h2>
              <button type="button" onClick={() => setMobileOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100" aria-label="Đóng">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto px-5 py-4">{fields}</div>
            <div className="shrink-0 border-t bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3"><button type="button" onClick={() => setMobileOpen(false)} className="button-primary w-full">Xem kết quả</button></div>
          </aside>
        </div>
      )}
    </>
  );
}

function FilterSelect({
  label,
  value,
  options,
  optionLabels,
  suffix = "",
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  optionLabels?: string[];
  suffix?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        <option value="">Tất cả</option>
        {options.map((option, index) => (
          <option key={option} value={option}>{optionLabels?.[index] ?? `${option}${suffix}`}</option>
        ))}
      </select>
    </label>
  );
}
