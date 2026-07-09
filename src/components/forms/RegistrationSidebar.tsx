import { AlertTriangle, CheckCircle2, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { processSteps, siteConfig } from "@/data/site";

export function FindTutorSidebar() {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="rounded-2xl bg-primary-800 p-6 text-white shadow-soft">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Quy trình 4 bước</span>
        <h2 className="mt-2 text-xl font-bold">Tài Năng đồng hành cùng gia đình</h2>
        <ol className="mt-6 space-y-5">
          {processSteps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-extrabold text-amber-300">{index + 1}</span>
              <div><strong className="block text-sm">{step.title}</strong><p className="mt-1 text-xs leading-5 text-primary-100">{step.description}</p></div>
            </li>
          ))}
        </ol>
      </div>
      <ContactBox />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="flex items-center gap-2 font-bold text-amber-900"><AlertTriangle className="h-5 w-5 text-amber-600" /> Lưu ý dành cho phụ huynh</h2>
        <p className="mt-3 text-xs leading-6 text-amber-800">
          Gia đình nên xem giấy tờ học tập, trao đổi rõ lịch dạy và thống nhất học phí trước buổi học đầu. Không chuyển tiền cho tài khoản lạ khi chưa xác minh thông tin.
        </p>
      </div>
    </aside>
  );
}

export function RegisterTutorSidebar() {
  const benefits = [
    "Chủ động chọn lớp phù hợp",
    "Lớp mới cập nhật thường xuyên",
    "Mức thu nhập minh bạch",
    "Được hỗ trợ trong quá trình dạy",
  ];
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="rounded-2xl bg-primary-800 p-6 text-white shadow-soft">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Quyền lợi gia sư</span>
        <h2 className="mt-2 text-xl font-bold">Dạy đúng thế mạnh, chủ động thời gian</h2>
        <div className="mt-6 space-y-4">
          {benefits.map((benefit) => (
            <p key={benefit} className="flex items-center gap-3 text-sm text-primary-50">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-300" /> {benefit}
            </p>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <h2 className="flex items-center gap-2 font-bold text-ink"><ShieldCheck className="h-5 w-5 text-primary-600" /> Quy trình nhận lớp</h2>
        <ol className="mt-4 space-y-3 text-xs text-slate-600">
          {["Đăng ký hồ sơ", "Trung tâm xác minh", "Chọn lớp phù hợp", "Nhận lớp và bắt đầu dạy"].map((item, index) => (
            <li key={item} className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 font-extrabold text-primary-700">{index + 1}</span>{item}</li>
          ))}
        </ol>
      </div>
      <ContactBox />
    </aside>
  );
}

function ContactBox() {
  return (
    <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5">
      <h2 className="font-bold text-primary-900">Cần hỗ trợ điền form?</h2>
      <p className="mt-2 text-xs leading-5 text-slate-600">Chuyên viên tư vấn miễn phí trong giờ làm việc.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary-600 text-xs font-bold text-white">
          <Phone className="h-4 w-4" /> Gọi ngay
        </a>
        <a href={siteConfig.zalo} target="_blank" rel="noreferrer" className="flex h-10 items-center justify-center gap-2 rounded-xl bg-white text-xs font-bold text-primary-700">
          <MessageCircle className="h-4 w-4" /> Zalo
        </a>
      </div>
    </div>
  );
}
