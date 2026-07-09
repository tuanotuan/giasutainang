"use client";

import { SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { tutors as initialTutors } from "@/data/tutors";
import { filterTutors, type TutorFilterValues } from "@/lib/filters";
import type { Tutor } from "@/types";
import { Pagination } from "@/components/common/Pagination";
import { TutorCard } from "./TutorCard";
import { TutorFilter } from "./TutorFilter";

const initialFilters: TutorFilterValues = {
  keyword: "",
  subject: "",
  grade: "",
  area: "",
  level: "",
  gender: "",
};

const PAGE_SIZE = 12;

export function TutorList() {
  const [items, setItems] = useState<Tutor[]>(initialTutors);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  useEffect(() => {
    fetch("/api/tutors")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { items: Tutor[] }) => setItems(data.items))
      .catch(() => undefined);
  }, []);
  const filteredTutors = useMemo(() => filterTutors(items, filters), [filters, items]);
  const totalPages = Math.ceil(filteredTutors.length / PAGE_SIZE);
  const visibleTutors = filteredTutors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (nextFilters: TutorFilterValues) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 360, behavior: "smooth" });
  };

  return (
    <section className="section-space bg-slate-50/70">
      <div className="container-page grid items-start gap-7 lg:grid-cols-[280px_1fr]">
        <TutorFilter value={filters} onChange={handleFilterChange} />
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Tìm thấy <strong className="text-ink">{filteredTutors.length}</strong> gia sư phù hợp
            </p>
            <span className="hidden text-xs text-slate-400 sm:block">Hiển thị {PAGE_SIZE} hồ sơ mỗi trang</span>
          </div>
          {visibleTutors.length > 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleTutors.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <SearchX className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-lg font-bold text-ink">Chưa tìm thấy gia sư phù hợp</h2>
              <p className="mt-2 text-sm text-slate-500">Thử bỏ bớt một vài điều kiện để xem thêm hồ sơ.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
