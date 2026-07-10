"use client";

import { useEffect, useState } from "react";
import { priceItems } from "@/data/prices";
import type { PriceItem } from "@/types";

export function PricingTable() {
  const [items, setItems] = useState<PriceItem[]>(priceItems);

  useEffect(() => {
    fetch("/api/prices")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { items?: PriceItem[] }) => data.items?.length && setItems(data.items))
      .catch(() => undefined);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="divide-y divide-slate-100 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="p-4">
            <div><strong className="block text-ink">{item.category}</strong><span className="mt-1 block text-xs text-slate-500">{item.subjectOrGrade}</span></div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-primary-50 p-3"><dt className="text-[11px] text-slate-500">Gia sư sinh viên</dt><dd className="mt-1 font-bold text-primary-700">{item.studentTutorPrice}</dd></div>
              <div className="rounded-xl bg-amber-50 p-3"><dt className="text-[11px] text-slate-500">Gia sư giáo viên</dt><dd className="mt-1 font-bold text-accent-600">{item.teacherTutorPrice}</dd></div>
              <div><dt className="text-[11px] text-slate-400">Số buổi / tuần</dt><dd className="mt-1 text-slate-700">{item.sessionsPerWeek}</dd></div>
              <div><dt className="text-[11px] text-slate-400">Thời lượng / buổi</dt><dd className="mt-1 text-slate-700">{item.duration}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-primary-800 text-white">
            <tr>
              {["Cấp học / môn học", "Gia sư sinh viên", "Gia sư giáo viên", "Số buổi / tuần", "Thời lượng / buổi"].map((item) => <th key={item} className="px-5 py-4 font-bold">{item}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="transition hover:bg-primary-50/50">
                <td className="px-5 py-4"><strong className="block text-ink">{item.category}</strong><span className="mt-1 block text-xs text-slate-500">{item.subjectOrGrade}</span></td>
                <td className="px-5 py-4 font-semibold text-primary-700">{item.studentTutorPrice}</td>
                <td className="px-5 py-4 font-semibold text-accent-600">{item.teacherTutorPrice}</td>
                <td className="px-5 py-4 text-slate-600">{item.sessionsPerWeek}</td>
                <td className="px-5 py-4 text-slate-600">{item.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
