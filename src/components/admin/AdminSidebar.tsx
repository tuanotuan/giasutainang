"use client";

import { BadgeDollarSign, BookOpenText, GraduationCap, LayoutDashboard, School, UserRoundSearch } from "lucide-react";

export type AdminSection = "dashboard" | "classes" | "tutors" | "requests" | "pricing" | "posts";

const items = [
  { id: "dashboard" as const, label: "Tổng quan", icon: LayoutDashboard },
  { id: "classes" as const, label: "Quản lý lớp", icon: School },
  { id: "tutors" as const, label: "Quản lý gia sư", icon: GraduationCap },
  { id: "requests" as const, label: "Yêu cầu tìm gia sư", icon: UserRoundSearch },
  { id: "pricing" as const, label: "Quản lý bảng giá", icon: BadgeDollarSign },
  { id: "posts" as const, label: "Quản lý bài viết", icon: BookOpenText },
];

export function AdminSidebar({ active, onChange }: { active: AdminSection; onChange: (section: AdminSection) => void }) {
  return (
    <aside className="border-b border-slate-200 bg-white lg:min-h-[calc(100vh-76px)] lg:border-b-0 lg:border-r">
      <div className="p-4 lg:p-5">
        <p className="mb-4 hidden text-xs font-extrabold uppercase tracking-[.16em] text-slate-400 lg:block">Khu vực quản lý</p>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => onChange(id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${active === id ? "bg-primary-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
