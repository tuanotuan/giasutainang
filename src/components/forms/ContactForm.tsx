"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toast } from "@/components/common/Toast";
import { apiRequest } from "@/lib/api";
import { fieldClass, FormField, textAreaClass } from "./FormControls";

const schema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().regex(/^\d{9,11}$/, "Số điện thoại phải gồm 9-11 chữ số"),
  email: z.string().trim().refine((value) => !value || z.string().email().safeParse(value).success, "Email chưa đúng định dạng"),
  message: z.string().trim().min(10, "Nội dung cần có ít nhất 10 ký tự"),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [notice, setNotice] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { fullName: "", phone: "", email: "", message: "" } });
  const onSubmit = async (data: Values) => {
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
          <button type="submit" className="button-primary sm:col-span-2"><Send className="h-4 w-4" /> Gửi liên hệ</button>
        </div>
      </form>
    </>
  );
}
