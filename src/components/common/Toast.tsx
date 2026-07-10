"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  variant?: "success" | "error";
}

export function Toast({ message, onClose, variant = "success" }: ToastProps) {
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;
  useEffect(() => {
    const timeout = window.setTimeout(onClose, variant === "success" ? 5000 : 7000);
    return () => window.clearTimeout(timeout);
  }, [onClose, variant]);

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`fixed left-4 right-4 top-5 z-[100] mx-auto flex max-w-md items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl sm:left-auto sm:right-6 ${variant === "success" ? "border-emerald-100" : "border-rose-100"}`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${variant === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="flex-1 pt-1 text-sm font-semibold leading-6 text-slate-700">{message}</p>
      <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Đóng thông báo">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
