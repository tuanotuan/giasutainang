"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  genderOptions,
  gradeOptions,
  studentLevels,
  subjectOptions,
  tutorLevels,
} from "@/data/form-options";
import {
  findTutorSchema,
  type FindTutorFormValues,
} from "@/lib/validations";
import { apiRequest } from "@/lib/api";
import { Toast } from "@/components/common/Toast";
import {
  fieldClass,
  FormField,
  FormSection,
  textAreaClass,
} from "./FormControls";
import { CascadingAddressFields } from "./CascadingAddressFields";

export function FindTutorForm() {
  const [notice, setNotice] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FindTutorFormValues>({
    resolver: zodResolver(findTutorSchema),
    defaultValues: {
      parentName: "",
      phone: "",
      email: "",
      province: "Thành phố Hồ Chí Minh",
      district: "",
      ward: "",
      address: "",
      learningMode: "Tại nhà",
      grade: "",
      subject: "",
      studentCount: 1,
      studentLevel: "",
      sessionsPerWeek: 2,
      schedule: "",
      tutorLevel: "Không yêu cầu",
      tutorGender: "Không yêu cầu",
      selectedTutorCode: "",
      budget: "",
      note: "",
      agreement: false,
    },
  });

  useEffect(() => {
    const tutorCode = new URLSearchParams(window.location.search).get("tutor");
    if (tutorCode) setValue("selectedTutorCode", tutorCode);
  }, [setValue]);

  const onSubmit = async (data: FindTutorFormValues) => {
    try {
      const fullAddress = [data.address, data.ward, data.district, data.province].filter(Boolean).join(", ");
      await apiRequest("/api/requests/find-tutor", {
        method: "POST",
        body: JSON.stringify({ ...data, area: data.district, address: fullAddress }),
      });
      setNotice({ message: "Đã gửi yêu cầu. Trung tâm sẽ liên hệ tư vấn.", variant: "success" });
      reset();
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : "Không thể gửi yêu cầu.", variant: "error" });
    }
  };

  return (
    <>
      {notice && (
        <Toast
          message={notice.message}
          variant={notice.variant}
          onClose={() => setNotice(null)}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormSection
          number="01"
          title="Thông tin liên hệ"
          description="Thông tin chỉ được dùng để tư vấn nhu cầu học tập."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Họ tên phụ huynh" required error={errors.parentName?.message}>
              <input {...register("parentName")} className={fieldClass} placeholder="Ví dụ: Nguyễn Minh Anh" autoComplete="name" />
            </FormField>
            <FormField label="Số điện thoại (có dùng Zalo)" required error={errors.phone?.message}>
              <input {...register("phone")} className={fieldClass} placeholder="Số điện thoại dùng để gọi và nhắn Zalo" inputMode="numeric" autoComplete="tel" />
            </FormField>
            <FormField label="Email" error={errors.email?.message}>
              <input {...register("email")} className={fieldClass} placeholder="phuhuynh@example.com" type="email" autoComplete="email" />
            </FormField>
            <CascadingAddressFields register={register} setValue={setValue} errors={errors} />
            <FormField label="Số nhà, tên đường" required error={errors.address?.message} className="sm:col-span-2">
              <input {...register("address")} className={fieldClass} placeholder="Ví dụ: 135/1 Nguyễn Hữu Cảnh" autoComplete="street-address" />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          number="02"
          title="Nhu cầu học tập"
          description="Càng cụ thể, hồ sơ được đề xuất càng sát với mong muốn."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Hình thức học" required error={errors.learningMode?.message} className="sm:col-span-2">
              <div className="grid grid-cols-3 gap-2">
                {["Tại nhà", "Online", "Học nhóm"].map((item) => (
                  <label key={item} className="cursor-pointer">
                    <input {...register("learningMode")} type="radio" value={item} className="peer sr-only" />
                    <span className="flex h-12 items-center justify-center rounded-xl border border-slate-200 px-2 text-center text-xs font-bold text-slate-600 transition peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </FormField>
            <FormField label="Lớp học" required error={errors.grade?.message}>
              <select {...register("grade")} className={fieldClass}>
                <option value="">Chọn lớp học</option>
                {gradeOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormField>
            <FormField label="Môn học" required error={errors.subject?.message}>
              <select {...register("subject")} className={fieldClass}>
                <option value="">Chọn môn học</option>
                {subjectOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormField>
            <FormField label="Số lượng học sinh" required error={errors.studentCount?.message}>
              <input {...register("studentCount")} className={fieldClass} type="number" min={1} max={20} />
            </FormField>
            <FormField label="Học lực hiện tại" required error={errors.studentLevel?.message}>
              <select {...register("studentLevel")} className={fieldClass}>
                <option value="">Chọn học lực</option>
                {studentLevels.map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormField>
            <FormField label="Số buổi / tuần" required error={errors.sessionsPerWeek?.message}>
              <select {...register("sessionsPerWeek")} className={fieldClass}>
                {Array.from({ length: 7 }, (_, index) => index + 1).map((item) => (
                  <option key={item} value={item}>{item} buổi</option>
                ))}
              </select>
            </FormField>
            <FormField label="Thời gian học mong muốn" required error={errors.schedule?.message}>
              <input {...register("schedule")} className={fieldClass} placeholder="Ví dụ: Tối Thứ 2, 4, 6" />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          number="03"
          title="Yêu cầu về gia sư"
          description="Tài Năng sẽ cân đối yêu cầu với ngân sách dự kiến."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Trình độ gia sư" required error={errors.tutorLevel?.message}>
              <select {...register("tutorLevel")} className={fieldClass}>
                {tutorLevels.map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormField>
            <FormField label="Yêu cầu giới tính" required error={errors.tutorGender?.message}>
              <select {...register("tutorGender")} className={fieldClass}>
                {genderOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormField>
            <FormField label="Mã gia sư đã chọn" error={errors.selectedTutorCode?.message}>
              <input {...register("selectedTutorCode")} className={fieldClass} placeholder="Không bắt buộc, ví dụ MT001" />
            </FormField>
            <FormField label="Ngân sách dự kiến" required error={errors.budget?.message}>
              <input {...register("budget")} className={fieldClass} placeholder="Ví dụ: 2.000.000đ/tháng" />
            </FormField>
            <FormField label="Yêu cầu khác" error={errors.note?.message} className="sm:col-span-2">
              <textarea {...register("note")} className={textAreaClass} placeholder="Chia sẻ thêm về mục tiêu, tính cách hoặc lưu ý khi học..." />
            </FormField>
          </div>
        </FormSection>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
          <label className="flex cursor-pointer items-start gap-3">
            <input {...register("agreement")} type="checkbox" className="mt-0.5 h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm leading-6 text-slate-600">
              Tôi đồng ý để Gia Sư Tài Năng liên hệ tư vấn và xác nhận nhu cầu học tập.
            </span>
          </label>
          {errors.agreement && <p className="mt-2 text-xs font-medium text-rose-600">{errors.agreement.message}</p>}
          <button type="submit" disabled={isSubmitting} className="button-primary mt-5 w-full disabled:cursor-wait disabled:opacity-70">
            {isSubmitting ? "Đang gửi..." : <><Send className="h-4 w-4" /> Đăng ký tìm gia sư</>}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <Check className="h-3.5 w-3.5 text-emerald-500" /> Không thu phí gửi yêu cầu
          </p>
        </div>
      </form>
    </>
  );
}
