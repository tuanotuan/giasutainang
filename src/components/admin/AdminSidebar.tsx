"use client";

import { BadgeDollarSign, BookOpenText, GraduationCap, LayoutDashboard, School, Sparkles, UserRoundSearch } from "lucide-react";

export type AdminSection = "dashboard" | "classes" | "tutors" | "requests" | "pricing" | "posts" | "assistant";

const items = [
  { id: "dashboard" as const, label: "Tổng quan", icon: LayoutDashboard },
  { id: "classes" as const, label: "Quản lý lớp", icon: School },
  { id: "tutors" as const, label: "Quản lý gia sư", icon: GraduationCap },
  { id: "requests" as const, label: "Yêu cầu tìm gia sư", icon: UserRoundSearch },
  { id: "pricing" as const, label: "Quản lý bảng giá", icon: BadgeDollarSign },
  { id: "posts" as const, label: "Quản lý bài viết", icon: BookOpenText },
  { id: "assistant" as const, label: "Trợ lý thông minh", icon: Sparkles },
];

export function AdminSidebar({ active, onChange }: { active: AdminSection; onChange: (section: AdminSection) => void }) {
  return (
    <aside className="sticky top-16 z-30 border-b border-slate-200 bg-white sm:top-[76px] lg:static lg:min-h-[calc(100vh-76px)] lg:border-b-0 lg:border-r">
      <div className="px-3 py-2 lg:p-5">
        <p className="mb-4 hidden text-xs font-extrabold uppercase tracking-[.16em] text-slate-400 lg:block">Khu vực quản lý</p>
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:pb-0">
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => onChange(id)} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition lg:gap-3 lg:px-4 lg:py-3 lg:text-sm ${active === id ? "bg-primary-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
