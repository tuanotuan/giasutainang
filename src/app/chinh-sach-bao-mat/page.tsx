import type { Metadata } from "next";
import { LegalPage } from "@/components/common/LegalPage";

export const metadata: Metadata = { title: "Chính sách bảo mật", description: "Chính sách mô phỏng về thu thập và bảo vệ thông tin tại Gia Sư Tài Năng." };
export default function PrivacyPage() {
  return <LegalPage title="Chính sách bảo mật" description="Cách Tài Năng tiếp nhận, sử dụng và bảo vệ thông tin trong phiên bản website mô phỏng." sections={[
    { title: "Thông tin được tiếp nhận", content: "Website có thể tiếp nhận họ tên, thông tin liên hệ, nhu cầu học tập và thông tin hồ sơ do người dùng chủ động nhập vào biểu mẫu. Phiên bản hiện tại không gửi dữ liệu tới máy chủ và chỉ log trong trình duyệt để minh họa." },
    { title: "Mục đích sử dụng", content: "Thông tin được mô phỏng cho mục đích tư vấn, kết nối nhu cầu học tập, xác minh hồ sơ gia sư và cải thiện trải nghiệm sử dụng. Tài Năng không sử dụng dữ liệu cho mục đích ngoài phạm vi đã thông báo." },
    { title: "Bảo vệ và chia sẻ", content: "Trong sản phẩm thực tế, quyền truy cập cần được giới hạn theo vai trò, dữ liệu nhạy cảm phải được mã hóa và không chia sẻ cho bên thứ ba khi chưa có căn cứ phù hợp hoặc sự đồng ý của người dùng." },
    { title: "Quyền của người dùng", content: "Người dùng có thể yêu cầu xem lại, điều chỉnh hoặc xóa thông tin đã cung cấp. Kênh liên hệ mô phỏng trên website được dùng để tiếp nhận các yêu cầu này." },
  ]} />;
}
