"use client";

import { BarChart3, BookOpenCheck, Copy, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

type Report = {
  summary: string;
  generatedAt: string;
  metrics: {
    totalClasses: number;
    openClasses: number;
    assignedClasses: number;
    tutors: number;
    newRequests: number;
    matchedRequests: number;
    topSubjects: Array<{ name: string; count: number }>;
    topAreas: Array<{ name: string; count: number }>;
  };
};

export function AdminAiTools() {
  const [grade, setGrade] = useState("Lớp 9");
  const [subject, setSubject] = useState("Toán");
  const [level, setLevel] = useState("Trung bình");
  const [goal, setGoal] = useState("");
  const [weeks, setWeeks] = useState(8);
  const [roadmap, setRoadmap] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<"roadmap" | "report" | "">("");
  const [message, setMessage] = useState("");

  const createRoadmap = async () => {
    setLoading("roadmap"); setMessage("");
    try {
      const result = await apiRequest<{ roadmap: string }>("/api/admin/ai/roadmap", {
        method: "POST", body: JSON.stringify({ grade, subject, level, goal, weeks }),
      });
      setRoadmap(result.roadmap);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Chưa thể tạo lộ trình.");
    } finally { setLoading(""); }
  };

  const createReport = async () => {
    setLoading("report"); setMessage("");
    try { setReport(await apiRequest<Report>("/api/admin/ai/report")); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Chưa thể tổng hợp báo cáo."); }
    finally { setLoading(""); }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setMessage("Đã sao chép nội dung.");
  };

  return (
    <div className="space-y-6">
      {message && <p role="status" className="rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800">{message}</p>}
      <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-violet-50 p-3 text-violet-700"><BookOpenCheck className="h-5 w-5" /></span>
          <div><h2 className="font-extrabold text-ink">Gợi ý lộ trình học</h2><p className="mt-1 text-sm text-slate-500">Tạo bản nháp để tư vấn; giáo viên cần điều chỉnh sau buổi đánh giá đầu tiên.</p></div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Field label="Khối lớp" value={grade} onChange={setGrade} />
          <Field label="Môn học" value={subject} onChange={setSubject} />
          <Field label="Học lực hiện tại" value={level} onChange={setLevel} />
          <Field label="Số tuần" value={String(weeks)} type="number" onChange={(value) => setWeeks(Number(value))} />
          <Field label="Mục tiêu" value={goal} onChange={setGoal} placeholder="Ví dụ: củng cố kiến thức để thi vào lớp 10" />
        </div>
        <button type="button" onClick={() => void createRoadmap()} disabled={loading !== "" || !goal.trim()} className="button-primary mt-5 disabled:cursor-not-allowed disabled:opacity-60">
          {loading === "roadmap" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Tạo lộ trình
        </button>
        {roadmap && <Result title="Lộ trình tham khảo" text={roadmap} onCopy={() => void copy(roadmap)} />}
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><BarChart3 className="h-5 w-5" /></span><div><h2 className="font-extrabold text-ink">Báo cáo vận hành</h2><p className="mt-1 text-sm text-slate-500">Tổng hợp trực tiếp từ lớp, gia sư và yêu cầu đang lưu.</p></div></div>
          <button type="button" onClick={() => void createReport()} disabled={loading !== ""} className="button-secondary justify-center disabled:opacity-60">{loading === "report" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Tạo báo cáo mới</button>
        </div>
        {report && <div className="mt-5"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Lớp chưa giao" value={report.metrics.openClasses} /><Metric label="Yêu cầu mới" value={report.metrics.newRequests} /><Metric label="Hồ sơ gia sư" value={report.metrics.tutors} /><Metric label="Yêu cầu đã ghép" value={report.metrics.matchedRequests} /></div><Result title="Điểm cần chú ý" text={report.summary} onCopy={() => void copy(report.summary)} /><div className="mt-4 grid gap-4 md:grid-cols-2"><Ranking title="Môn được hỏi nhiều" values={report.metrics.topSubjects} /><Ranking title="Khu vực có nhu cầu" values={report.metrics.topAreas} /></div></div>}
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return <label className="text-sm font-bold text-slate-700"><span className="mb-2 block">{label}</span><input type={type} min={type === "number" ? 2 : undefined} max={type === "number" ? 24 : undefined} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-primary-500" /></label>;
}

function Result({ title, text, onCopy }: { title: string; text: string; onCopy: () => void }) {
  return <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/60 p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-extrabold text-violet-900">{title}</h3><button type="button" onClick={onCopy} className="inline-flex items-center gap-1 text-xs font-bold text-violet-700"><Copy className="h-3.5 w-3.5" /> Sao chép</button></div><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{text}</p></div>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-slate-50 p-4"><strong className="text-2xl text-ink">{value}</strong><p className="mt-1 text-xs text-slate-500">{label}</p></div>; }
function Ranking({ title, values }: { title: string; values: Array<{ name: string; count: number }> }) { return <div className="rounded-xl border border-slate-100 p-4"><h3 className="text-sm font-extrabold text-ink">{title}</h3><div className="mt-3 space-y-2">{values.length ? values.map((item) => <div key={item.name} className="flex justify-between text-sm text-slate-600"><span>{item.name}</span><strong>{item.count}</strong></div>) : <p className="text-sm text-slate-500">Chưa đủ dữ liệu.</p>}</div></div>; }
