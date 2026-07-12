"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toast } from "@/components/common/Toast";
import { apiRequest } from "@/lib/api";
import { receiveClassFormSchema, type ReceiveClassFormValues } from "@/lib/validations";
import { fieldClass, FormField, textAreaClass } from "./FormControls";

export function ReceiveClassForm({ classCode }: { classCode: string }) {
  const [notice, setNotice] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReceiveClassFormValues>({ resolver: zodResolver(receiveClassFormSchema), defaultValues: { fullName: "", phone: "", email: "", experience: "", message: "" } });
  const onSubmit = async (data: ReceiveClassFormValues) => {
    try {
      await apiRequest("/api/requests/receive-class", { method: "POST", body: JSON.stringify({ classCode, ...data }) });
      setNotice({ message: `Đã gửi đăng ký nhận lớp ${classCode}. Trung tâm sẽ liên hệ xác minh.`, variant: "success" });
      reset();
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : "Không thể gửi đăng ký.", variant: "error" });
    }
  };
  return (
    <>
      {notice && <Toast message={notice.message} variant={notice.variant} onClose={() => setNotice(null)} />}
      <form id="nhan-lop" onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="text-xl font-extrabold text-ink">Đăng ký nhận lớp</h2>
        <p className="mt-2 text-xs text-slate-500">Thông tin chỉ được dùng để xác minh hồ sơ gia sư.</p>
        <div className="mt-6 space-y-4">
          <FormField label="Họ tên gia sư" required error={errors.fullName?.message}><input {...register("fullName")} className={fieldClass} /></FormField>
          <FormField label="Số điện thoại" required error={errors.phone?.message}><input {...register("phone")} className={fieldClass} inputMode="numeric" /></FormField>
          <FormField label="Email" required error={errors.email?.message}><input {...register("email")} className={fieldClass} type="email" /></FormField>
          <FormField label="Kinh nghiệm" required error={errors.experience?.message}><textarea {...register("experience")} className={textAreaClass} /></FormField>
          <FormField label="Lời nhắn" error={errors.message?.message}><textarea {...register("message")} className={textAreaClass} /></FormField>
          <button className="button-primary w-full disabled:cursor-wait disabled:opacity-70" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang gửi...</> : <><Send className="h-4 w-4" /> Gửi đăng ký nhận lớp</>}
          </button>
        </div>
      </form>
    </>
  );
}
