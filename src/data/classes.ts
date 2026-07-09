import type { ClassItem } from "@/types";

const featuredClasses: ClassItem[] = [
  { id: "1", code: "LMT-2601", status: "open", title: "Toán lớp 9 tại Bình Thạnh", subject: "Toán", grade: "Lớp 9", studentCount: 1, studentLevel: "Khá", area: "Bình Thạnh", address: "Gần Phan Văn Trị", learningMode: "Tại nhà", sessionsPerWeek: 3, duration: "90 phút", schedule: "Tối Thứ 2, 4, 6", tutorRequirement: "Giáo viên hoặc sinh viên năm cuối", salary: 220000, note: "Cần ôn thi vào lớp 10", createdAt: "2026-07-09" },
  { id: "2", code: "LMT-2602", status: "discount", title: "Tiếng Anh giao tiếp online", subject: "Tiếng Anh", grade: "Người lớn", studentCount: 1, studentLevel: "Trung bình", area: "Online", address: "Học trực tuyến", learningMode: "Online", sessionsPerWeek: 2, duration: "90 phút", schedule: "Tối Thứ 3, 5", tutorRequirement: "Phát âm tốt, có kinh nghiệm", salary: 250000, note: "Ưu tiên luyện phản xạ", createdAt: "2026-07-08" },
  { id: "3", code: "LMT-2603", status: "open", title: "Báo bài lớp 3 tại Gò Vấp", subject: "Báo bài", grade: "Lớp 3", studentCount: 1, studentLevel: "Khá", area: "Gò Vấp", address: "Gần Công viên Làng Hoa", learningMode: "Tại nhà", sessionsPerWeek: 5, duration: "90 phút", schedule: "Chiều Thứ 2 đến Thứ 6", tutorRequirement: "Nữ, kiên nhẫn", salary: 180000, note: "Kèm các môn trên lớp", createdAt: "2026-07-08" },
  { id: "4", code: "LMT-2604", status: "open", title: "Hóa lớp 12 tại Tân Bình", subject: "Hóa học", grade: "Lớp 12", studentCount: 2, studentLevel: "Trung bình", area: "Tân Bình", address: "Gần đường Cộng Hòa", learningMode: "Học nhóm", sessionsPerWeek: 2, duration: "120 phút", schedule: "Tối Thứ 4 và Chủ nhật", tutorRequirement: "Giáo viên luyện thi THPT", salary: 350000, note: "Mục tiêu 8+ điểm", createdAt: "2026-07-07" },
  { id: "5", code: "LMT-2605", status: "open", title: "Piano cơ bản tại Quận 7", subject: "Piano", grade: "Thiếu nhi", studentCount: 1, studentLevel: "Trung bình", area: "Quận 7", address: "Khu dân cư Nam Long", learningMode: "Tại nhà", sessionsPerWeek: 2, duration: "60 phút", schedule: "Sáng cuối tuần", tutorRequirement: "Có giáo trình cho trẻ em", salary: 280000, note: "Học viên 7 tuổi, có đàn tại nhà", createdAt: "2026-07-06" },
  { id: "6", code: "LMT-2606", status: "open", title: "Ngữ văn lớp 11 online", subject: "Ngữ văn", grade: "Lớp 11", studentCount: 1, studentLevel: "Yếu", area: "Online", address: "Học trực tuyến", learningMode: "Online", sessionsPerWeek: 2, duration: "90 phút", schedule: "Tối Thứ 7 và Chủ nhật", tutorRequirement: "Giáo viên có kinh nghiệm mất gốc", salary: 240000, note: "Cần củng cố cách làm bài", createdAt: "2026-07-05" },
];

const classSubjects = ["Toán", "Tiếng Anh", "Ngữ văn", "Vật lý", "Hóa học", "Tiếng Việt", "IELTS", "Tin học"];
const classAreas = ["Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận 10", "Bình Thạnh", "Gò Vấp", "Tân Bình", "Phú Nhuận", "Thủ Đức", "Online"];
const classStatuses: ClassItem["status"][] = ["open", "open", "discount", "assigned"];
const learningModes: ClassItem["learningMode"][] = ["Tại nhà", "Online", "Học nhóm"];
const studentLevels: ClassItem["studentLevel"][] = ["Giỏi", "Khá", "Trung bình", "Yếu", "Kém"];

const generatedClasses: ClassItem[] = Array.from({ length: 24 }, (_, index) => {
  const id = index + 7;
  const subject = classSubjects[index % classSubjects.length];
  const grade = `Lớp ${1 + (index % 12)}`;
  const area = classAreas[index % classAreas.length];
  const mode = area === "Online" ? "Online" : learningModes[index % learningModes.length];
  return {
    id: String(id),
    code: `LMT-${String(2600 + id)}`,
    status: classStatuses[index % classStatuses.length],
    title: `${subject} ${grade.toLowerCase()} ${mode === "Online" ? "online" : `tại ${area}`}`,
    subject,
    grade,
    studentCount: 1 + (index % 3),
    studentLevel: studentLevels[index % studentLevels.length],
    area,
    address: area === "Online" ? "Học trực tuyến" : `Khu vực trung tâm ${area}`,
    learningMode: mode,
    sessionsPerWeek: 1 + (index % 5),
    duration: index % 3 === 0 ? "120 phút" : "90 phút",
    schedule: index % 2 === 0 ? "Tối Thứ 2, 4, 6" : "Chiều cuối tuần",
    tutorRequirement: index % 3 === 0 ? "Giáo viên có kinh nghiệm" : "Sinh viên hoặc giáo viên phù hợp",
    salary: 160000 + (index % 8) * 30000,
    note: "Trao đổi thêm về lộ trình trong buổi đầu.",
    createdAt: `2026-07-${String(Math.max(1, 31 - index)).padStart(2, "0")}`,
  };
});

export const classes: ClassItem[] = [...featuredClasses, ...generatedClasses];
