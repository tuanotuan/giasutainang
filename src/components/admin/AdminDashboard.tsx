"use client";

import {
  AlertCircle,
  CheckCircle2,
  Database,
  Edit3,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { classes as initialClasses } from "@/data/classes";
import { posts as initialPosts } from "@/data/posts";
import { tutors as initialTutors } from "@/data/tutors";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { ClassItem, Post, Tutor, TutorRequest } from "@/types";
import { AdminSidebar, type AdminSection } from "./AdminSidebar";
import { AdminStats } from "./AdminStats";

type SubmissionRecord = {
  id: string;
  type: string;
  name: string;
  phone: string;
  email?: string | null;
  reference_code?: string | null;
  payload: Record<string, unknown>;
  status: string;
  created_at: string;
};

type AdminState = {
  needsSetup: boolean;
  classes: ClassItem[];
  tutors: Tutor[];
  requests: TutorRequest[];
  posts: Post[];
  submissions: SubmissionRecord[];
};

const fallbackState: AdminState = {
  needsSetup: false,
  classes: initialClasses.slice(0, 12),
  tutors: initialTutors.slice(0, 12),
  requests: [],
  posts: initialPosts.slice(0, 8),
  submissions: [],
};

const sectionTitle: Record<AdminSection, string> = {
  dashboard: "Tổng quan hệ thống",
  classes: "Quản lý lớp mới",
  tutors: "Quản lý gia sư",
  requests: "Yêu cầu & liên hệ",
  posts: "Quản lý bài viết",
};

export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<AdminState>(fallbackState);

  const loadState = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await apiRequest<AdminState>("/api/admin/state");
      setState(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không tải được dữ liệu quản trị.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    apiRequest<{ authenticated: boolean }>("/api/admin/session")
      .then(async (data) => {
        if (!mounted) return;
        setAuthenticated(data.authenticated);
        setAuthChecked(true);
        if (data.authenticated) await loadState();
      })
      .catch(() => {
        if (!mounted) return;
        setAuthenticated(false);
        setAuthChecked(true);
      });
    return () => {
      mounted = false;
    };
  }, [loadState]);

  const handleLogin = async (password: string) => {
    setLoading(true);
    setMessage("");
    try {
      await apiRequest<{ success: boolean }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setAuthenticated(true);
      await loadState();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không đăng nhập được.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiRequest<{ success: boolean }>("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    setAuthenticated(false);
    setState(fallbackState);
  };

  if (!authChecked) {
    return (
      <AdminScreen>
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="mt-3 text-sm text-slate-500">Đang kiểm tra phiên đăng nhập...</p>
      </AdminScreen>
    );
  }

  if (!authenticated) {
    return <LoginPanel error={message} loading={loading} onLogin={handleLogin} />;
  }

  return (
    <div className="grid min-h-[calc(100vh-76px)] bg-slate-50 lg:grid-cols-[240px_1fr]">
      <AdminSidebar active={section} onChange={setSection} />
      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[.16em] text-primary-600">Gia Sư Tài Năng</span>
            <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{sectionTitle[section]}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Dữ liệu được lưu qua Cloudflare D1 sau khi cấu hình database cho Worker.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadState} className="button-secondary h-11 px-4" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Làm mới
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>

        {message && <Notice tone="error">{message}</Notice>}

        {state.needsSetup ? (
          <SetupPanel loading={loading} onSetup={async () => {
            setLoading(true);
            setMessage("");
            try {
              await apiRequest<{ success: boolean }>("/api/admin/setup", { method: "POST" });
              await loadState();
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Không khởi tạo được database.");
            } finally {
              setLoading(false);
            }
          }} />
        ) : (
          <>
            {section === "dashboard" && <Dashboard classes={state.classes} tutors={state.tutors} requests={state.requests} submissions={state.submissions} />}
            {section === "classes" && <ClassManager items={state.classes} onRefresh={loadState} />}
            {section === "tutors" && <TutorManager items={state.tutors} onRefresh={loadState} />}
            {section === "requests" && <RequestManager items={state.requests} submissions={state.submissions} onRefresh={loadState} />}
            {section === "posts" && <PostManager items={state.posts} onRefresh={loadState} />}
          </>
        )}
      </main>
    </div>
  );
}

function AdminScreen({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-76px)] flex-col items-center justify-center bg-slate-50 px-4 text-center">
      {children}
    </div>
  );
}

function LoginPanel({ error, loading, onLogin }: { error: string; loading: boolean; onLogin: (password: string) => Promise<void> }) {
  const [password, setPassword] = useState("");

  return (
    <AdminScreen>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onLogin(password);
        }}
        className="w-full max-w-md rounded-3xl bg-white p-7 text-left shadow-card"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <Database className="h-7 w-7" />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-[.16em] text-primary-600">Khu quản trị</p>
        <h1 className="mt-2 text-2xl font-extrabold text-ink">Đăng nhập admin</h1>
        <p className="mt-2 text-sm text-slate-500">
          Nhập mật khẩu quản trị đã cấu hình trong Cloudflare Worker để xem và sửa dữ liệu thật.
        </p>
        {error && <Notice tone="error" className="mt-5">{error}</Notice>}
        <label className="mt-6 block">
          <span className="text-xs font-bold text-slate-600">Mật khẩu admin</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            placeholder="Nhập mật khẩu"
            required
          />
        </label>
        <button type="submit" className="button-primary mt-5 w-full justify-center" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Đăng nhập
        </button>
      </form>
    </AdminScreen>
  );
}

function SetupPanel({ loading, onSetup }: { loading: boolean; onSetup: () => Promise<void> }) {
  return (
    <section className="rounded-3xl border border-dashed border-primary-200 bg-white p-7 shadow-card">
      <div className="flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <Database className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-ink">Database chưa được khởi tạo</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bấm nút dưới đây để tạo bảng D1 và nạp dữ liệu mẫu ban đầu. Sau đó phần lớp mới, gia sư, bài viết và yêu cầu sẽ lấy từ database.
          </p>
          <button type="button" onClick={() => void onSetup()} className="button-primary mt-5" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            Khởi tạo database
          </button>
        </div>
      </div>
    </section>
  );
}

function Dashboard({
  classes,
  tutors,
  requests,
  submissions,
}: {
  classes: ClassItem[];
  tutors: Tutor[];
  requests: TutorRequest[];
  submissions: SubmissionRecord[];
}) {
  const bars = [45, 68, 52, 82, 64, 90, 76];
  const newRequestCount = requests.filter((item) => item.status === "new").length + submissions.filter((item) => item.status === "new").length;
  const totalClasses = Math.max(classes.length, 1);

  return (
    <>
      <AdminStats
        students={requests.length + submissions.length}
        tutors={tutors.length}
        openClasses={classes.filter((item) => item.status !== "assigned").length}
        newRequests={newRequestCount}
      />
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="font-bold text-ink">Yêu cầu trong 7 ngày</h2>
          <div className="mt-8 flex h-52 items-end gap-3">
            {bars.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <span className="w-full rounded-t-lg bg-primary-500 transition hover:bg-primary-600" style={{ height: `${height}%` }} />
                <small className="text-[10px] text-slate-400">T{index + 2}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl bg-primary-800 p-6 text-white shadow-card">
          <h2 className="font-bold">Tình trạng lớp</h2>
          <div className="mt-6 space-y-5">
            {(["open", "discount", "assigned"] as const).map((status) => {
              const count = classes.filter((item) => item.status === status).length;
              return (
                <div key={status}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span>{status === "open" ? "Chưa giao" : status === "discount" ? "Ưu tiên" : "Đã giao"}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-amber-300" style={{ width: `${Math.max(8, (count / totalClasses) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

function ClassManager({ items, onRefresh }: { items: ClassItem[]; onRefresh: () => Promise<void> }) {
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<ClassItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const visible = statusFilter ? items.filter((item) => item.status === statusFilter) : items;

  const saveClass = async (item: ClassItem) => {
    setSaving(true);
    setMessage("");
    const exists = items.some((entry) => entry.id === item.id);
    try {
      await apiRequest<{ success: boolean; id?: string }>(exists ? `/api/admin/classes/${encodeURIComponent(item.id)}` : "/api/admin/classes", {
        method: exists ? "PUT" : "POST",
        body: JSON.stringify(item),
      });
      setEditing(null);
      await onRefresh();
      setMessage(exists ? "Đã cập nhật lớp." : "Đã thêm lớp mới.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không lưu được lớp.");
    } finally {
      setSaving(false);
    }
  };

  const deleteClass = async (item: ClassItem) => {
    if (!confirm(`Xóa lớp ${item.code}?`)) return;
    setSaving(true);
    setMessage("");
    try {
      await apiRequest<{ success: boolean }>(`/api/admin/classes/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      await onRefresh();
      setMessage("Đã xóa lớp.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không xóa được lớp.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ManagerShell
      onAdd={() => setEditing(makeClassDraft())}
      label="Thêm lớp"
      toolbar={(
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm">
          <option value="">Tất cả trạng thái</option>
          <option value="open">Chưa giao</option>
          <option value="discount">Ưu tiên</option>
          <option value="assigned">Đã giao</option>
        </select>
      )}
    >
      {message && <Notice tone={message.includes("Không") ? "error" : "success"} className="mb-4">{message}</Notice>}
      {editing && (
        <ClassForm
          key={editing.id}
          value={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSubmit={(item) => void saveClass(item)}
        />
      )}
      <AdminTable headers={["Mã lớp", "Tên lớp", "Khu vực", "Lương", "Trạng thái", "Thao tác"]}>
        {visible.map((item) => (
          <tr key={item.id}>
            <Cell strong>{item.code}</Cell>
            <Cell>{item.title}</Cell>
            <Cell>{item.area}</Cell>
            <Cell>{formatCurrency(item.salary)}</Cell>
            <Cell>
              <select
                value={item.status}
                onChange={(event) => void saveClass({ ...item, status: event.target.value as ClassItem["status"] })}
                className="rounded-lg border p-2 text-xs"
                disabled={saving}
              >
                <option value="open">Chưa giao</option>
                <option value="discount">Ưu tiên</option>
                <option value="assigned">Đã giao</option>
              </select>
            </Cell>
            <Actions onEdit={() => setEditing(item)} onDelete={() => void deleteClass(item)} disabled={saving} />
          </tr>
        ))}
      </AdminTable>
    </ManagerShell>
  );
}

function ClassForm({
  value,
  saving,
  onCancel,
  onSubmit,
}: {
  value: ClassItem;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (item: ClassItem) => void;
}) {
  const [form, setForm] = useState<ClassItem>(value);

  const update = <K extends keyof ClassItem>(key: K, next: ClassItem[K]) => {
    setForm((current) => ({ ...current, [key]: next }));
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="mb-5 rounded-2xl border border-primary-100 bg-white p-5 shadow-card"
    >
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-extrabold text-ink">{value.id.startsWith("new-") ? "Thêm lớp mới" : `Sửa lớp ${value.code}`}</h2>
        <p className="text-sm text-slate-500">Các thông tin này sẽ hiển thị ngoài trang “Lớp mới cần gia sư”.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Input label="Mã lớp" value={form.code} onChange={(next) => update("code", next)} required />
        <Select label="Trạng thái" value={form.status} onChange={(next) => update("status", next as ClassItem["status"])}>
          <option value="open">Chưa giao</option>
          <option value="discount">Ưu tiên</option>
          <option value="assigned">Đã giao</option>
        </Select>
        <Input label="Ngày tạo" type="date" value={form.createdAt} onChange={(next) => update("createdAt", next)} required />
        <Input label="Tên lớp" value={form.title} onChange={(next) => update("title", next)} required className="xl:col-span-2" />
        <Input label="Môn học" value={form.subject} onChange={(next) => update("subject", next)} required />
        <Input label="Khối lớp" value={form.grade} onChange={(next) => update("grade", next)} required />
        <Input label="Khu vực" value={form.area} onChange={(next) => update("area", next)} required />
        <Input label="Địa chỉ gần đúng" value={form.address} onChange={(next) => update("address", next)} required />
        <Select label="Hình thức học" value={form.learningMode} onChange={(next) => update("learningMode", next as ClassItem["learningMode"])}>
          <option value="Tại nhà">Tại nhà</option>
          <option value="Online">Online</option>
          <option value="Học nhóm">Học nhóm</option>
        </Select>
        <Input label="Số học viên" type="number" value={String(form.studentCount)} onChange={(next) => update("studentCount", Number(next))} required />
        <Select label="Học lực" value={form.studentLevel} onChange={(next) => update("studentLevel", next as ClassItem["studentLevel"])}>
          <option value="Giỏi">Giỏi</option>
          <option value="Khá">Khá</option>
          <option value="Trung bình">Trung bình</option>
          <option value="Yếu">Yếu</option>
          <option value="Kém">Kém</option>
        </Select>
        <Input label="Buổi/tuần" type="number" value={String(form.sessionsPerWeek)} onChange={(next) => update("sessionsPerWeek", Number(next))} required />
        <Input label="Thời lượng" value={form.duration} onChange={(next) => update("duration", next)} required />
        <Input label="Lịch học" value={form.schedule} onChange={(next) => update("schedule", next)} required />
        <Input label="Lương/buổi" type="number" value={String(form.salary)} onChange={(next) => update("salary", Number(next))} required />
        <Input label="Yêu cầu gia sư" value={form.tutorRequirement} onChange={(next) => update("tutorRequirement", next)} required className="xl:col-span-2" />
        <Textarea label="Ghi chú" value={form.note} onChange={(next) => update("note", next)} className="md:col-span-2 xl:col-span-3" />
      </div>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="button-secondary justify-center" disabled={saving}>
          Hủy
        </button>
        <button type="submit" className="button-primary justify-center" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Lưu lớp
        </button>
      </div>
    </form>
  );
}

function TutorManager({ items, onRefresh }: { items: Tutor[]; onRefresh: () => Promise<void> }) {
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const normalized = keyword.toLocaleLowerCase("vi");
  const visible = items.filter((item) => !normalized || `${item.name} ${item.subjects.join(" ")} ${item.areas.join(" ")}`.toLocaleLowerCase("vi").includes(normalized));

  const add = async () => {
    const source = initialTutors[0];
    const tutor: Tutor = {
      ...source,
      id: crypto.randomUUID(),
      code: `GST-${Date.now().toString().slice(-6)}`,
      name: "Gia sư mới",
      subjects: [...source.subjects],
      grades: [...source.grades],
      areas: [...source.areas],
      availableTimes: [...source.availableTimes],
      achievements: [...source.achievements],
    };
    await mutateSimple("/api/admin/tutors", "POST", tutor, "Đã thêm gia sư.", setMessage, onRefresh);
  };

  const edit = async (item: Tutor) => {
    const name = prompt("Tên gia sư", item.name);
    if (!name) return;
    await mutateSimple(`/api/admin/tutors/${encodeURIComponent(item.id)}`, "PUT", { ...item, name }, "Đã cập nhật gia sư.", setMessage, onRefresh);
  };

  const remove = async (item: Tutor) => {
    if (!confirm(`Xóa gia sư ${item.code}?`)) return;
    await mutateSimple(`/api/admin/tutors/${encodeURIComponent(item.id)}`, "DELETE", undefined, "Đã xóa gia sư.", setMessage, onRefresh);
  };

  return (
    <ManagerShell
      onAdd={() => void add()}
      label="Thêm gia sư"
      toolbar={<input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Lọc môn hoặc khu vực..." className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm sm:w-64" />}
    >
      {message && <Notice tone={message.includes("Không") ? "error" : "success"} className="mb-4">{message}</Notice>}
      <AdminTable headers={["Mã", "Họ tên", "Trình độ", "Môn dạy", "Rating", "Thao tác"]}>
        {visible.map((item) => (
          <tr key={item.id}>
            <Cell strong>{item.code}</Cell>
            <Cell>{item.name}</Cell>
            <Cell>{item.level}</Cell>
            <Cell>{item.subjects.join(", ")}</Cell>
            <Cell>{item.rating}</Cell>
            <Actions onEdit={() => void edit(item)} onDelete={() => void remove(item)} />
          </tr>
        ))}
      </AdminTable>
    </ManagerShell>
  );
}

function RequestManager({
  items,
  submissions,
  onRefresh,
}: {
  items: TutorRequest[];
  submissions: SubmissionRecord[];
  onRefresh: () => Promise<void>;
}) {
  const [message, setMessage] = useState("");

  const updateStatus = async (item: TutorRequest, status: TutorRequest["status"]) => {
    try {
      await apiRequest<{ success: boolean }>(`/api/admin/requests/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await onRefresh();
      setMessage("Đã cập nhật trạng thái yêu cầu.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không cập nhật được yêu cầu.");
    }
  };

  return (
    <div className="space-y-6">
      {message && <Notice tone={message.includes("Không") ? "error" : "success"}>{message}</Notice>}
      <section>
        <h2 className="mb-3 text-lg font-extrabold text-ink">Yêu cầu tìm gia sư</h2>
        <AdminTable headers={["Mã", "Phụ huynh", "Điện thoại", "Nhu cầu", "Ngày gửi", "Trạng thái"]}>
          {items.map((item) => (
            <tr key={item.id}>
              <Cell strong>{shortId(item.id)}</Cell>
              <Cell>{item.parentName}</Cell>
              <Cell>{item.phone}</Cell>
              <Cell>{item.grade} · {item.subjects.join(", ")}</Cell>
              <Cell>{formatDate(item.createdAt)}</Cell>
              <Cell>
                <select value={item.status} onChange={(event) => void updateStatus(item, event.target.value as TutorRequest["status"])} className="rounded-lg border p-2 text-xs">
                  <option value="new">Mới</option>
                  <option value="called">Đã gọi</option>
                  <option value="matched">Đã ghép</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </Cell>
            </tr>
          ))}
        </AdminTable>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-extrabold text-ink">Đăng ký nhận lớp / liên hệ / ứng tuyển gia sư</h2>
        <AdminTable headers={["Loại", "Tên", "Điện thoại", "Email", "Mã lớp", "Ngày gửi"]}>
          {submissions.map((item) => (
            <tr key={item.id}>
              <Cell strong>{submissionLabel(item.type)}</Cell>
              <Cell>{item.name || getPayloadText(item.payload, "parentName") || "Chưa có tên"}</Cell>
              <Cell>{item.phone}</Cell>
              <Cell>{item.email || "—"}</Cell>
              <Cell>{item.reference_code || getPayloadText(item.payload, "classCode") || "—"}</Cell>
              <Cell>{formatDate(item.created_at)}</Cell>
            </tr>
          ))}
        </AdminTable>
      </section>
    </div>
  );
}

function PostManager({ items, onRefresh }: { items: Post[]; onRefresh: () => Promise<void> }) {
  const [message, setMessage] = useState("");

  const add = async () => {
    const source = initialPosts[0];
    const stamp = Date.now();
    const post: Post = {
      ...source,
      id: crypto.randomUUID(),
      slug: `bai-viet-moi-${stamp}`,
      title: "Bài viết mới",
      date: new Date().toLocaleDateString("vi-VN"),
    };
    await mutateSimple("/api/admin/posts", "POST", post, "Đã thêm bài viết.", setMessage, onRefresh);
  };

  const edit = async (item: Post) => {
    const title = prompt("Tiêu đề bài viết", item.title);
    if (!title) return;
    await mutateSimple(`/api/admin/posts/${encodeURIComponent(item.id)}`, "PUT", { ...item, title }, "Đã cập nhật bài viết.", setMessage, onRefresh);
  };

  const remove = async (item: Post) => {
    if (!confirm(`Xóa bài "${item.title}"?`)) return;
    await mutateSimple(`/api/admin/posts/${encodeURIComponent(item.id)}`, "DELETE", undefined, "Đã xóa bài viết.", setMessage, onRefresh);
  };

  return (
    <ManagerShell onAdd={() => void add()} label="Thêm bài viết">
      {message && <Notice tone={message.includes("Không") ? "error" : "success"} className="mb-4">{message}</Notice>}
      <AdminTable headers={["Tiêu đề", "Danh mục", "Ngày", "Thao tác"]}>
        {items.map((item) => (
          <tr key={item.id}>
            <Cell strong>{item.title}</Cell>
            <Cell>{item.category}</Cell>
            <Cell>{item.date}</Cell>
            <Actions onEdit={() => void edit(item)} onDelete={() => void remove(item)} />
          </tr>
        ))}
      </AdminTable>
    </ManagerShell>
  );
}

function ManagerShell({
  onAdd,
  label,
  toolbar,
  children,
}: {
  onAdd?: () => void;
  label?: string;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>{toolbar}</div>
        {onAdd && label && (
          <button type="button" onClick={onAdd} className="button-primary">
            <Plus className="h-4 w-4" />
            {label}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function AdminTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-100 text-xs text-slate-500">
            <tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-bold">{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return <td className={`px-4 py-3 text-xs ${strong ? "font-bold text-ink" : "text-slate-600"}`}>{children}</td>;
}

function Actions({ onEdit, onDelete, disabled = false }: { onEdit: () => void; onDelete: () => void; disabled?: boolean }) {
  return (
    <td className="px-4 py-3">
      <div className="flex gap-2">
        <button type="button" onClick={onEdit} aria-label="Sửa" disabled={disabled} className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 disabled:opacity-50">
          <Edit3 className="h-4 w-4" />
        </button>
        <button type="button" onClick={onDelete} aria-label="Xóa" disabled={disabled} className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 disabled:opacity-50">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </td>
  );
}

function Notice({ children, tone = "success", className = "" }: { children: ReactNode; tone?: "success" | "error"; className?: string }) {
  const isError = tone === "error";
  return (
    <div className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${isError ? "border-rose-100 bg-rose-50 text-rose-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"} ${className}`}>
      {isError ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

function Field({ label, className = "", children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required={required}
        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
      />
    </Field>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
      >
        {children}
      </select>
    </Field>
  );
}

function Textarea({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
      />
    </Field>
  );
}

async function mutateSimple(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body: unknown,
  successMessage: string,
  setMessage: (message: string) => void,
  onRefresh: () => Promise<void>,
) {
  setMessage("");
  try {
    await apiRequest<{ success: boolean }>(path, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    await onRefresh();
    setMessage(successMessage);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Không thao tác được.");
  }
}

function makeClassDraft(): ClassItem {
  const stamp = Date.now().toString().slice(-6);
  return {
    ...initialClasses[0],
    id: `new-${crypto.randomUUID()}`,
    code: `GSTN-${stamp}`,
    status: "open",
    title: "Lớp mới cần gia sư",
    subject: "Toán",
    grade: "Lớp 9",
    area: "Bình Thạnh",
    address: "Nhập địa chỉ gần đúng",
    sessionsPerWeek: 2,
    schedule: "Tối Thứ 2, 4",
    salary: 220000,
    note: "",
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

function shortId(id: string) {
  return id.length > 10 ? id.slice(0, 8) : id;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("vi-VN");
}

function submissionLabel(type: string) {
  const map: Record<string, string> = {
    tutor_application: "Ứng tuyển gia sư",
    class_application: "Nhận lớp",
    contact: "Liên hệ",
  };
  return map[type] ?? type;
}

function getPayloadText(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}
