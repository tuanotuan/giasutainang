"use client";

import { Loader2, MessageCircleQuestion, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/api";
import { siteConfig } from "@/data/site";
import { useFooterVisibility } from "@/lib/useFooterVisibility";

type ChatMessage = { role: "visitor" | "assistant"; text: string };
const quickQuestions = ["Học phí khoảng bao nhiêu?", "Quy trình tìm gia sư thế nào?", "Có dạy online không?"];

export function ConsultingChat() {
  const pathname = usePathname();
  const footerVisible = useFooterVisibility();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Chào bạn! Mình có thể hỗ trợ thông tin về học phí, cách tìm gia sư, đăng ký nhận lớp và lịch học." },
  ]);

  const ask = async (text: string) => {
    const clean = text.trim();
    if (clean.length < 3 || loading) return;
    setMessages((current) => [...current, { role: "visitor", text: clean }]);
    setQuestion(""); setLoading(true);
    try {
      const result = await apiRequest<{ answer: string }>("/api/ai/chat", { method: "POST", body: JSON.stringify({ question: clean }) });
      setMessages((current) => [...current, { role: "assistant", text: result.answer }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: `Mình chưa trả lời được lúc này. Bạn vui lòng gọi hoặc nhắn Zalo ${siteConfig.phone} để được hỗ trợ nhé.` }]);
    } finally { setLoading(false); }
  };

  const submit = (event: FormEvent) => { event.preventDefault(); void ask(question); };

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className={`fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 z-50 transition duration-200 sm:bottom-7 sm:left-6 ${footerVisible && !open ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}>
      {open && (
        <section role="dialog" aria-label="Trợ lý tư vấn" className="mb-2 flex h-[min(560px,calc(100dvh-10rem))] w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:mb-3 sm:h-[min(560px,72vh)] sm:w-[calc(100vw-2rem)]">
          <header className="flex items-center justify-between bg-primary-700 px-4 py-3 text-white"><div><h2 className="text-sm font-extrabold">Trợ lý tư vấn</h2><p className="text-[11px] text-primary-100">Thông tin tham khảo · Không cần cung cấp dữ liệu cá nhân</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Đóng khung tư vấn" className="rounded-lg p-2 hover:bg-white/10"><X className="h-4 w-4" /></button></header>
          <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">{messages.map((message, index) => <p key={`${message.role}-${index}`} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "visitor" ? "ml-auto bg-primary-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}>{message.text}</p>)}{loading && <p className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Đang chuẩn bị câu trả lời...</p>}</div>
          <div className="border-t bg-white p-3"><div className="mb-2 flex gap-2 overflow-x-auto pb-1">{quickQuestions.map((item) => <button key={item} type="button" onClick={() => void ask(item)} className="shrink-0 rounded-full bg-primary-50 px-3 py-1.5 text-[11px] font-bold text-primary-700">{item}</button>)}</div><form onSubmit={submit} className="flex gap-2"><label className="sr-only" htmlFor="cau-hoi-tu-van">Nhập câu hỏi</label><input id="cau-hoi-tu-van" value={question} onChange={(event) => setQuestion(event.target.value.slice(0, 300))} placeholder="Bạn muốn hỏi điều gì?" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary-500" /><button type="submit" disabled={loading || question.trim().length < 3} aria-label="Gửi câu hỏi" className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white disabled:opacity-50"><Send className="h-4 w-4" /></button></form></div>
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Đóng trợ lý tư vấn" : "Mở trợ lý tư vấn"} className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-violet-700 sm:h-12 sm:w-auto sm:gap-2 sm:px-4"><MessageCircleQuestion className="h-5 w-5" /><span className="hidden sm:inline">Hỏi nhanh</span></button>
    </div>
  );
}
