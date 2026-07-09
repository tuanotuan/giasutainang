import type { Metadata } from "next";
import { LegalPage } from "@/components/common/LegalPage";

export const metadata: Metadata = { title: "Điều khoản sử dụng", description: "Điều khoản sử dụng mô phỏng của website Gia Sư Tài Năng." };
export default function TermsPage() {
  return <LegalPage title="Điều khoản sử dụng" description="Các nguyên tắc cơ bản khi truy cập và sử dụng nền tảng kết nối gia sư mô phỏng." sections={[
    { title: "Phạm vi dịch vụ", content: "Tài Năng đóng vai trò nền tảng mô phỏng kết nối nhu cầu học tập và hồ sơ gia sư. Website không bảo đảm kết quả điểm số cụ thể và không thay thế trách nhiệm trao đổi trực tiếp giữa gia đình với người dạy." },
    { title: "Trách nhiệm cung cấp thông tin", content: "Người dùng cần cung cấp thông tin trung thực, tôn trọng quyền riêng tư của người khác và không đăng tải nội dung gây nhầm lẫn. Hồ sơ có dấu hiệu không chính xác có thể bị tạm ẩn để xác minh." },
    { title: "Thỏa thuận học phí", content: "Học phí hiển thị chỉ có tính tham khảo. Gia đình và gia sư cần thống nhất rõ mức phí, lịch thanh toán, chính sách nghỉ học và các chi phí liên quan trước khi bắt đầu." },
    { title: "Thay đổi điều khoản", content: "Nội dung có thể được điều chỉnh khi tính năng hoặc quy trình vận hành thay đổi. Phiên bản cập nhật sẽ ghi rõ thời điểm áp dụng trên trang này." },
  ]} />;
}
