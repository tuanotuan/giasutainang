import type { Tutor } from "@/types";

const fictionalNames = [
  "Nguyễn Minh Tâm", "Trần Hoài Phương", "Lê Gia Huy", "Phạm Khánh An", "Võ Ngọc Lam",
  "Đặng Thanh Tùng", "Bùi Hà My", "Đỗ Nhật Minh", "Hồ Tú Anh", "Dương Quang Vinh",
  "Mai Thảo Nguyên", "Cao Đức Phúc", "Lâm Bảo Trân", "Tạ Minh Khang", "Trịnh Yến Chi",
  "Phan Hoàng Sơn", "Vũ Kim Ngân", "Lý Tuấn Anh", "Châu Diệu Linh", "Ngô Hải Đăng",
  "Nguyễn Phương Nghi", "Trần Quốc Thịnh", "Lê Thanh Trúc", "Phạm Anh Dũng", "Võ Bích Ngọc",
  "Đặng Hữu Thành", "Bùi Quỳnh Giao", "Đỗ Minh Quân", "Hồ Ngọc Ánh", "Dương Thành Đạt",
  "Mai Gia Linh", "Cao Tuấn Vũ", "Lâm Khả Vy", "Tạ Đức Trọng", "Trịnh Mai Chi",
  "Phan Nhật Hào", "Vũ Thùy Dung", "Lý Hoàng Nam", "Châu Thanh Hương", "Ngô Trọng Nhân",
  "Nguyễn Uyên Thư", "Trần Minh Đức", "Lê Ngọc Hân", "Phạm Quang Huy", "Võ Thanh Nhàn",
  "Đặng Tuệ Minh", "Bùi Anh Khoa", "Đỗ Mỹ Linh", "Hồ Gia Bảo", "Dương Thiên Kim",
];

const profiles = [
  { school: "Đại học Sư phạm TP.HCM", major: "Sư phạm Toán", subjects: ["Toán", "Vật lý"], grades: ["Lớp 6", "Lớp 7", "Lớp 8"], areas: ["Quận 3", "Quận 10"] },
  { school: "Đại học Sài Gòn", major: "Giáo dục Tiểu học", subjects: ["Toán", "Tiếng Việt", "Báo bài"], grades: ["Lớp 1", "Lớp 2", "Lớp 3"], areas: ["Gò Vấp", "Tân Bình"] },
  { school: "Đại học Khoa học Tự nhiên TP.HCM", major: "Hóa học", subjects: ["Hóa học", "Khoa học tự nhiên"], grades: ["Lớp 8", "Lớp 9", "Lớp 10"], areas: ["Bình Thạnh", "Thủ Đức"] },
  { school: "Đại học KHXH&NV TP.HCM", major: "Ngôn ngữ Anh", subjects: ["Tiếng Anh", "IELTS"], grades: ["Lớp 7", "Lớp 8", "Lớp 9"], areas: ["Quận 1", "Phú Nhuận", "Online"] },
  { school: "Đại học Bách khoa TP.HCM", major: "Khoa học máy tính", subjects: ["Toán", "Tin học"], grades: ["Lớp 8", "Lớp 9", "Lớp 10"], areas: ["Thủ Đức", "Online"] },
  { school: "Đại học Sư phạm TP.HCM", major: "Sư phạm Ngữ văn", subjects: ["Ngữ văn", "Tiếng Việt"], grades: ["Lớp 6", "Lớp 9", "Lớp 12"], areas: ["Quận 5", "Quận 10"] },
  { school: "Đại học Kinh tế TP.HCM", major: "Kinh doanh quốc tế", subjects: ["Toán", "Tiếng Anh"], grades: ["Lớp 4", "Lớp 5", "Lớp 6"], areas: ["Quận 7", "Bình Thạnh"] },
  { school: "Đại học Y Dược TP.HCM", major: "Dược học", subjects: ["Hóa học", "Sinh học"], grades: ["Lớp 9", "Lớp 10", "Lớp 11"], areas: ["Quận 5", "Quận 10"] },
  { school: "Đại học Ngoại ngữ - Tin học TP.HCM", major: "Ngôn ngữ Trung Quốc", subjects: ["Tiếng Trung", "Tiếng Việt"], grades: ["Lớp 5", "Lớp 6", "Người lớn"], areas: ["Tân Phú", "Online"] },
  { school: "Đại học Tôn Đức Thắng", major: "Thiết kế đồ họa", subjects: ["Vẽ", "Tin học"], grades: ["Thiếu nhi", "Lớp 6", "Người lớn"], areas: ["Quận 7", "Nhà Bè"] },
];

const levels: Tutor["level"][] = ["Sinh viên", "Sinh viên", "Cử nhân", "Giáo viên", "Sinh viên"];
const schedules = ["Tối Thứ 2, 4, 6", "Tối Thứ 3, 5, 7", "Chiều trong tuần", "Cuối tuần", "Linh hoạt, ưu tiên online"];
const styles = [
  "Giải thích từng bước, ưu tiên kiến thức nền tảng.",
  "Kiên nhẫn, dùng ví dụ gần gũi và bài tập vừa sức.",
  "Tương tác tích cực, thường xuyên kiểm tra mức độ hiểu bài.",
  "Hệ thống hóa kiến thức và hướng dẫn học sinh tự luyện tập.",
  "Điều chỉnh tốc độ học theo mục tiêu của từng học sinh.",
];

export const tutors: Tutor[] = fictionalNames.map((name, index) => {
  const profile = profiles[index % profiles.length];
  const level = levels[index % levels.length];
  return {
    id: `ho-so-minh-hoa-${String(index + 1).padStart(2, "0")}`,
    code: `TN${String(index + 1).padStart(3, "0")}`,
    name,
    birthYear: 1997 + (index % 9),
    gender: index % 2 === 0 ? "Nữ" : "Nam",
    avatar: "",
    school: profile.school,
    major: profile.major,
    level,
    subjects: profile.subjects,
    grades: profile.grades,
    areas: profile.areas,
    availableTimes: [schedules[index % schedules.length]],
    experience: `${1 + (index % 5)} năm kinh nghiệm minh họa trong việc hỗ trợ học sinh củng cố kiến thức.`,
    achievements: ["Thông tin thành tích chưa được xác minh"],
    teachingStyle: styles[index % styles.length],
    expectedSalary: `${180 + (index % 6) * 30}.000đ/buổi`,
    rating: index % 3 === 0 ? 4.8 : 4.9,
    reviewCount: 0,
    verificationStatus: "illustrative",
  };
});
