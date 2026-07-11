import {
  Award,
  BadgeCheck,
  BookOpenCheck,
  BrainCircuit,
  GraduationCap,
  HandCoins,
  Headphones,
  Languages,
  Laptop,
  Medal,
  Music2,
  RefreshCcw,
  School,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export const siteConfig = {
  name: "Gia Sư Tài Năng",
  tagline: "Kết nối tri thức",
  phone: "0365002142",
  email: "tuan.hcmus77@gmail.com",
  hours: "06:00 - 22:00, hằng ngày",
  address: "135/1 Nguyễn Hữu Cảnh, TP. Hồ Chí Minh, Việt Nam",
  zalo: "https://zalo.me/0365002142",
  facebook: "https://www.facebook.com/gstainang",
  logo: "/images/gia-su-tai-nang-logo.jpg",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://giasutainang.online",
};

export const navigation = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Tìm gia sư", href: "/dang-ky-tim-gia-su" },
  { label: "Gia sư tiêu biểu", href: "/gia-su-tieu-bieu" },
  { label: "Bảng giá", href: "/bang-gia-gia-su" },
  { label: "Trở thành gia sư", href: "/dang-ky-tro-thanh-gia-su" },
  { label: "Lớp mới", href: "/lop-moi" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

export const subjects = [
  "Toán", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học",
  "Tiếng Việt", "Báo bài", "IELTS", "TOEIC", "Tiếng Nhật", "Piano",
];

export const grades = [
  "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5", "Lớp 6",
  "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12",
];

export const areas = [
  "Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận 10",
  "Bình Thạnh", "Gò Vấp", "Tân Bình", "Phú Nhuận", "Thủ Đức",
];

export const stats = [
  { value: "1-1", label: "Lộ trình theo từng học sinh", icon: Users },
  { value: "30+", label: "Môn học và kỹ năng", icon: GraduationCap },
  { value: "7 ngày", label: "Hỗ trợ trong tuần", icon: Medal },
  { value: "Toàn quốc", label: "Tư vấn học trực tuyến", icon: RefreshCcw },
];

export const learningGroups = [
  { title: "Mầm non & tiểu học", icon: School },
  { title: "Lớp 1 đến lớp 12", icon: BookOpenCheck },
  { title: "Luyện thi chuyển cấp", icon: Target },
  { title: "Luyện thi đại học", icon: GraduationCap },
  { title: "Chứng chỉ tiếng Anh", icon: Award },
  { title: "Ngoại ngữ", icon: Languages },
  { title: "Năng khiếu & tin học", icon: Music2 },
  { title: "Bồi dưỡng học sinh giỏi", icon: Sparkles },
];

export const processSteps = [
  { title: "Đăng ký nhu cầu", description: "Chia sẻ môn học, lịch học và mong muốn của gia đình." },
  { title: "Tiếp nhận & tư vấn", description: "Chuyên viên gọi lại để làm rõ nhu cầu và ngân sách." },
  { title: "Nhận hồ sơ phù hợp", description: "Gia đình xem hồ sơ gia sư đã được sàng lọc." },
  { title: "Học thử & đồng hành", description: "Bắt đầu học và được hỗ trợ xuyên suốt quá trình." },
];

export const reasons = [
  { title: "Hồ sơ rõ ràng", description: "Thông tin học vấn và kinh nghiệm được đối chiếu.", icon: BadgeCheck },
  { title: "Đánh giá năng lực", description: "Chọn người dạy phù hợp với mục tiêu của học sinh.", icon: BrainCircuit },
  { title: "Học thử tuần đầu", description: "Cùng đánh giá cách dạy trước khi học lâu dài.", icon: SearchCheck },
  { title: "Tối ưu chi phí", description: "Mức phí minh bạch theo nhu cầu và ngân sách.", icon: HandCoins },
  { title: "Hỗ trợ đổi gia sư", description: "Điều chỉnh nhanh nếu phương pháp chưa phù hợp.", icon: RefreshCcw },
  { title: "Tư vấn miễn phí", description: "Đội ngũ hỗ trợ 7 ngày trong tuần.", icon: Headphones },
];

export const services = [
  { title: "Dạy kèm 1-1", description: "Lộ trình cá nhân hóa tại nhà hoặc online.", icon: Users, tone: "blue" },
  { title: "Lớp học nhóm", description: "Học cùng bạn, tương tác tốt và tiết kiệm chi phí.", icon: School, tone: "orange" },
  { title: "Tìm gia sư miễn phí", description: "Tiếp nhận và đề xuất hồ sơ không thu phí kết nối.", icon: SearchCheck, tone: "green" },
  { title: "Luyện thi chuyển cấp", description: "Ôn tập có trọng tâm cho các kỳ thi quan trọng.", icon: Target, tone: "violet" },
  { title: "Luyện thi chuyên", description: "Bồi dưỡng nâng cao cho học sinh giỏi, trường chuyên.", icon: Medal, tone: "rose" },
  { title: "Phòng học nhỏ", description: "Không gian yên tĩnh cho nhóm từ 2 đến 8 học viên.", icon: Laptop, tone: "cyan" },
];

export const assurances = [
  "Không thu phí tư vấn từ phụ huynh",
  "Thông tin gia đình được bảo mật",
  "Theo dõi chất lượng sau khi ghép lớp",
  "Gia sư phù hợp mới bắt đầu học",
];

export { ShieldCheck };
