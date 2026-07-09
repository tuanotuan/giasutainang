import type { TutorRequest } from "@/types";

export const tutorRequests: TutorRequest[] = [
  { id: "YC001", parentName: "Nguyễn Thu Hà", phone: "0900000001", email: "thuha@example.com", area: "Bình Thạnh", learningMode: "Tại nhà", grade: "Lớp 9", subjects: ["Toán"], studentCount: 1, studentLevel: "Khá", sessionsPerWeek: 3, schedule: "Tối Thứ 2, 4, 6", tutorLevel: "Giáo viên", tutorGender: "Không yêu cầu", budget: "2.500.000đ/tháng", status: "new", createdAt: "2026-07-09" },
  { id: "YC002", parentName: "Trần Minh Đức", phone: "0900000002", area: "Online", learningMode: "Online", grade: "Lớp 12", subjects: ["Tiếng Anh"], studentCount: 1, studentLevel: "Trung bình", sessionsPerWeek: 2, schedule: "Cuối tuần", tutorLevel: "Cử nhân", tutorGender: "Nữ", budget: "2.000.000đ/tháng", status: "called", createdAt: "2026-07-08" },
  { id: "YC003", parentName: "Lê Mỹ Linh", phone: "0900000003", area: "Quận 7", learningMode: "Học nhóm", grade: "Lớp 5", subjects: ["Toán", "Tiếng Việt"], studentCount: 3, studentLevel: "Khá", sessionsPerWeek: 3, schedule: "Chiều trong tuần", tutorLevel: "Sinh viên", tutorGender: "Không yêu cầu", budget: "1.800.000đ/tháng", status: "matched", createdAt: "2026-07-07" },
  { id: "YC004", parentName: "Phạm Hoàng Nam", phone: "0900000004", area: "Tân Bình", learningMode: "Tại nhà", grade: "Lớp 11", subjects: ["Hóa học"], studentCount: 1, studentLevel: "Yếu", sessionsPerWeek: 2, schedule: "Tối Thứ 3, 5", tutorLevel: "Giáo viên", tutorGender: "Nam", budget: "3.000.000đ/tháng", status: "new", createdAt: "2026-07-06" },
];
