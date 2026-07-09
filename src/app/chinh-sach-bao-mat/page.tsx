import type { Metadata } from "next";
import { LegalPage } from "@/components/common/LegalPage";

export const metadata: Metadata = { title: "Chính sách bảo mật", description: "Chính sách về thu thập và bảo vệ thông tin tại Gia Sư Tài Năng." };
export default function PrivacyPage() {
  return <LegalPage title="Chính sách bảo mật" description="Cách Tài Năng tiếp nhận, sử dụng và bảo vệ thông tin người dùng trên website." sections={[
    { title: "Thông tin được tiếp nhận", content: "Website có thể tiếp nhận họ tên, thông tin liên hệ, nhu cầu học tập và thông tin hồ sơ do người dùng chủ động nhập vào biểu mẫu." },
    { title: "Mục đích sử dụng", content: "Thông tin được dùng cho mục đích tư vấn, kết nối nhu cầu học tập, xác minh hồ sơ gia sư và cải thiện trải nghiệm sử dụng. Tài Năng không sử dụng dữ liệu cho mục đích ngoài phạm vi đã thông báo." },
    { title: "Bảo vệ và chia sẻ", content: "Quyền truy cập dữ liệu cần được giới hạn theo vai trò. Tài Năng không chia sẻ thông tin cá nhân cho bên thứ ba khi chưa có căn cứ phù hợp hoặc sự đồng ý của người dùng." },
    { title: "Quyền của người dùng", content: "Người dùng có thể yêu cầu xem lại, điều chỉnh hoặc xóa thông tin đã cung cấp thông qua hotline, email hoặc biểu mẫu liên hệ trên website." },
  ]} />;
}
