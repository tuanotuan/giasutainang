import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin", description: "Dashboard quản trị dữ liệu của Gia Sư Tài Năng.", robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminDashboard />; }
