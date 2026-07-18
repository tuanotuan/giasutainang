import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập số điện thoại")
  .regex(/^\d{9,11}$/, "Số điện thoại phải gồm 9-11 chữ số");

const tutorPhoneSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập số điện thoại")
  .regex(/^0\d{9}$/, "Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng số 0");

const optionalEmail = z
  .string()
  .trim()
  .max(254, "Email tối đa 254 ký tự")
  .refine((value) => !value || z.string().email().safeParse(value).success, "Email chưa đúng định dạng");

const shortRequiredText = (message: string, max = 120) =>
  z.string().trim().min(2, message).max(max, `Nội dung tối đa ${max} ký tự`);

const shortList = (message: string) => z.array(z.string().trim().min(1).max(100)).min(1, message).max(30);

export const findTutorSchema = z.object({
  parentName: shortRequiredText("Vui lòng nhập họ tên phụ huynh"),
  phone: phoneSchema,
  email: optionalEmail,
  province: z.string().trim().min(1, "Vui lòng chọn tỉnh hoặc thành phố").max(100),
  district: shortRequiredText("Vui lòng chọn quận, huyện hoặc khu vực", 100),
  ward: shortRequiredText("Vui lòng chọn phường hoặc xã", 100),
  address: z.string().trim().min(3, "Vui lòng nhập số nhà và tên đường").max(250),
  learningMode: z.enum(["Tại nhà", "Online"]),
  grade: z.string().trim().min(1, "Vui lòng chọn lớp học").max(100),
  subject: z.string().trim().min(1, "Vui lòng chọn môn học").max(100),
  studentCount: z.coerce.number().min(1, "Số học sinh tối thiểu là 1").max(20, "Số học sinh tối đa là 20"),
  studentLevel: z.string().trim().min(1, "Vui lòng chọn học lực").max(100),
  sessionsPerWeek: z.coerce.number().min(1, "Vui lòng chọn số buổi").max(7),
  schedule: z.string().trim().min(3, "Vui lòng nhập thời gian học mong muốn").max(300),
  tutorLevel: z.string().trim().min(1, "Vui lòng chọn trình độ gia sư").max(100),
  tutorGender: z.string().trim().min(1, "Vui lòng chọn yêu cầu giới tính").max(50),
  selectedTutorCode: z.string().trim().max(50).optional(),
  budget: z.string().trim().min(1, "Vui lòng nhập ngân sách dự kiến").max(100),
  note: z.string().trim().max(1000, "Yêu cầu khác tối đa 1000 ký tự").optional(),
  agreement: z
    .boolean()
    .refine((value) => value, "Bạn cần đồng ý để trung tâm liên hệ tư vấn"),
});

export type FindTutorFormValues = z.infer<typeof findTutorSchema>;

export const registerTutorSchema = z.object({
  fullName: shortRequiredText("Vui lòng nhập họ tên"),
  phone: tutorPhoneSchema,
  email: z.string().trim().email("Email chưa đúng định dạng").max(254),
  birthYear: z.coerce
    .number()
    .min(1960, "Năm sinh chưa hợp lệ")
    .refine((value) => value <= new Date().getFullYear() - 18, "Ứng viên cần đủ 18 tuổi"),
  gender: z.enum(["Nam", "Nữ"]),
  school: shortRequiredText("Vui lòng nhập trường học hoặc nơi đã tốt nghiệp", 200),
  major: shortRequiredText("Vui lòng nhập chuyên ngành", 200),
  occupation: z.string().trim().refine(
    (value): boolean => value === "Sinh viên" || value === "Đã tốt nghiệp",
    "Vui lòng chọn Sinh viên hoặc Đã tốt nghiệp",
  ),
  experience: z.string().trim().max(3000, "Kinh nghiệm dạy tối đa 3000 ký tự").optional(),
  subjects: shortList("Vui lòng chọn ít nhất một môn có thể dạy"),
  grades: shortList("Vui lòng chọn ít nhất một lớp có thể dạy"),
  areas: shortList("Vui lòng chọn ít nhất một khu vực"),
  availableTimes: shortList("Vui lòng chọn ít nhất một thời gian"),
  minimumSalary: z.string().trim().min(1, "Vui lòng nhập mức lương mong muốn").max(100),
  avatar: z.any().optional(),
  profileFile: z.any().optional(),
  feedbackImages: z.any().optional(),
  note: z.string().trim().max(1000, "Yêu cầu khác tối đa 1000 ký tự").optional(),
  agreement: z
    .boolean()
    .refine((value) => value, "Bạn cần xác nhận thông tin đã cung cấp"),
});

export type RegisterTutorFormValues = z.infer<typeof registerTutorSchema>;

export const contactSchema = z.object({
  fullName: shortRequiredText("Vui lòng nhập họ tên"),
  phone: phoneSchema,
  email: optionalEmail,
  message: z.string().trim().min(10, "Nội dung cần có ít nhất 10 ký tự").max(2000, "Nội dung tối đa 2000 ký tự"),
});
export type ContactFormValues = z.infer<typeof contactSchema>;

export const receiveClassFormSchema = z.object({
  fullName: shortRequiredText("Vui lòng nhập họ tên"),
  phone: phoneSchema,
  email: z.string().trim().email("Email chưa đúng định dạng").max(254),
  experience: z.string().trim().min(10, "Vui lòng mô tả kinh nghiệm ít nhất 10 ký tự").max(3000),
  message: z.string().trim().max(1000, "Lời nhắn tối đa 1000 ký tự").optional(),
});
export type ReceiveClassFormValues = z.infer<typeof receiveClassFormSchema>;

export const receiveClassSchema = receiveClassFormSchema.extend({
  classCode: z.string().trim().min(2, "Mã lớp chưa hợp lệ").max(50),
});
