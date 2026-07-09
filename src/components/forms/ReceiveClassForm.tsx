"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toast } from "@/components/common/Toast";
import { fieldClass, FormField, textAreaClass } from "./FormControls";

const schema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().regex(/^\d{9,11}$/, "Số điện thoại phải gồm 9-11 chữ số"),
  email: z.string().email("Email chưa đúng định dạng"),
  experience: z.string().trim().min(10, "Vui lòng mô tả kinh nghiệm ít nhất 10 ký tự"),
  message: z.string().trim().optional(),
});
type Values = z.infer<typeof schema>;

export function ReceiveClassForm({ classCode }: { classCode: string }) {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { fullName: "", phone: "", email: "", experience: "", message: "" } });
  const onSubmit = (data: Values) => {
    console.log("Mock receive class:", { classCode, ...data });
    setSuccess(true);
    reset();
  };
  return (
    <>
      {success && <Toast message={`Đã gửi đăng ký nhận lớp ${classCode}. Trung tâm sẽ liên hệ xác minh.`} onClose={() => setSuccess(false)} />}
      <form id="nhan-lop" onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="text-xl font-black text-ink">Đăng ký nhận lớp</h2>
        <p className="mt-2 text-xs text-slate-500">Thông tin chỉ được dùng để xác minh hồ sơ gia sư.</p>
        <div className="mt-6 space-y-4">
          <FormField label="Họ tên gia sư" required error={errors.fullName?.message}><input {...register("fullName")} className={fieldClass} /></FormField>
          <FormField label="Số điện thoại" required error={errors.phone?.message}><input {...register("phone")} className={fieldClass} inputMode="numeric" /></FormField>
          <FormField label="Email" required error={errors.email?.message}><input {...register("email")} className={fieldClass} type="email" /></FormField>
          <FormField label="Kinh nghiệm" required error={errors.experience?.message}><textarea {...register("experience")} className={textAreaClass} /></FormField>
          <FormField label="Lời nhắn" error={errors.message?.message}><textarea {...register("message")} className={textAreaClass} /></FormField>
          <button className="button-primary w-full" type="submit"><Send className="h-4 w-4" /> Gửi đăng ký nhận lớp</button>
        </div>
      </form>
    </>
  );
}
