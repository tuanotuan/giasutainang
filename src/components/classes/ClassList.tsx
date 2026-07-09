"use client";

import { ArrowUpDown, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { classes } from "@/data/classes";
import { filterClasses, type ClassFilterValues } from "@/lib/filters";
import { Pagination } from "@/components/common/Pagination";
import { ClassCard } from "./ClassCard";
import { ClassFilter, initialClassFilters } from "./ClassFilter";

const PAGE_SIZE = 9;

export function ClassList() {
  const [filters, setFilters] = useState<ClassFilterValues>(initialClassFilters);
  const [page, setPage] = useState(1);
  const filteredClasses = useMemo(() => filterClasses(classes, filters), [filters]);
  const totalPages = Math.ceil(filteredClasses.length / PAGE_SIZE);
  const visibleClasses = filteredClasses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (nextFilters: ClassFilterValues) => {
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
        <ClassFilter value={filters} onChange={handleFilterChange} />
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Tìm thấy <strong className="text-ink">{filteredClasses.length}</strong> lớp phù hợp
            </p>
            <label className="relative flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500">Sắp xếp</span>
              <select
                value={filters.sort}
                onChange={(event) => handleFilterChange({ ...filters, sort: event.target.value as ClassFilterValues["sort"] })}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-primary-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="salary-desc">Lương cao nhất</option>
                <option value="salary-asc">Lương thấp nhất</option>
              </select>
            </label>
          </div>
          {visibleClasses.length > 0 ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleClasses.map((item) => <ClassCard key={item.id} item={item} />)}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <SearchX className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-lg font-bold text-ink">Chưa có lớp phù hợp</h2>
              <p className="mt-2 text-sm text-slate-500">Bạn có thể thay đổi khu vực, môn học hoặc mức lương để xem thêm lớp.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
