import type { Tutor } from "@/types";

const featuredTutors: Tutor[] = [
  {
    id: "an-nhien", code: "MT001", name: "Nguyễn An Nhiên", birthYear: 1998, gender: "Nữ", avatar: "",
    school: "Đại học Sư phạm TP.HCM", major: "Sư phạm Toán", level: "Giáo viên",
    subjects: ["Toán", "Vật lý"], grades: ["Lớp 8", "Lớp 9", "Lớp 10"], areas: ["Quận 3", "Quận 10"],
    availableTimes: ["Tối Thứ 2, 4, 6"], experience: "5 năm dạy kèm và luyện thi chuyển cấp.",
    achievements: ["Giáo viên dạy giỏi cấp trường"], teachingStyle: "Gợi mở, bám sát năng lực học sinh.",
    expectedSalary: "250.000đ/buổi", rating: 4.9, reviewCount: 28,
  },
  {
    id: "minh-khoi", code: "MT002", name: "Trần Minh Khôi", birthYear: 2001, gender: "Nam", avatar: "",
    school: "Đại học Bách khoa TP.HCM", major: "Khoa học máy tính", level: "Sinh viên",
    subjects: ["Toán", "Tin học"], grades: ["Lớp 6", "Lớp 7", "Lớp 8"], areas: ["Thủ Đức", "Bình Thạnh"],
    availableTimes: ["Tối trong tuần"], experience: "3 năm đồng hành cùng học sinh THCS.",
    achievements: ["IELTS 7.5"], teachingStyle: "Trực quan, nhiều ví dụ thực tế.",
    expectedSalary: "180.000đ/buổi", rating: 4.8, reviewCount: 19,
  },
  {
    id: "thanh-mai", code: "MT003", name: "Lê Thanh Mai", birthYear: 1997, gender: "Nữ", avatar: "",
    school: "Đại học KHXH&NV TP.HCM", major: "Ngôn ngữ Anh", level: "Cử nhân",
    subjects: ["Tiếng Anh", "IELTS"], grades: ["Lớp 9", "Lớp 10", "Lớp 11"], areas: ["Quận 1", "Quận 3"],
    availableTimes: ["Chiều và tối"], experience: "6 năm giảng dạy tiếng Anh giao tiếp và học thuật.",
    achievements: ["IELTS 8.0"], teachingStyle: "Khuyến khích giao tiếp và phản xạ tự nhiên.",
    expectedSalary: "300.000đ/buổi", rating: 5, reviewCount: 34,
  },
  {
    id: "duc-huy", code: "MT004", name: "Phạm Đức Huy", birthYear: 1995, gender: "Nam", avatar: "",
    school: "Đại học Khoa học Tự nhiên", major: "Hóa học", level: "Thạc sĩ",
    subjects: ["Hóa học", "Sinh học"], grades: ["Lớp 10", "Lớp 11", "Lớp 12"], areas: ["Tân Bình", "Phú Nhuận"],
    availableTimes: ["Tối Thứ 3, 5, 7"], experience: "7 năm luyện thi THPT và đại học.",
    achievements: ["Thạc sĩ Hóa hữu cơ"], teachingStyle: "Hệ thống hóa, luyện kỹ năng giải đề.",
    expectedSalary: "350.000đ/buổi", rating: 4.9, reviewCount: 41,
  },
  {
    id: "ha-linh", code: "MT005", name: "Vũ Hà Linh", birthYear: 2000, gender: "Nữ", avatar: "",
    school: "Đại học Sư phạm TP.HCM", major: "Giáo dục Tiểu học", level: "Giáo viên",
    subjects: ["Tiếng Việt", "Báo bài"], grades: ["Lớp 1", "Lớp 2", "Lớp 3"], areas: ["Gò Vấp", "Tân Bình"],
    availableTimes: ["Chiều từ Thứ 2 đến Thứ 6"], experience: "4 năm dạy trẻ tiểu học.",
    achievements: ["Chứng chỉ giáo dục kỹ năng sống"], teachingStyle: "Kiên nhẫn, sinh động và tích cực.",
    expectedSalary: "220.000đ/buổi", rating: 4.9, reviewCount: 25,
  },
  {
    id: "quoc-bao", code: "MT006", name: "Đặng Quốc Bảo", birthYear: 1999, gender: "Nam", avatar: "",
    school: "Nhạc viện TP.HCM", major: "Piano", level: "Cử nhân",
    subjects: ["Piano", "Nhạc lý"], grades: ["Thiếu nhi", "Người lớn"], areas: ["Quận 5", "Quận 10"],
    availableTimes: ["Cuối tuần"], experience: "5 năm dạy piano căn bản.",
    achievements: ["Giải khuyến khích Piano trẻ"], teachingStyle: "Thực hành vui, tiến độ vừa sức.",
    expectedSalary: "280.000đ/buổi", rating: 4.8, reviewCount: 17,
  },
  {
    id: "bao-ngoc", code: "MT007", name: "Hoàng Bảo Ngọc", birthYear: 2002, gender: "Nữ", avatar: "",
    school: "Đại học Ngoại thương", major: "Kinh tế đối ngoại", level: "Sinh viên",
    subjects: ["Toán", "Tiếng Anh"], grades: ["Lớp 4", "Lớp 5", "Lớp 6"], areas: ["Bình Thạnh", "Phú Nhuận"],
    availableTimes: ["Tối và cuối tuần"], experience: "2 năm dạy kèm học sinh tiểu học.",
    achievements: ["Học bổng khuyến khích học tập"], teachingStyle: "Gần gũi, xây thói quen tự học.",
    expectedSalary: "170.000đ/buổi", rating: 4.7, reviewCount: 14,
  },
  {
    id: "gia-han", code: "MT008", name: "Đỗ Gia Hân", birthYear: 1996, gender: "Nữ", avatar: "",
    school: "Đại học Sư phạm TP.HCM", major: "Ngữ văn", level: "Giáo viên",
    subjects: ["Ngữ văn", "Luyện viết"], grades: ["Lớp 9", "Lớp 10", "Lớp 12"], areas: ["Quận 7", "Online"],
    availableTimes: ["Tối Thứ 2 đến Thứ 7"], experience: "6 năm luyện thi và bồi dưỡng kỹ năng viết.",
    achievements: ["Giáo viên chủ nhiệm giỏi"], teachingStyle: "Khơi gợi cảm thụ, rèn tư duy lập luận.",
    expectedSalary: "280.000đ/buổi", rating: 4.9, reviewCount: 31,
  },
];

const additionalNames = [
  "Ngô Minh Anh", "Bùi Tuấn Kiệt", "Trương Thảo Vy", "Phan Nhật Nam",
  "Hồ Khánh Linh", "Võ Hoàng Long", "Mai Tú Uyên", "Nguyễn Đức Anh",
  "Lâm Quỳnh Như", "Trần Quốc Việt", "Lê Ngọc Diệp", "Đỗ Thành Công",
  "Phạm Mỹ Duyên", "Vũ Anh Quân", "Hoàng Kim Chi", "Đặng Trung Hiếu",
  "Nguyễn Yến Nhi", "Trịnh Minh Nhật", "Bùi Thanh Trúc", "Lý Gia Bảo",
  "Tạ Phương Thảo", "Dương Xuân Phúc", "Cao Ngọc Hân", "Lưu Minh Triết",
  "Nguyễn Khả Hân", "Phùng Gia Huy", "Đoàn Mai Anh", "Châu Tuấn Tú",
  "Lê Thùy Dương", "Trần Thanh Tùng", "Võ Trâm Anh", "Phạm Quang Minh",
];

const schoolOptions = [
  "Đại học Sư phạm TP.HCM",
  "Đại học Bách khoa TP.HCM",
  "Đại học Khoa học Tự nhiên",
  "Đại học KHXH&NV TP.HCM",
  "Đại học Ngoại thương",
  "Đại học Kinh tế TP.HCM",
];

const subjectSets = [
  ["Toán", "Vật lý"],
  ["Ngữ văn", "Tiếng Việt"],
  ["Tiếng Anh", "IELTS"],
  ["Hóa học", "Sinh học"],
  ["Tiếng Nhật"],
  ["Tin học", "Toán"],
];

const areaSets = [
  ["Quận 1", "Quận 3"],
  ["Quận 5", "Quận 10"],
  ["Bình Thạnh", "Phú Nhuận"],
  ["Gò Vấp", "Tân Bình"],
  ["Quận 7", "Thủ Đức"],
  ["Online"],
];

const levels: Tutor["level"][] = ["Sinh viên", "Giáo viên", "Cử nhân", "Thạc sĩ"];

const generatedTutors: Tutor[] = additionalNames.map((name, index) => {
  const template = featuredTutors[index % featuredTutors.length];
  const subjects = subjectSets[index % subjectSets.length];
  return {
    ...template,
    id: `gia-su-${String(index + 9).padStart(2, "0")}`,
    code: `MT${String(index + 9).padStart(3, "0")}`,
    name,
    birthYear: 1994 + (index % 10),
    gender: index % 2 === 0 ? "Nữ" : "Nam",
    school: schoolOptions[index % schoolOptions.length],
    major: subjects[0],
    level: levels[index % levels.length],
    subjects,
    grades: [`Lớp ${4 + (index % 9)}`, `Lớp ${5 + (index % 8)}`],
    areas: areaSets[index % areaSets.length],
    experience: `${2 + (index % 6)} năm kinh nghiệm dạy kèm và xây dựng lộ trình học.`,
    achievements: ["Có phản hồi tích cực từ học sinh"],
    teachingStyle: index % 2 === 0 ? "Kiên nhẫn, hệ thống và dễ hiểu." : "Tương tác tích cực, chú trọng thực hành.",
    expectedSalary: `${180 + (index % 5) * 40}.000đ/buổi`,
    rating: Number((4.6 + (index % 4) * 0.1).toFixed(1)),
    reviewCount: 8 + index,
  };
});

export const tutors: Tutor[] = [...featuredTutors, ...generatedTutors];
