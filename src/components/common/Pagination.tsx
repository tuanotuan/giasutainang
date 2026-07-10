"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Phân trang">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-primary-300 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page, index) => (
        <span key={page} className="contents">
          {index > 0 && page - pages[index - 1] > 1 && <span className="px-1 text-slate-400">…</span>}
          <button
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-11 min-w-11 rounded-xl px-3 text-sm font-bold transition ${
              page === currentPage
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                : "border border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-primary-300 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
