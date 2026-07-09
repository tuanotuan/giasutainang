"use client";

import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { areas, grades, subjects } from "@/data/site";
import type { TutorFilterValues } from "@/lib/filters";

interface TutorFilterProps {
  value: TutorFilterValues;
  onChange: (value: TutorFilterValues) => void;
}

const emptyFilters: TutorFilterValues = {
  keyword: "",
  subject: "",
  grade: "",
  area: "",
  level: "",
  gender: "",
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100";

export function TutorFilter({ value, onChange }: TutorFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const update = (key: keyof TutorFilterValues, nextValue: string) =>
    onChange({ ...value, [key]: nextValue });
  const activeCount = Object.values(value).filter(Boolean).length;

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
            placeholder="Tên, mã, trường..."
          />
        </span>
      </label>
      <FilterSelect label="Môn dạy" value={value.subject} options={subjects} onChange={(next) => update("subject", next)} />
      <FilterSelect label="Lớp dạy" value={value.grade} options={grades} onChange={(next) => update("grade", next)} />
      <FilterSelect label="Khu vực" value={value.area} options={[...areas, "Online"]} onChange={(next) => update("area", next)} />
      <FilterSelect label="Trình độ" value={value.level} options={["Sinh viên", "Giáo viên", "Cử nhân", "Thạc sĩ"]} onChange={(next) => update("level", next)} />
      <FilterSelect label="Giới tính" value={value.gender} options={["Nam", "Nữ"]} onChange={(next) => update("gender", next)} />
      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => onChange(emptyFilters)}
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
          <h2 className="font-bold text-ink">Lọc gia sư</h2>
        </div>
        <div className="space-y-4">{fields}</div>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button className="absolute inset-0 bg-slate-950/40" onClick={() => setMobileOpen(false)} aria-label="Đóng bộ lọc" />
          <aside className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="flex items-center gap-2 font-bold"><SlidersHorizontal className="h-5 w-5 text-primary-600" /> Lọc gia sư</h2>
              <button onClick={() => setMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100" aria-label="Đóng">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">{fields}</div>
            <button onClick={() => setMobileOpen(false)} className="button-primary mt-5 w-full">Xem kết quả</button>
          </aside>
        </div>
      )}
    </>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        <option value="">Tất cả</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
