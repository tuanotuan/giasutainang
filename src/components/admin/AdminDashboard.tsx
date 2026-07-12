"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Edit3,
  Eye,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { classes as initialClasses } from "@/data/classes";
import { posts as initialPosts } from "@/data/posts";
import { priceItems as initialPrices } from "@/data/prices";
import { tutors as initialTutors } from "@/data/tutors";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { ClassItem, Post, PriceItem, Tutor, TutorRequest } from "@/types";
import { AdminSidebar, type AdminSection } from "./AdminSidebar";
import { AdminStats } from "./AdminStats";
import { AdminAiTools } from "./AdminAiTools";

type SubmissionRecord = {
  id: string;
  type: string;
  name: string;
  phone: string;
  email?: string | null;
  reference_code?: string | null;
  payload: Record<string, unknown>;
  status: string;
  admin_note?: string;
  created_at: string;
};

type AdminState = {
  needsSetup: boolean;
  classes: ClassItem[];
  tutors: Tutor[];
  requests: TutorRequest[];
  posts: Post[];
  prices: PriceItem[];
  submissions: SubmissionRecord[];
};

type TutorSuggestion = {
  summary: string;
  suggestions: Array<{
    id: string;
    code: string;
    name: string;
    level: string;
    subjects: string[];
    areas: string[];
    availableTimes: string[];
    expectedSalary: string;
    score: number;
    reasons: string[];
  }>;
  note: string;
};

const fallbackState: AdminState = {
  needsSetup: false,
  classes: initialClasses.slice(0, 12),
  tutors: initialTutors.slice(0, 12),
  requests: [],
  posts: initialPosts.slice(0, 8),
  prices: initialPrices,
  submissions: [],
};

const sectionTitle: Record<AdminSection, string> = {
  dashboard: "Tổng quan",
  classes: "Quản lý lớp mới",
  tutors: "Quản lý gia sư",
  requests: "Yêu cầu & liên hệ",
  applications: "Duyệt ứng viên gia sư",
  pricing: "Quản lý bảng giá",
  posts: "Quản lý bài viết",
  assistant: "Trợ lý thông minh",
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
      <main className="min-w-0 p-3 sm:p-6 lg:p-8">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[.16em] text-primary-600">Gia Sư Tài Năng</span>
            <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{sectionTitle[section]}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Mọi thay đổi được lưu tự động và sẽ hiển thị trên website.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadState} className="button-secondary h-11 px-4" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Cập nhật dữ liệu
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
              setMessage(error instanceof Error ? error.message : "Chưa thể chuẩn bị dữ liệu. Vui lòng thử lại.");
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
            {section === "applications" && <TutorApplicationManager items={state.submissions.filter((item) => item.type === "tutor_application")} onRefresh={loadState} />}
            {section === "pricing" && <PriceManager items={state.prices} onRefresh={loadState} />}
            {section === "posts" && <PostManager items={state.posts} onRefresh={loadState} />}
            {section === "assistant" && <AdminAiTools />}
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
          <ShieldCheck className="h-7 w-7" />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-[.16em] text-primary-600">Khu vực quản lý</p>
        <h1 className="mt-2 text-2xl font-extrabold text-ink">Đăng nhập quản lý</h1>
        <p className="mt-2 text-sm text-slate-500">
          Nhập mật khẩu để xem và cập nhật thông tin trên website.
        </p>
        {error && <Notice tone="error" className="mt-5">{error}</Notice>}
        <label className="mt-6 block">
          <span className="text-xs font-bold text-slate-600">Mật khẩu quản lý</span>
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
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-ink">Dữ liệu chưa sẵn sàng</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bấm nút dưới đây để chuẩn bị thông tin ban đầu. Sau đó bạn có thể thêm, sửa và xoá lớp mới, gia sư, bài viết và các yêu cầu liên hệ.
          </p>
          <button type="button" onClick={() => void onSetup()} className="button-primary mt-5" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Chuẩn bị dữ liệu ban đầu
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
  const [classPost, setClassPost] = useState("");
  const [preparingPostFor, setPreparingPostFor] = useState("");
  const visible = statusFilter ? items.filter((item) => item.status === statusFilter) : items;
  const openEditor = (item: ClassItem) => { setEditing(item); revealEditor("class-editor"); };

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

  const prepareClassPost = async (item: ClassItem) => {
    setPreparingPostFor(item.id); setMessage("");
    try {
      const result = await apiRequest<{ content: string }>(`/api/admin/ai/class-post/${encodeURIComponent(item.id)}`, { method: "POST" });
      setClassPost(result.content);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chưa thể soạn bài đăng.");
    } finally { setPreparingPostFor(""); }
  };

  return (
    <ManagerShell
      onAdd={() => openEditor(makeClassDraft())}
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
      {classPost && <TextResultPanel title="Bài đăng tuyển gia sư" text={classPost} onClose={() => setClassPost("")} onCopied={() => setMessage("Đã sao chép bài đăng.")} />}
      {editing && (
        <ClassForm
          key={editing.id}
          value={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSubmit={(item) => void saveClass(item)}
        />
      )}
      <AdminTable headers={["Mã lớp", "Tên lớp", "Khu vực", "Lương", "Trạng thái", "Soạn bài", "Thao tác"]}>
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
            <Cell><button type="button" onClick={() => void prepareClassPost(item)} disabled={Boolean(preparingPostFor)} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 disabled:opacity-60">{preparingPostFor === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Soạn bài</button></Cell>
            <Actions onEdit={() => openEditor(item)} onDelete={() => void deleteClass(item)} disabled={saving} />
          </tr>
        ))}
        {visible.length === 0 && <EmptyRow colSpan={7} text="Chưa có lớp phù hợp với bộ lọc." />}
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
      id="class-editor"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="mb-5 scroll-mt-28 rounded-2xl border border-primary-100 bg-white p-5 shadow-card lg:scroll-mt-6"
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
  const [editing, setEditing] = useState<Tutor | null>(null);
  const [saving, setSaving] = useState(false);
  const [auditing, setAuditing] = useState("");
  const [audit, setAudit] = useState<{ score: number; issues: string[]; strengths: string[]; summary: string } | null>(null);
  const normalized = keyword.toLocaleLowerCase("vi");
  const visible = items.filter((item) => !normalized || `${item.name} ${item.subjects.join(" ")} ${item.areas.join(" ")}`.toLocaleLowerCase("vi").includes(normalized));
  const openEditor = (item: Tutor) => { setEditing(item); revealEditor("tutor-editor"); };

  const saveTutor = async (tutor: Tutor) => {
    setSaving(true);
    setMessage("");
    const exists = items.some((item) => item.id === tutor.id);
    try {
      await apiRequest<{ success: boolean }>(
        exists ? `/api/admin/tutors/${encodeURIComponent(tutor.id)}` : "/api/admin/tutors",
        { method: exists ? "PUT" : "POST", body: JSON.stringify(tutor) },
      );
      setEditing(null);
      await onRefresh();
      setMessage(exists ? "Đã cập nhật thông tin gia sư." : "Đã thêm gia sư mới.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chưa thể lưu thông tin gia sư.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Tutor) => {
    setSaving(true);
    setMessage("");
    try {
      await apiRequest<{ success: boolean }>(`/api/admin/tutors/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      await onRefresh();
      setMessage("Đã xóa gia sư.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chưa thể xóa gia sư.");
    } finally {
      setSaving(false);
    }
  };

  const auditProfile = async (item: Tutor) => {
    setAuditing(item.id); setMessage("");
    try {
      setAudit(await apiRequest<{ score: number; issues: string[]; strengths: string[]; summary: string }>(`/api/admin/ai/tutor-audit/${encodeURIComponent(item.id)}`, { method: "POST" }));
    } catch (error) { setMessage(error instanceof Error ? error.message : "Chưa thể kiểm tra hồ sơ."); }
    finally { setAuditing(""); }
  };

  return (
    <ManagerShell
      onAdd={() => openEditor(makeTutorDraft())}
      label="Thêm gia sư"
      toolbar={<input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Lọc môn hoặc khu vực..." className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm sm:w-64" />}
    >
      {message && <Notice tone={message.includes("Không") ? "error" : "success"} className="mb-4">{message}</Notice>}
      {audit && <TutorAuditPanel value={audit} onClose={() => setAudit(null)} />}
      {editing && (
        <TutorForm
          key={editing.id}
          value={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSubmit={(tutor) => void saveTutor(tutor)}
        />
      )}
      <AdminTable headers={["Mã", "Họ tên", "Trình độ", "Môn dạy", "Đánh giá", "Kiểm tra", "Thao tác"]}>
        {visible.map((item) => (
          <tr key={item.id}>
            <Cell strong>{item.code}</Cell>
            <Cell>{item.name}</Cell>
            <Cell>{item.level}</Cell>
            <Cell>{item.subjects.join(", ")}</Cell>
            <Cell>{item.rating}</Cell>
            <Cell><button type="button" onClick={() => void auditProfile(item)} disabled={Boolean(auditing)} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 disabled:opacity-60">{auditing === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Kiểm tra</button></Cell>
            <Actions onEdit={() => openEditor(item)} onDelete={() => void remove(item)} disabled={saving} />
          </tr>
        ))}
        {visible.length === 0 && <EmptyRow colSpan={7} text="Chưa có hồ sơ gia sư phù hợp." />}
      </AdminTable>
    </ManagerShell>
  );
}

function TutorForm({
  value,
  saving,
  onCancel,
  onSubmit,
}: {
  value: Tutor;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (tutor: Tutor) => void;
}) {
  const [form, setForm] = useState<Tutor>(value);
  const update = <K extends keyof Tutor>(key: K, next: Tutor[K]) => setForm((current) => ({ ...current, [key]: next }));
  const updateList = (key: "subjects" | "grades" | "areas" | "availableTimes" | "achievements", value: string) => update(key, splitList(value));

  return (
    <form
      id="tutor-editor"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="mb-5 scroll-mt-28 rounded-2xl border border-primary-100 bg-white p-5 shadow-card lg:scroll-mt-6"
    >
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-extrabold text-ink">{value.id.startsWith("new-") ? "Thêm gia sư mới" : `Chỉnh sửa ${value.name}`}</h2>
        <p className="text-sm text-slate-500">Điền thông tin bên dưới rồi bấm lưu. Hồ sơ sẽ xuất hiện trong danh sách gia sư trên website.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Input label="Mã gia sư" value={form.code} onChange={(next) => update("code", next)} required />
        <Input label="Họ và tên" value={form.name} onChange={(next) => update("name", next)} required />
        <Input label="Năm sinh" type="number" value={String(form.birthYear)} onChange={(next) => update("birthYear", Number(next))} required />
        <Select label="Giới tính" value={form.gender} onChange={(next) => update("gender", next as Tutor["gender"])}>
          <option value="Nam">Nam</option><option value="Nữ">Nữ</option>
        </Select>
        <Select label="Trình độ" value={form.level} onChange={(next) => update("level", next as Tutor["level"])}>
          <option value="Sinh viên">Sinh viên</option><option value="Giáo viên">Giáo viên</option><option value="Cử nhân">Cử nhân</option><option value="Thạc sĩ">Thạc sĩ</option>
        </Select>
        <Input label="Trường / đơn vị" value={form.school} onChange={(next) => update("school", next)} required />
        <Input label="Chuyên ngành" value={form.major} onChange={(next) => update("major", next)} required />
        <Input label="Môn có thể dạy (ngăn cách bằng dấu phẩy)" value={form.subjects.join(", ")} onChange={(next) => updateList("subjects", next)} required />
        <Input label="Lớp có thể dạy (ngăn cách bằng dấu phẩy)" value={form.grades.join(", ")} onChange={(next) => updateList("grades", next)} required />
        <Input label="Khu vực có thể dạy (ngăn cách bằng dấu phẩy)" value={form.areas.join(", ")} onChange={(next) => updateList("areas", next)} required />
        <Input label="Thời gian có thể dạy (ngăn cách bằng dấu phẩy)" value={form.availableTimes.join(", ")} onChange={(next) => updateList("availableTimes", next)} required className="xl:col-span-2" />
        <Input label="Mức học phí mong muốn / buổi" value={form.expectedSalary} onChange={(next) => update("expectedSalary", next)} required />
        <Textarea label="Kinh nghiệm giảng dạy" value={form.experience} onChange={(next) => update("experience", next)} required className="md:col-span-2" />
        <Textarea label="Thành tích nổi bật (ngăn cách bằng dấu phẩy)" value={form.achievements.join(", ")} onChange={(next) => updateList("achievements", next)} className="md:col-span-2" />
        <Textarea label="Phong cách giảng dạy" value={form.teachingStyle} onChange={(next) => update("teachingStyle", next)} required className="md:col-span-2 xl:col-span-3" />
      </div>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="button-secondary justify-center" disabled={saving}>Hủy</button>
        <button type="submit" className="button-primary justify-center" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Lưu gia sư
        </button>
      </div>
    </form>
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
  const [suggestion, setSuggestion] = useState<TutorSuggestion | null>(null);
  const [suggestionFor, setSuggestionFor] = useState("");
  const [zaloDraft, setZaloDraft] = useState("");
  const [zaloPhone, setZaloPhone] = useState("");
  const [zaloFor, setZaloFor] = useState("");
  const otherSubmissions = submissions.filter((item) => item.type !== "tutor_application");

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

  const getSuggestion = async (item: TutorRequest) => {
    setSuggestionFor(item.id);
    setMessage("");
    try {
      const result = await apiRequest<TutorSuggestion>(`/api/admin/ai/request/${encodeURIComponent(item.id)}`, { method: "POST" });
      setSuggestion(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chưa thể tạo gợi ý. Vui lòng thử lại.");
    } finally {
      setSuggestionFor("");
    }
  };

  const prepareZalo = async (item: TutorRequest) => {
    setZaloFor(item.id); setMessage("");
    try {
      const result = await apiRequest<{ message: string; phone: string }>(`/api/admin/ai/zalo/${encodeURIComponent(item.id)}`, { method: "POST" });
      setZaloDraft(result.message); setZaloPhone(result.phone);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Chưa thể soạn tin nhắn."); }
    finally { setZaloFor(""); }
  };

  return (
    <div className="space-y-6">
      {message && <Notice tone={message.includes("Không") ? "error" : "success"}>{message}</Notice>}
      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink">Yêu cầu tìm gia sư</h2>
            <p className="mt-1 text-sm text-slate-500">Bấm “Gợi ý ghép” để xem hồ sơ phù hợp và phần tóm tắt nhanh.</p>
          </div>
        </div>
        {suggestion && <SuggestionPanel value={suggestion} onClose={() => setSuggestion(null)} />}
        {zaloDraft && <TextResultPanel title={`Tin nhắn tư vấn · ${zaloPhone}`} text={zaloDraft} onClose={() => setZaloDraft("")} onCopied={() => setMessage("Đã sao chép tin nhắn Zalo.")} />}
        <AdminTable headers={["Mã", "Phụ huynh", "Điện thoại / Zalo", "Nhu cầu & địa chỉ", "Ngày gửi", "Trạng thái", "Gợi ý"]}>
          {items.map((item) => (
            <tr key={item.id}>
              <Cell strong>{shortId(item.id)}</Cell>
              <Cell>{item.parentName}</Cell>
              <Cell>{item.phone}</Cell>
              <Cell>
                <span className="block">{item.grade} · {item.subjects.join(", ")}</span>
                <span className="mt-1 block max-w-xs text-xs leading-5 text-slate-500">{item.address || item.area}</span>
              </Cell>
              <Cell>{formatDate(item.createdAt)}</Cell>
              <Cell>
                <select value={item.status} onChange={(event) => void updateStatus(item, event.target.value as TutorRequest["status"])} className="rounded-lg border p-2 text-xs">
                  <option value="new">Mới</option>
                  <option value="called">Đã gọi</option>
                  <option value="matched">Đã ghép</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </Cell>
              <Cell><div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => void getSuggestion(item)}
                  disabled={suggestionFor === item.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100 disabled:opacity-60"
                >
                  {suggestionFor === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {suggestionFor === item.id ? "Đang chuẩn bị" : "Gợi ý ghép"}
                </button>
                <button type="button" onClick={() => void prepareZalo(item)} disabled={Boolean(zaloFor)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 disabled:opacity-60">{zaloFor === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Soạn tin Zalo</button>
              </div></Cell>
            </tr>
          ))}
          {items.length === 0 && <EmptyRow colSpan={7} text="Chưa có yêu cầu tìm gia sư mới." />}
        </AdminTable>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-extrabold text-ink">Đăng ký nhận lớp và liên hệ</h2>
        <AdminTable headers={["Loại", "Tên", "Điện thoại", "Email", "Mã lớp", "Ngày gửi"]}>
          {otherSubmissions.map((item) => (
            <tr key={item.id}>
              <Cell strong>{submissionLabel(item.type)}</Cell>
              <Cell>{item.name || getPayloadText(item.payload, "parentName") || "Chưa có tên"}</Cell>
              <Cell>{item.phone}</Cell>
              <Cell>{item.email || "—"}</Cell>
              <Cell>{item.reference_code || getPayloadText(item.payload, "classCode") || "—"}</Cell>
              <Cell>{formatDate(item.created_at)}</Cell>
            </tr>
          ))}
          {otherSubmissions.length === 0 && <EmptyRow colSpan={6} text="Chưa có đăng ký nhận lớp hoặc liên hệ mới." />}
        </AdminTable>
      </section>
    </div>
  );
}

function TutorApplicationManager({ items, onRefresh }: { items: SubmissionRecord[]; onRefresh: () => Promise<void> }) {
  const [selectedApplication, setSelectedApplication] = useState<SubmissionRecord | null>(null);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const visible = statusFilter ? items.filter((item) => item.status === statusFilter) : items;

  const updateApplication = async (item: SubmissionRecord, status: string, adminNote: string) => {
    await apiRequest<{ success: boolean }>(`/api/admin/submissions/${encodeURIComponent(item.id)}`, {
      method: "PATCH", body: JSON.stringify({ status, adminNote }),
    });
    await onRefresh();
    setSelectedApplication((current) => current?.id === item.id ? { ...current, status, admin_note: adminNote } : current);
    setMessage("Đã cập nhật hồ sơ ứng viên.");
  };

  const approveApplication = async (item: SubmissionRecord, adminNote: string) => {
    if (item.admin_note !== adminNote) {
      await apiRequest<{ success: boolean }>(`/api/admin/submissions/${encodeURIComponent(item.id)}`, {
        method: "PATCH", body: JSON.stringify({ status: "reviewing", adminNote }),
      });
    }
    const result = await apiRequest<{ success: boolean; code: string; alreadyApproved?: boolean }>(`/api/admin/submissions/${encodeURIComponent(item.id)}/approve`, { method: "POST" });
    await onRefresh();
    setSelectedApplication(null);
    setMessage(result.alreadyApproved ? `Hồ sơ đã được duyệt trước đó với mã ${result.code}.` : `Đã duyệt và tạo hồ sơ gia sư ${result.code}.`);
  };

  return (
    <div>
      {message && <Notice>{message}</Notice>}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 className="text-lg font-extrabold text-ink">Hồ sơ ứng tuyển gia sư</h2><p className="mt-1 text-sm text-slate-500">Xem thông tin, ghi chú và duyệt ứng viên trước khi hồ sơ xuất hiện công khai.</p></div>
        <label className="text-xs font-bold text-slate-600"><span className="mb-2 block">Lọc trạng thái</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm sm:w-52"><option value="">Tất cả hồ sơ</option><option value="new">Mới</option><option value="reviewing">Đang xem</option><option value="needs_info">Cần bổ sung</option><option value="approved">Đã duyệt</option><option value="rejected">Từ chối</option></select></label>
      </div>
      <AdminTable headers={["Ứng viên", "Học vấn", "Nhận dạy", "Ngày gửi", "Trạng thái", "Xử lý"]}>
        {visible.map((item) => (
          <tr key={item.id}>
            <Cell strong><span className="block">{item.name || "Chưa có tên"}</span><span className="mt-1 block font-normal text-slate-500">{item.phone}</span></Cell>
            <Cell><span className="block">{getPayloadText(item.payload, "school") || "Chưa cập nhật trường"}</span><span className="mt-1 block text-slate-500">{getPayloadText(item.payload, "major")}</span></Cell>
            <Cell>{getPayloadList(item.payload, "subjects").join(", ") || "Chưa cập nhật"}</Cell>
            <Cell>{formatDate(item.created_at)}</Cell>
            <Cell><ApplicationStatus status={item.status} /></Cell>
            <Cell><button type="button" onClick={() => setSelectedApplication(item)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-50 px-3 text-xs font-bold text-primary-700 transition hover:bg-primary-100"><Eye className="h-4 w-4" /> Xem hồ sơ</button></Cell>
          </tr>
        ))}
        {visible.length === 0 && <EmptyRow colSpan={6} text={items.length ? "Không có hồ sơ ở trạng thái này." : "Chưa có hồ sơ ứng tuyển gia sư."} />}
      </AdminTable>
      {selectedApplication && <TutorApplicationDialog key={selectedApplication.id} item={selectedApplication} onClose={() => setSelectedApplication(null)} onUpdate={updateApplication} onApprove={approveApplication} />}
    </div>
  );
}

const applicationStatusMap: Record<string, { label: string; className: string }> = {
  new: { label: "Mới", className: "bg-blue-50 text-blue-700" },
  reviewing: { label: "Đang xem", className: "bg-amber-50 text-amber-700" },
  needs_info: { label: "Cần bổ sung", className: "bg-orange-50 text-orange-700" },
  approved: { label: "Đã duyệt", className: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Từ chối", className: "bg-rose-50 text-rose-700" },
};

function ApplicationStatus({ status }: { status: string }) {
  const value = applicationStatusMap[status] ?? applicationStatusMap.new;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${value.className}`}>{value.label}</span>;
}

function TutorApplicationDialog({
  item,
  onClose,
  onUpdate,
  onApprove,
}: {
  item: SubmissionRecord;
  onClose: () => void;
  onUpdate: (item: SubmissionRecord, status: string, note: string) => Promise<void>;
  onApprove: (item: SubmissionRecord, note: string) => Promise<void>;
}) {
  const [note, setNote] = useState(item.admin_note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmReject, setConfirmReject] = useState(false);
  const run = async (action: () => Promise<void>) => {
    setSaving(true); setError("");
    try { await action(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Chưa thể cập nhật hồ sơ."); }
    finally { setSaving(false); }
  };
  const fields = [
    ["Họ tên", item.name || getPayloadText(item.payload, "fullName")],
    ["Điện thoại / Zalo", item.phone],
    ["Email", item.email || "Chưa cung cấp"],
    ["Năm sinh", getPayloadText(item.payload, "birthYear")],
    ["Giới tính", getPayloadText(item.payload, "gender")],
    ["Nghề nghiệp", getPayloadText(item.payload, "occupation")],
    ["Trường / đơn vị", getPayloadText(item.payload, "school")],
    ["Chuyên ngành", getPayloadText(item.payload, "major")],
    ["Mức phí mong muốn", getPayloadText(item.payload, "minimumSalary")],
  ];
  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="ho-so-ung-vien">
      <section className="flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div><div className="flex flex-wrap items-center gap-2"><h2 id="ho-so-ung-vien" className="text-lg font-extrabold text-ink">Hồ sơ {item.name || "ứng viên"}</h2><ApplicationStatus status={item.status} /></div><p className="mt-1 text-xs text-slate-500">Gửi ngày {formatDate(item.created_at)}{item.reference_code ? ` · Mã gia sư ${item.reference_code}` : ""}</p></div>
          <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-600" aria-label="Đóng">×</button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {error && <Notice tone="error">{error}</Notice>}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-700">{value || "Chưa cung cấp"}</p></div>)}</div>
          <ApplicationList label="Môn có thể dạy" values={getPayloadList(item.payload, "subjects")} />
          <ApplicationList label="Lớp có thể dạy" values={getPayloadList(item.payload, "grades")} />
          <ApplicationList label="Khu vực nhận lớp" values={getPayloadList(item.payload, "areas")} />
          <ApplicationList label="Thời gian có thể dạy" values={getPayloadList(item.payload, "availableTimes")} />
          <div className="mt-4 grid gap-4 md:grid-cols-2"><ApplicationText label="Kinh nghiệm" value={getPayloadText(item.payload, "experience")} /><ApplicationText label="Chia sẻ thêm" value={getPayloadText(item.payload, "note")} /></div>
          <label className="mt-5 block"><span className="text-sm font-extrabold text-ink">Ghi chú nội bộ</span><span className="mt-1 block text-xs text-slate-500">Chỉ người quản trị nhìn thấy nội dung này.</span><textarea value={note} onChange={(event) => setNote(event.target.value.slice(0, 2000))} rows={3} placeholder="Ví dụ: Đã gọi xác minh trường học, cần bổ sung ảnh thẻ..." className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100" /></label>
        </div>
        <footer className="shrink-0 border-t bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-4">
          {confirmReject ? <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-semibold text-rose-700">Xác nhận từ chối hồ sơ này?</p><div className="flex gap-2"><button type="button" onClick={() => setConfirmReject(false)} className="button-secondary min-h-11 flex-1 px-4 py-2">Quay lại</button><button type="button" disabled={saving} onClick={() => void run(() => onUpdate(item, "rejected", note).then(() => onClose()))} className="min-h-11 flex-1 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white disabled:opacity-60">Xác nhận từ chối</button></div></div> : <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end"><button type="button" disabled={saving} onClick={() => void run(() => onUpdate(item, item.status, note))} className="button-secondary min-h-11 px-3 py-2">Lưu ghi chú</button><button type="button" disabled={saving} onClick={() => void run(() => onUpdate(item, "needs_info", note))} className="min-h-11 rounded-xl bg-orange-50 px-3 text-sm font-bold text-orange-700 disabled:opacity-60">Cần bổ sung</button><button type="button" disabled={saving || item.status === "approved"} onClick={() => setConfirmReject(true)} className="min-h-11 rounded-xl bg-rose-50 px-3 text-sm font-bold text-rose-700 disabled:opacity-50">Từ chối</button><button type="button" disabled={saving || item.status === "approved"} onClick={() => void run(() => onApprove(item, note))} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />} {item.status === "approved" ? "Đã duyệt" : "Duyệt hồ sơ"}</button></div>}
        </footer>
      </section>
    </div>
  );
}

function ApplicationList({ label, values }: { label: string; values: string[] }) {
  return <div className="mt-4"><h3 className="text-xs font-extrabold text-slate-500">{label}</h3><div className="mt-2 flex flex-wrap gap-2">{values.length ? values.map((value) => <span key={value} className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">{value}</span>) : <span className="text-sm text-slate-400">Chưa cung cấp</span>}</div></div>;
}

function ApplicationText({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-100 p-4"><h3 className="text-xs font-extrabold text-slate-500">{label}</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{value || "Chưa cung cấp"}</p></div>;
}

function SuggestionPanel({ value, onClose }: { value: TutorSuggestion; onClose: () => void }) {
  return (
    <section className="mb-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-extrabold text-violet-800"><Sparkles className="h-4 w-4" /> Gợi ý ghép gia sư</p>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">{value.summary}</p>
        </div>
        <button type="button" onClick={onClose} className="text-xs font-bold text-slate-500 hover:text-slate-900">Đóng</button>
      </div>
      {value.suggestions.length ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {value.suggestions.map((tutor) => (
            <article key={tutor.id} className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-primary-600">{tutor.code}</p>
              <h3 className="mt-1 font-extrabold text-ink">{tutor.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{tutor.level} · {tutor.subjects.join(", ")}</p>
              <p className="mt-2 text-xs text-slate-600">{tutor.reasons.join(" · ")}</p>
              <p className="mt-2 text-xs font-bold text-accent-600">{tutor.expectedSalary}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600">Chưa tìm thấy hồ sơ khớp điều kiện hiện có. Bạn có thể nới rộng khu vực hoặc thêm gia sư mới.</p>
      )}
      <p className="mt-4 text-xs leading-5 text-slate-500">{value.note}</p>
    </section>
  );
}

function TextResultPanel({ title, text, onClose, onCopied }: { title: string; text: string; onClose: () => void; onCopied: () => void }) {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    onCopied();
  };
  return (
    <section className="mb-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
      <div className="flex items-center justify-between gap-4"><p className="flex items-center gap-2 text-sm font-extrabold text-violet-800"><Sparkles className="h-4 w-4" /> {title}</p><button type="button" onClick={onClose} className="text-xs font-bold text-slate-500">Đóng</button></div>
      <p className="mt-3 whitespace-pre-line rounded-xl bg-white p-4 text-sm leading-7 text-slate-700">{text}</p>
      <button type="button" onClick={() => void copy()} className="button-secondary mt-3"><Copy className="h-4 w-4" /> Sao chép nội dung</button>
    </section>
  );
}

function TutorAuditPanel({ value, onClose }: { value: { score: number; issues: string[]; strengths: string[]; summary: string }; onClose: () => void }) {
  return (
    <section className="mb-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
      <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold text-violet-800">Mức hoàn thiện hồ sơ: {value.score}/100</p><p className="mt-2 text-sm leading-6 text-slate-700">{value.summary}</p></div><button type="button" onClick={onClose} className="text-xs font-bold text-slate-500">Đóng</button></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-white p-4"><h3 className="text-sm font-extrabold text-emerald-700">Thông tin đã tốt</h3><ul className="mt-2 space-y-1 text-sm text-slate-600">{value.strengths.length ? value.strengths.map((item) => <li key={item}>• {item}</li>) : <li>Chưa có mục nổi bật.</li>}</ul></div><div className="rounded-xl bg-white p-4"><h3 className="text-sm font-extrabold text-amber-700">Nên bổ sung</h3><ul className="mt-2 space-y-1 text-sm text-slate-600">{value.issues.length ? value.issues.map((item) => <li key={item}>• {item}</li>) : <li>Hồ sơ đã đủ thông tin cơ bản.</li>}</ul></div></div>
    </section>
  );
}

function PriceManager({ items, onRefresh }: { items: PriceItem[]; onRefresh: () => Promise<void> }) {
  const [editing, setEditing] = useState<PriceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const openEditor = (item: PriceItem) => { setEditing(item); revealEditor("price-editor"); };
  const [message, setMessage] = useState("");

  const savePrice = async (item: PriceItem) => {
    if (!item.studentTutorPrice.trim() && !item.teacherTutorPrice.trim()) {
      setMessage("Cần nhập ít nhất một mức giá sinh viên hoặc giáo viên.");
      return;
    }
    setSaving(true);
    setMessage("");
    const exists = items.some((entry) => entry.id === item.id);
    try {
      await apiRequest<{ success: boolean }>(
        exists ? `/api/admin/prices/${encodeURIComponent(item.id)}` : "/api/admin/prices",
        { method: exists ? "PUT" : "POST", body: JSON.stringify(item) },
      );
      setEditing(null);
      await onRefresh();
      setMessage(exists ? "Đã cập nhật mức học phí." : "Đã thêm mức học phí mới.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chưa thể lưu mức học phí.");
    } finally {
      setSaving(false);
    }
  };

  const removePrice = async (item: PriceItem) => {
    setSaving(true);
    setMessage("");
    try {
      await apiRequest<{ success: boolean }>(`/api/admin/prices/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      await onRefresh();
      setMessage("Đã xóa mức học phí.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chưa thể xóa mức học phí.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ManagerShell onAdd={() => openEditor(makePriceDraft())} label="Thêm mức giá">
      {message && <Notice tone={message.startsWith("Đã") ? "success" : "error"} className="mb-4">{message}</Notice>}
      {editing && (
        <PriceForm
          key={editing.id}
          value={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSubmit={(item) => void savePrice(item)}
        />
      )}
      <AdminTable headers={["Nhóm học", "Môn / cấp học", "Gia sư sinh viên", "Gia sư giáo viên", "Lịch học", "Thao tác"]}>
        {items.map((item) => (
          <tr key={item.id}>
            <Cell strong>{item.category}</Cell>
            <Cell>{item.subjectOrGrade}</Cell>
            <Cell>{item.studentTutorPrice || "—"}</Cell>
            <Cell>{item.teacherTutorPrice || "—"}</Cell>
            <Cell>{item.sessionsPerWeek} · {item.duration}</Cell>
            <Actions onEdit={() => openEditor(item)} onDelete={() => void removePrice(item)} disabled={saving} />
          </tr>
        ))}
        {items.length === 0 && <EmptyRow colSpan={6} text="Chưa có mức học phí nào." />}
      </AdminTable>
    </ManagerShell>
  );
}

function PriceForm({
  value,
  saving,
  onCancel,
  onSubmit,
}: {
  value: PriceItem;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (item: PriceItem) => void;
}) {
  const [form, setForm] = useState<PriceItem>(value);
  const update = <K extends keyof PriceItem>(key: K, next: PriceItem[K]) => setForm((current) => ({ ...current, [key]: next }));

  return (
    <form
      id="price-editor"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="mb-5 scroll-mt-28 rounded-2xl border border-primary-100 bg-white p-5 shadow-card lg:scroll-mt-6"
    >
      <div className="mb-4">
        <h2 className="text-lg font-extrabold text-ink">{value.id.startsWith("new-") ? "Thêm mức giá mới" : `Sửa giá ${value.category}`}</h2>
        <p className="mt-1 text-sm text-slate-500">Sau khi lưu, mức giá mới sẽ hiển thị trên trang bảng giá và trang chủ.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Input label="Nhóm học / dịch vụ" value={form.category} onChange={(next) => update("category", next)} required />
        <Input label="Môn học / cấp học" value={form.subjectOrGrade} onChange={(next) => update("subjectOrGrade", next)} required className="xl:col-span-2" />
        <Input label="Giá gia sư sinh viên" value={form.studentTutorPrice} onChange={(next) => update("studentTutorPrice", next)} />
        <Input label="Giá gia sư giáo viên" value={form.teacherTutorPrice} onChange={(next) => update("teacherTutorPrice", next)} />
        <Input label="Số buổi mỗi tuần" value={form.sessionsPerWeek} onChange={(next) => update("sessionsPerWeek", next)} required />
        <Input label="Thời lượng mỗi buổi" value={form.duration} onChange={(next) => update("duration", next)} required />
        <Textarea label="Ghi chú" value={form.note ?? ""} onChange={(next) => update("note", next)} className="md:col-span-2 xl:col-span-3" />
      </div>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="button-secondary justify-center" disabled={saving}>Hủy</button>
        <button type="submit" className="button-primary justify-center" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Lưu bảng giá
        </button>
      </div>
    </form>
  );
}

function PostManager({ items, onRefresh }: { items: Post[]; onRefresh: () => Promise<void> }) {
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const openEditor = (item: Post) => { setEditing(item); revealEditor("post-editor"); };

  const savePost = async (item: Post) => {
    setSaving(true);
    setMessage("");
    const exists = items.some((entry) => entry.id === item.id);
    const post = { ...item, slug: item.slug || createSlug(item.title) };
    try {
      await apiRequest<{ success: boolean }>(exists ? `/api/admin/posts/${encodeURIComponent(item.id)}` : "/api/admin/posts", {
        method: exists ? "PUT" : "POST",
        body: JSON.stringify(post),
      });
      setEditing(null);
      await onRefresh();
      setMessage(exists ? "Đã cập nhật bài viết." : "Đã đăng bài viết mới.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chưa thể lưu bài viết.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Post) => {
    setSaving(true);
    setMessage("");
    try {
      await apiRequest<{ success: boolean }>(`/api/admin/posts/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      await onRefresh();
      setMessage("Đã xóa bài viết.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chưa thể xóa bài viết.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ManagerShell onAdd={() => openEditor(makePostDraft())} label="Thêm bài viết">
      {message && <Notice tone={message.startsWith("Đã") ? "success" : "error"} className="mb-4">{message}</Notice>}
      {editing && <PostForm key={editing.id} value={editing} saving={saving} onCancel={() => setEditing(null)} onSubmit={(item) => void savePost(item)} />}
      <AdminTable headers={["Tiêu đề", "Danh mục", "Ngày", "Thao tác"]}>
        {items.map((item) => (
          <tr key={item.id}>
            <Cell strong>{item.title}</Cell>
            <Cell>{item.category}</Cell>
            <Cell>{item.date}</Cell>
            <Actions onEdit={() => openEditor(item)} onDelete={() => void remove(item)} disabled={saving} />
          </tr>
        ))}
        {items.length === 0 && <EmptyRow colSpan={4} text="Chưa có bài viết nào." />}
      </AdminTable>
    </ManagerShell>
  );
}

function PostForm({ value, saving, onCancel, onSubmit }: { value: Post; saving: boolean; onCancel: () => void; onSubmit: (item: Post) => void }) {
  const [form, setForm] = useState<Post>(value);
  const update = <K extends keyof Post>(key: K, next: Post[K]) => setForm((current) => ({ ...current, [key]: next }));
  return (
    <form id="post-editor" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }} className="mb-5 scroll-mt-28 rounded-2xl border border-primary-100 bg-white p-5 shadow-card lg:scroll-mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-extrabold text-ink">{value.id.startsWith("new-") ? "Viết bài mới" : "Chỉnh sửa bài viết"}</h2>
        <p className="mt-1 text-sm text-slate-500">Điền đủ tiêu đề, phần giới thiệu và nội dung trước khi lưu.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Tiêu đề bài viết" value={form.title} onChange={(next) => update("title", next)} required className="md:col-span-2" />
        <Input label="Danh mục" value={form.category} onChange={(next) => update("category", next)} required />
        <Input label="Ngày đăng" value={form.date} onChange={(next) => update("date", next)} required />
        <Textarea label="Giới thiệu ngắn" value={form.excerpt} onChange={(next) => update("excerpt", next)} required className="md:col-span-2" />
        <Textarea label="Nội dung bài viết" value={form.content} onChange={(next) => update("content", next)} required className="md:col-span-2" />
      </div>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="button-secondary justify-center" disabled={saving}>Hủy</button>
        <button type="submit" className="button-primary justify-center" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Lưu bài viết</button>
      </div>
    </form>
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
          <button type="button" onClick={onAdd} className="button-primary w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            {label}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function revealEditor(id: string) {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const editor = document.getElementById(id);
      if (!editor) return;
      editor.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        editor.querySelector<HTMLElement>("input:not([type='hidden']), select, textarea")?.focus({ preventScroll: true });
      }, 450);
    });
  });
}

function AdminTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <p className="border-b border-slate-100 bg-primary-50 px-4 py-2 text-[11px] font-semibold text-primary-700 sm:hidden">Vuốt ngang bảng để xem đầy đủ thông tin →</p>
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-100 text-xs text-slate-500">
            <tr>{headers.map((header, index) => <th key={header} className={`px-4 py-3 font-bold ${index === 0 ? "sticky left-0 z-10 bg-slate-100" : ""}`}>{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return <td className={`px-4 py-3 text-xs ${strong ? "sticky left-0 z-[5] bg-white font-bold text-ink" : "text-slate-600"}`}>{children}</td>;
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-slate-500">{text}</td></tr>;
}

function Actions({ onEdit, onDelete, disabled = false }: { onEdit: () => void; onDelete: () => void; disabled?: boolean }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <td className="px-4 py-3">
      <div className="flex gap-2">
        <button type="button" onClick={onEdit} aria-label="Sửa" disabled={disabled} className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 disabled:opacity-50 sm:h-9 sm:w-9">
          <Edit3 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setConfirming(true)} aria-label="Xóa" disabled={disabled} className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-600 disabled:opacity-50 sm:h-9 sm:w-9">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {confirming && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="xac-nhan-xoa">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle className="h-6 w-6" /></span>
            <h2 id="xac-nhan-xoa" className="mt-4 text-lg font-extrabold text-ink">Xác nhận xóa?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Thông tin đã xóa sẽ không còn hiển thị trên website.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConfirming(false)} className="button-secondary min-h-11 px-4 py-2">Giữ lại</button>
              <button type="button" onClick={() => { setConfirming(false); onDelete(); }} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
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
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
      />
    </Field>
  );
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

function makeTutorDraft(): Tutor {
  const stamp = Date.now().toString().slice(-6);
  return {
    id: `new-${crypto.randomUUID()}`,
    code: `GST-${stamp}`,
    name: "",
    birthYear: 2000,
    gender: "Nam",
    avatar: "",
    school: "",
    major: "",
    level: "Sinh viên",
    subjects: [],
    grades: [],
    areas: [],
    availableTimes: [],
    experience: "",
    achievements: [],
    teachingStyle: "",
    expectedSalary: "",
    rating: 5,
    reviewCount: 0,
  };
}

function makePriceDraft(): PriceItem {
  return {
    id: `new-${crypto.randomUUID()}`,
    category: "",
    subjectOrGrade: "",
    studentTutorPrice: "",
    teacherTutorPrice: "",
    sessionsPerWeek: "2-3 buổi",
    duration: "90 phút",
    note: "",
  };
}

function makePostDraft(): Post {
  return {
    id: `new-${crypto.randomUUID()}`,
    slug: "",
    title: "",
    excerpt: "",
    category: "Kinh nghiệm học tập",
    thumbnail: "",
    date: new Date().toLocaleDateString("vi-VN"),
    content: "",
  };
}

function createSlug(value: string) {
  const base = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "bai-viet"}-${Date.now().toString().slice(-6)}`;
}

function splitList(value: string) {
  return [...new Set(value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean))];
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
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function getPayloadList(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
