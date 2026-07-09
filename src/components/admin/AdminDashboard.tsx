"use client";

import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { classes as initialClasses } from "@/data/classes";
import { posts as initialPosts } from "@/data/posts";
import { tutorRequests as initialRequests } from "@/data/requests";
import { tutors as initialTutors } from "@/data/tutors";
import type { ClassItem, Post, Tutor, TutorRequest } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { AdminSidebar, type AdminSection } from "./AdminSidebar";
import { AdminStats } from "./AdminStats";

export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [classes, setClasses] = useState<ClassItem[]>(() => initialClasses.slice(0, 12));
  const [tutors, setTutors] = useState<Tutor[]>(() => initialTutors.slice(0, 12));
  const [requests, setRequests] = useState<TutorRequest[]>(initialRequests);
  const [posts, setPosts] = useState<Post[]>(() => initialPosts.slice(0, 8));

  return (
    <div className="grid min-h-[calc(100vh-76px)] bg-slate-50 lg:grid-cols-[240px_1fr]">
      <AdminSidebar active={section} onChange={setSection} />
      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mb-7">
          <span className="text-xs font-bold uppercase tracking-[.16em] text-primary-600">Gia Sư Tài Năng</span>
          <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">{sectionTitle[section]}</h1>
          <p className="mt-2 text-sm text-slate-500">Dữ liệu và thao tác chỉ tồn tại trong phiên trình duyệt hiện tại.</p>
        </div>
        {section === "dashboard" && <Dashboard classes={classes} tutors={tutors} requests={requests} />}
        {section === "classes" && <ClassManager items={classes} setItems={setClasses} />}
        {section === "tutors" && <TutorManager items={tutors} setItems={setTutors} />}
        {section === "requests" && <RequestManager items={requests} setItems={setRequests} />}
        {section === "posts" && <PostManager items={posts} setItems={setPosts} />}
      </main>
    </div>
  );
}

const sectionTitle: Record<AdminSection, string> = {
  dashboard: "Tổng quan hệ thống",
  classes: "Quản lý lớp mới",
  tutors: "Quản lý gia sư",
  requests: "Quản lý yêu cầu tìm gia sư",
  posts: "Quản lý bài viết",
};

function Dashboard({ classes, tutors, requests }: { classes: ClassItem[]; tutors: Tutor[]; requests: TutorRequest[] }) {
  const bars = [45, 68, 52, 82, 64, 90, 76];
  return (
    <>
      <AdminStats students={1048} tutors={tutors.length} openClasses={classes.filter((item) => item.status !== "assigned").length} newRequests={requests.filter((item) => item.status === "new").length} />
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl bg-white p-6 shadow-card"><h2 className="font-bold text-ink">Yêu cầu trong 7 ngày</h2><div className="mt-8 flex h-52 items-end gap-3">{bars.map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><span className="w-full rounded-t-lg bg-primary-500 transition hover:bg-primary-600" style={{ height: `${height}%` }} /><small className="text-[10px] text-slate-400">T{index + 2}</small></div>)}</div></section>
        <section className="rounded-2xl bg-primary-800 p-6 text-white shadow-card"><h2 className="font-bold">Tình trạng lớp</h2><div className="mt-6 space-y-5">{(["open", "discount", "assigned"] as const).map((status) => { const count = classes.filter((item) => item.status === status).length; return <div key={status}><div className="mb-2 flex justify-between text-xs"><span>{status === "open" ? "Chưa giao" : status === "discount" ? "Ưu tiên" : "Đã giao"}</span><strong>{count}</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-amber-300" style={{ width: `${Math.max(8, count / classes.length * 100)}%` }} /></div></div>; })}</div></section>
      </div>
    </>
  );
}

function ClassManager({ items, setItems }: { items: ClassItem[]; setItems: React.Dispatch<React.SetStateAction<ClassItem[]>> }) {
  const [statusFilter, setStatusFilter] = useState("");
  const add = () => setItems((current) => [{ ...initialClasses[0], id: `admin-${Date.now()}`, code: `LMT-A${current.length + 1}`, title: "Lớp mới thêm từ admin", createdAt: new Date().toISOString().slice(0, 10) }, ...current]);
  const visible = statusFilter ? items.filter((item) => item.status === statusFilter) : items;
  return <ManagerShell onAdd={add} label="Thêm lớp" toolbar={<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Tất cả trạng thái</option><option value="open">Chưa giao</option><option value="discount">Ưu tiên</option><option value="assigned">Đã giao</option></select>}><AdminTable headers={["Mã lớp", "Tên lớp", "Khu vực", "Lương", "Trạng thái", "Thao tác"]}>{visible.map((item) => <tr key={item.id}><Cell strong>{item.code}</Cell><Cell>{item.title}</Cell><Cell>{item.area}</Cell><Cell>{formatCurrency(item.salary)}</Cell><Cell><select value={item.status} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: event.target.value as ClassItem["status"] } : entry))} className="rounded-lg border p-2 text-xs"><option value="open">Chưa giao</option><option value="discount">Ưu tiên</option><option value="assigned">Đã giao</option></select></Cell><Actions onEdit={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, title: entry.title.includes("•") ? entry.title : `${entry.title} • đã sửa` } : entry))} onDelete={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} /></tr>)}</AdminTable></ManagerShell>;
}

function TutorManager({ items, setItems }: { items: Tutor[]; setItems: React.Dispatch<React.SetStateAction<Tutor[]>> }) {
  const [keyword, setKeyword] = useState("");
  const add = () => setItems((current) => [{ ...initialTutors[0], id: `admin-${Date.now()}`, code: `MTA${current.length + 1}`, name: "Gia sư mới (mock)" }, ...current]);
  const normalized = keyword.toLocaleLowerCase("vi");
  const visible = items.filter((item) => !normalized || `${item.name} ${item.subjects.join(" ")} ${item.areas.join(" ")}`.toLocaleLowerCase("vi").includes(normalized));
  return <ManagerShell onAdd={add} label="Thêm gia sư" toolbar={<input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Lọc môn hoặc khu vực..." className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm sm:w-64" />}><AdminTable headers={["Mã", "Họ tên", "Trình độ", "Môn dạy", "Rating", "Thao tác"]}>{visible.map((item) => <tr key={item.id}><Cell strong>{item.code}</Cell><Cell>{item.name}</Cell><Cell>{item.level}</Cell><Cell>{item.subjects.join(", ")}</Cell><Cell>{item.rating}</Cell><Actions onEdit={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, name: entry.name.includes("•") ? entry.name : `${entry.name} • đã sửa` } : entry))} onDelete={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} /></tr>)}</AdminTable></ManagerShell>;
}

function RequestManager({ items, setItems }: { items: TutorRequest[]; setItems: React.Dispatch<React.SetStateAction<TutorRequest[]>> }) {
  return <AdminTable headers={["Mã", "Phụ huynh", "Điện thoại", "Nhu cầu", "Ngày gửi", "Trạng thái"]}>{items.map((item) => <tr key={item.id}><Cell strong>{item.id}</Cell><Cell>{item.parentName}</Cell><Cell>{item.phone}</Cell><Cell>{item.grade} · {item.subjects.join(", ")}</Cell><Cell>{item.createdAt}</Cell><Cell><select value={item.status} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: event.target.value as TutorRequest["status"] } : entry))} className="rounded-lg border p-2 text-xs"><option value="new">Mới</option><option value="called">Đã gọi</option><option value="matched">Đã ghép</option><option value="cancelled">Hủy</option></select></Cell></tr>)}</AdminTable>;
}

function PostManager({ items, setItems }: { items: Post[]; setItems: React.Dispatch<React.SetStateAction<Post[]>> }) {
  const add = () => setItems((current) => [{ ...initialPosts[0], id: `admin-${Date.now()}`, slug: `bai-viet-moi-${Date.now()}`, title: "Bài viết mới từ admin", date: new Date().toLocaleDateString("vi-VN") }, ...current]);
  return <ManagerShell onAdd={add} label="Thêm bài viết"><AdminTable headers={["Tiêu đề", "Danh mục", "Ngày", "Thao tác"]}>{items.map((item) => <tr key={item.id}><Cell strong>{item.title}</Cell><Cell>{item.category}</Cell><Cell>{item.date}</Cell><Actions onEdit={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, title: entry.title.includes("•") ? entry.title : `${entry.title} • đã sửa` } : entry))} onDelete={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} /></tr>)}</AdminTable></ManagerShell>;
}

function ManagerShell({ onAdd, label, toolbar, children }: { onAdd: () => void; label: string; toolbar?: React.ReactNode; children: React.ReactNode }) {
  return <div><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div>{toolbar}</div><button onClick={onAdd} className="button-primary"><Plus className="h-4 w-4" /> {label}</button></div>{children}</div>;
}
function AdminTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-2xl bg-white shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-100 text-xs text-slate-500"><tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-bold">{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{children}</tbody></table></div></div>;
}
function Cell({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) { return <td className={`px-4 py-3 text-xs ${strong ? "font-bold text-ink" : "text-slate-600"}`}>{children}</td>; }
function Actions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) { return <td className="px-4 py-3"><div className="flex gap-2"><button onClick={onEdit} aria-label="Sửa" className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Edit3 className="h-4 w-4" /></button><button onClick={onDelete} aria-label="Xóa" className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600"><Trash2 className="h-4 w-4" /></button></div></td>; }
