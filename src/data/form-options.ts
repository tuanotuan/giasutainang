export const subjectOptions = [
  "Toán",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Ngữ văn",
  "Tiếng Anh",
  "Tiếng Việt",
  "Rèn chữ đẹp",
  "Báo bài",
  "Luyện thi chuyển cấp",
  "Luyện thi đại học",
  "Luyện thi học sinh giỏi",
  "IELTS",
  "TOEIC",
  "TOEFL",
  "KET/PET",
  "Tiếng Nhật",
  "Tiếng Hàn",
  "Tiếng Trung",
  "Tiếng Pháp",
  "Tin học",
  "Lập trình",
  "Vẽ",
  "Piano",
  "Guitar",
  "Organ",
  "Thanh nhạc",
  "Cờ vua",
  "Kỹ năng sống",
  "Khác",
];

export const gradeOptions = [
  "Lớp Lá",
  ...Array.from({ length: 12 }, (_, index) => `Lớp ${index + 1}`),
  "Luyện thi đại học",
  "Lớp năng khiếu",
  "Lớp ngoại ngữ",
  "Lớp người lớn",
];

export const areaOptions = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Bình Thạnh",
  "Gò Vấp",
  "Tân Bình",
  "Tân Phú",
  "Phú Nhuận",
  "Thủ Đức",
  "Bình Tân",
  "Hóc Môn",
  "Bình Chánh",
  "Online",
];

export const tutorLevels = ["Sinh viên", "Giáo viên", "Cử nhân", "Thạc sĩ", "Không yêu cầu"];
export const studentLevels = ["Giỏi", "Khá", "Trung bình", "Yếu", "Kém"];
export const genderOptions = ["Nam", "Nữ", "Không yêu cầu"];

export const availableTimeOptions = [
  ...["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].flatMap((day) =>
    ["sáng", "chiều", "tối"].map((period) => `${day} ${period}`),
  ),
];
