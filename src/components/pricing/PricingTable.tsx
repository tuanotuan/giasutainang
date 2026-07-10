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
      <div className="overflow-x-auto">
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
