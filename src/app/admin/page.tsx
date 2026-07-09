import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Khu vực quản lý", description: "Khu vực cập nhật thông tin của Gia Sư Tài Năng.", robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminDashboard />; }
