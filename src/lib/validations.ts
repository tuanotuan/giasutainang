import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập số điện thoại")
  .regex(/^\d{9,11}$/, "Số điện thoại phải gồm 9-11 chữ số");

const optionalEmail = z
  .string()
  .trim()
  .refine((value) => !value || z.string().email().safeParse(value).success, "Email chưa đúng định dạng");

export const findTutorSchema = z.object({
  parentName: z.string().trim().min(2, "Vui lòng nhập họ tên phụ huynh"),
  phone: phoneSchema,
  email: optionalEmail,
  province: z.string().min(1, "Vui lòng chọn tỉnh hoặc thành phố"),
  district: z.string().trim().min(2, "Vui lòng chọn quận, huyện hoặc khu vực"),
  ward: z.string().trim().min(2, "Vui lòng chọn phường hoặc xã"),
  address: z.string().trim().min(3, "Vui lòng nhập số nhà và tên đường"),
  learningMode: z.enum(["Tại nhà", "Online", "Học nhóm"]),
  grade: z.string().min(1, "Vui lòng chọn lớp học"),
  subject: z.string().min(1, "Vui lòng chọn môn học"),
  studentCount: z.coerce.number().min(1, "Số học sinh tối thiểu là 1").max(20, "Số học sinh tối đa là 20"),
  studentLevel: z.string().min(1, "Vui lòng chọn học lực"),
  sessionsPerWeek: z.coerce.number().min(1, "Vui lòng chọn số buổi").max(7),
  schedule: z.string().trim().min(3, "Vui lòng nhập thời gian học mong muốn"),
  tutorLevel: z.string().min(1, "Vui lòng chọn trình độ gia sư"),
  tutorGender: z.string().min(1, "Vui lòng chọn yêu cầu giới tính"),
  selectedTutorCode: z.string().trim().optional(),
  budget: z.string().trim().min(1, "Vui lòng nhập ngân sách dự kiến"),
  note: z.string().trim().max(1000, "Yêu cầu khác tối đa 1000 ký tự").optional(),
  agreement: z
    .boolean()
    .refine((value) => value, "Bạn cần đồng ý để trung tâm liên hệ tư vấn"),
});

export type FindTutorFormValues = z.infer<typeof findTutorSchema>;

export const registerTutorSchema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: phoneSchema,
  email: z.string().trim().email("Email chưa đúng định dạng"),
  birthYear: z.coerce
    .number()
    .min(1960, "Năm sinh chưa hợp lệ")
    .max(new Date().getFullYear() - 18, "Ứng viên cần đủ 18 tuổi"),
  gender: z.enum(["Nam", "Nữ"]),
  school: z.string().trim().min(2, "Vui lòng nhập trường học hoặc nơi đã tốt nghiệp"),
  major: z.string().trim().min(2, "Vui lòng nhập chuyên ngành"),
  occupation: z.string().min(1, "Vui lòng chọn nghề nghiệp"),
  experience: z.string().trim().min(10, "Vui lòng mô tả kinh nghiệm ít nhất 10 ký tự"),
  subjects: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một môn có thể dạy"),
  grades: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một lớp có thể dạy"),
  areas: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một khu vực"),
  availableTimes: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một thời gian"),
  minimumSalary: z.string().trim().min(1, "Vui lòng nhập mức lương mong muốn"),
  avatar: z.any().optional(),
  profileFile: z.any().optional(),
  note: z.string().trim().max(1000, "Yêu cầu khác tối đa 1000 ký tự").optional(),
  agreement: z
    .boolean()
    .refine((value) => value, "Bạn cần xác nhận thông tin đã cung cấp"),
});

export type RegisterTutorFormValues = z.infer<typeof registerTutorSchema>;
