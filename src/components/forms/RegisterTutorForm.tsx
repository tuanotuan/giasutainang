"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, FileText, ImagePlus, Send } from "lucide-react";
import { useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import {
  areaOptions,
  availableTimeOptions,
  gradeOptions,
  subjectOptions,
} from "@/data/form-options";
import {
  registerTutorSchema,
  type RegisterTutorFormValues,
} from "@/lib/validations";
import { Toast } from "@/components/common/Toast";
import {
  fieldClass,
  FormField,
  FormSection,
  textAreaClass,
} from "./FormControls";

export function RegisterTutorForm() {
  const [toast, setToast] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterTutorFormValues>({
    resolver: zodResolver(registerTutorSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      birthYear: 2000,
      gender: "Nữ",
      school: "",
      major: "",
      occupation: "",
      experience: "",
      subjects: [],
      grades: [],
      areas: [],
      availableTimes: [],
      minimumSalary: "",
      note: "",
      agreement: false,
    },
  });

  const onSubmit = (data: RegisterTutorFormValues) => {
    console.log("Mock tutor registration:", data);
    setToast(true);
    reset();
    window.setTimeout(() => setToast(false), 5000);
  };

  return (
    <>
      {toast && (
        <Toast
          message="Đăng ký thành công. Tài Năng sẽ liên hệ sau khi xem hồ sơ."
          onClose={() => setToast(false)}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormSection number="01" title="Thông tin cá nhân" description="Thông tin cơ bản để trung tâm xác minh và liên hệ.">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Họ tên" required error={errors.fullName?.message}>
              <input {...register("fullName")} className={fieldClass} placeholder="Họ và tên đầy đủ" autoComplete="name" />
            </FormField>
            <FormField label="Số điện thoại" required error={errors.phone?.message}>
              <input {...register("phone")} className={fieldClass} placeholder="Chỉ nhập 9-11 chữ số" inputMode="numeric" autoComplete="tel" />
            </FormField>
            <FormField label="Email" required error={errors.email?.message}>
              <input {...register("email")} className={fieldClass} placeholder="giasu@example.com" type="email" autoComplete="email" />
            </FormField>
            <FormField label="Năm sinh" required error={errors.birthYear?.message}>
              <input {...register("birthYear")} className={fieldClass} type="number" min={1960} max={new Date().getFullYear() - 18} />
            </FormField>
            <FormField label="Giới tính" required error={errors.gender?.message} className="sm:col-span-2">
              <div className="grid grid-cols-2 gap-2">
                {["Nam", "Nữ"].map((item) => (
                  <label key={item} className="cursor-pointer">
                    <input {...register("gender")} type="radio" value={item} className="peer sr-only" />
                    <span className="flex h-12 items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-600 transition peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </FormField>
          </div>
        </FormSection>

        <FormSection number="02" title="Học vấn & kinh nghiệm" description="Hãy mô tả trung thực để việc ghép lớp được phù hợp.">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Trường đang học / đã tốt nghiệp" required error={errors.school?.message}>
              <input {...register("school")} className={fieldClass} placeholder="Ví dụ: Đại học Sư phạm TP.HCM" />
            </FormField>
            <FormField label="Chuyên ngành" required error={errors.major?.message}>
              <input {...register("major")} className={fieldClass} placeholder="Ví dụ: Sư phạm Toán" />
            </FormField>
            <FormField label="Nghề nghiệp hiện tại" required error={errors.occupation?.message} className="sm:col-span-2">
              <select {...register("occupation")} className={fieldClass}>
                <option value="">Chọn nghề nghiệp</option>
                {["Sinh viên", "Giáo viên", "Cử nhân", "Thạc sĩ", "Khác"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormField>
            <FormField label="Kinh nghiệm dạy" required error={errors.experience?.message} className="sm:col-span-2">
              <textarea {...register("experience")} className={textAreaClass} placeholder="Số năm kinh nghiệm, nhóm học sinh từng dạy, kết quả tiêu biểu..." />
            </FormField>
          </div>
        </FormSection>

        <FormSection number="03" title="Năng lực giảng dạy" description="Có thể chọn nhiều môn, lớp và khu vực.">
          <div className="space-y-6">
            <CheckboxGroup
              name="subjects"
              label="Môn có thể dạy"
              options={subjectOptions}
              register={register}
              error={errors.subjects?.message}
              columns="sm:grid-cols-3"
            />
            <CheckboxGroup
              name="grades"
              label="Lớp có thể dạy"
              options={gradeOptions}
              register={register}
              error={errors.grades?.message}
              columns="sm:grid-cols-3"
            />
            <CheckboxGroup
              name="areas"
              label="Khu vực có thể dạy"
              options={areaOptions}
              register={register}
              error={errors.areas?.message}
              columns="sm:grid-cols-3"
            />
          </div>
        </FormSection>

        <FormSection number="04" title="Lịch dạy & hồ sơ" description="Chọn các khung giờ bạn có thể nhận lớp thường xuyên.">
          <div className="space-y-6">
            <CheckboxGroup
              name="availableTimes"
              label="Thời gian có thể dạy"
              options={availableTimeOptions}
              register={register}
              error={errors.availableTimes?.message}
              columns="sm:grid-cols-3"
            />
            <FormField label="Lương tối thiểu mong muốn / buổi" required error={errors.minimumSalary?.message}>
              <input {...register("minimumSalary")} className={fieldClass} placeholder="Ví dụ: 200.000đ/buổi" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FileField
                label="Ảnh đại diện"
                description="JPG, PNG — chỉ mô phỏng"
                icon={<ImagePlus className="h-5 w-5" />}
                input={<input {...register("avatar")} type="file" accept="image/*" className="absolute inset-0 cursor-pointer opacity-0" />}
              />
              <FileField
                label="File hồ sơ"
                description="PDF, DOC — chỉ mô phỏng"
                icon={<FileText className="h-5 w-5" />}
                input={<input {...register("profileFile")} type="file" accept=".pdf,.doc,.docx" className="absolute inset-0 cursor-pointer opacity-0" />}
              />
            </div>
            <FormField label="Yêu cầu khác" error={errors.note?.message}>
              <textarea {...register("note")} className={textAreaClass} placeholder="Chia sẻ thêm mong muốn về lớp dạy..." />
            </FormField>
          </div>
        </FormSection>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
          <label className="flex cursor-pointer items-start gap-3">
            <input {...register("agreement")} type="checkbox" className="mt-0.5 h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm leading-6 text-slate-600">
              Tôi xác nhận thông tin cung cấp là đúng và đồng ý để Tài Năng liên hệ xác minh hồ sơ.
            </span>
          </label>
          {errors.agreement && <p className="mt-2 text-xs font-medium text-rose-600">{errors.agreement.message}</p>}
          <button type="submit" disabled={isSubmitting} className="button-primary mt-5 w-full">
            {isSubmitting ? "Đang gửi..." : <><Send className="h-4 w-4" /> Đăng ký làm gia sư</>}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <Check className="h-3.5 w-3.5 text-emerald-500" /> Hồ sơ sẽ được xem xét trước khi hiển thị
          </p>
        </div>
      </form>
    </>
  );
}

function CheckboxGroup({
  name,
  label,
  options,
  register,
  error,
  columns,
}: {
  name: "subjects" | "grades" | "areas" | "availableTimes";
  label: string;
  options: string[];
  register: UseFormRegister<RegisterTutorFormValues>;
  error?: string;
  columns: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-slate-700">{label} <span className="text-rose-500">*</span></h3>
      <div className={`grid max-h-64 gap-2 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/60 p-3 ${columns}`}>
        {options.map((item) => (
          <label key={item} className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:text-primary-700">
            <input {...register(name)} type="checkbox" value={item} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
            {item}
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

function FileField({
  label,
  description,
  icon,
  input,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  input: React.ReactNode;
}) {
  return (
    <label className="relative flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-primary-400 hover:bg-primary-50">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">{icon}</span>
      <span><strong className="block text-sm text-slate-700">{label}</strong><small className="text-slate-400">{description}</small></span>
      {input}
    </label>
  );
}
