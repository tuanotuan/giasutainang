import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-4 right-4 top-5 z-[100] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-2xl sm:left-auto sm:right-6"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-5 w-5" />
      </span>
      <p className="flex-1 pt-1 text-sm font-semibold leading-6 text-slate-700">{message}</p>
      <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Đóng thông báo">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
