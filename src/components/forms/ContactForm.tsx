"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toast } from "@/components/common/Toast";
import { apiRequest } from "@/lib/api";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { fieldClass, FormField, textAreaClass } from "./FormControls";

export function ContactForm() {
  const [notice, setNotice] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema), defaultValues: { fullName: "", phone: "", email: "", message: "" } });
  const onSubmit = async (data: ContactFormValues) => {
    try {
      await apiRequest("/api/requests/contact", { method: "POST", body: JSON.stringify({ ...data, name: data.fullName }) });
      setNotice({ message: "Đã gửi lời nhắn. Tài Năng sẽ liên hệ trong thời gian sớm nhất.", variant: "success" });
      reset();
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : "Không thể gửi lời nhắn.", variant: "error" });
    }
  };
  return (
    <>
      {notice && <Toast message={notice.message} variant={notice.variant} onClose={() => setNotice(null)} />}
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
        <h2 className="text-2xl font-extrabold text-ink">Gửi lời nhắn</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField label="Họ tên" required error={errors.fullName?.message}><input {...register("fullName")} className={fieldClass} /></FormField>
          <FormField label="Số điện thoại" required error={errors.phone?.message}><input {...register("phone")} className={fieldClass} inputMode="numeric" /></FormField>
          <FormField label="Email" error={errors.email?.message} className="sm:col-span-2"><input {...register("email")} className={fieldClass} type="email" /></FormField>
          <FormField label="Nội dung" required error={errors.message?.message} className="sm:col-span-2"><textarea {...register("message")} className={textAreaClass} /></FormField>
          <button type="submit" disabled={isSubmitting} className="button-primary sm:col-span-2 disabled:cursor-wait disabled:opacity-70">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang gửi...</> : <><Send className="h-4 w-4" /> Gửi liên hệ</>}
          </button>
        </div>
      </form>
    </>
  );
}
