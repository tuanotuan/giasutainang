# Gia Sư Tài Năng — Product Specification

## Current implementation override

This section is the source of truth for the current production system and overrides obsolete phase-one requirements below.

- Production brand: **Gia Sư Tài Năng**; tagline: **Kết nối tri thức**.
- Production domain: `https://giasutainang.online` and `www.giasutainang.online`.
- Contact: hotline/Zalo `0357570667`, email `tuan.hcmus77@gmail.com`, Facebook `https://www.facebook.com/gstainang`.
- Address: `135/1 Nguyễn Hữu Cảnh, TP. Hồ Chí Minh, Việt Nam`; hours: `06:00 - 22:00` daily.
- Hosting/deployment: GitHub `tuanotuan/giasutainang` → automatic Cloudflare Workers deployment from `main`.
- Backend: Cloudflare Worker API + D1 database, real admin login, CRUD for classes/tutors/posts/prices, and persisted public submissions.
- Smart features: tutor matching, Zalo draft, class-post draft, tutor-profile audit, learning roadmap, operations report, and public quick-answer assistant via Workers AI with non-AI fallbacks.
- Address form: province/city → district/area → ward/commune cascading selectors; only house number/street is typed manually.
- Form validation UX: changing cascading selections must not show required-field errors. Errors appear only after submit; invalid submit smoothly scrolls to and focuses the first missing field.
- Parent tutor requests offer only `Tại nhà` and `Online`; group size is inferred from the student-count field instead of a redundant `Học nhóm` option.
- The parent request form labels student performance as `Học lực kỳ học gần nhất` to give families a clear reference period.
- The expected-budget field uses a natural-language example (`2 triệu/tháng`) and provides an immediate pricing-page link that opens in a new tab so form progress is preserved.
- Mobile usability is mandatory for all changes: test 320/375/390/430px, 44px touch targets, safe areas, no horizontal overflow, and no fixed control covering content.
- Seed tutor/class/article content remains illustrative; do not misrepresent fabricated profiles as verified real people.

## Session handoff

- Latest completed change: pricing reference opens in a new tab so the in-progress tutor request remains intact.
- Required checks before handoff: `npm run lint`, `npm run build`, and `npx wrangler deploy --dry-run` when Worker/config changes.
- After every modification, review and update `spec.md`, `agents.md`, and `README.md`, then commit and push all documentation with the implementation.
- Last updated: 2026-07-11.

## Original phase-one brief (historical reference)

Tôi muốn bạn build một website trung tâm gia sư lấy cảm hứng từ mô hình website giasumienphi.edu.vn, nhưng KHÔNG sao chép logo, tên thương hiệu, hình ảnh, nội dung bài viết, số điện thoại, địa chỉ, dữ liệu thật hoặc nhận diện thương hiệu của website gốc.

Hãy tạo một thương hiệu giả tên: “Gia Sư Minh Tâm”.

Mục tiêu:

* Website tiếng Việt.
* Chủ đề: trung tâm gia sư dạy kèm tại nhà và online.
* Phục vụ 2 nhóm người dùng:

  1. Phụ huynh/học sinh muốn tìm gia sư.
  2. Sinh viên/giáo viên muốn đăng ký làm gia sư hoặc nhận lớp.
* Website phải có cảm giác như một trung tâm gia sư thật ở Việt Nam: nhiều thông tin, CTA rõ, form đăng ký nổi bật, danh sách gia sư, danh sách lớp, bảng giá, bài viết tư vấn.
* Giao diện hiện đại hơn website tham khảo: sạch, rõ, đẹp, responsive, không rối.
* Dùng dữ liệu giả hoàn toàn.

Tech stack:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui nếu cần
* Lucide React icons
* React Hook Form + Zod cho form validation
* Mock data trong `/src/data`
* Không cần backend thật ở version đầu
* Không cần authentication thật ở version đầu
* Có thể chuẩn bị cấu trúc dễ nâng cấp lên Prisma/PostgreSQL sau này

Phong cách UI:

* Tone màu chính: xanh dương giáo dục hoặc xanh lá tin cậy.
* Màu CTA phụ: cam/vàng.
* Background trắng/xám nhạt.
* Card bo góc 16px, shadow nhẹ.
* Font: Inter hoặc system font.
* Layout rộng rãi, rõ ràng.
* Nút gọi điện/Zalo/đăng ký luôn nổi bật.
* Mobile friendly.
* Có floating contact buttons ở góc phải dưới:

  * Gọi ngay
  * Zalo
  * Chat
  * Đăng ký tìm gia sư

Cấu trúc route cần làm:

1. `/`
   Trang chủ.

Sections:

* Top contact bar:

  * Hotline giả
  * Email giả
  * Giờ làm việc
  * Link Zalo giả
* Header:

  * Logo text “Gia Sư Minh Tâm”
  * Menu desktop
  * Mobile hamburger menu
* Menu chính:

  * Trang chủ
  * Giới thiệu
  * Tìm gia sư
  * Gia sư tiêu biểu
  * Bảng giá
  * Trở thành gia sư
  * Lớp mới
  * Tin tức
  * Liên hệ
* Hero section:

  * Headline: “Tìm gia sư dạy kèm tại nhà và online nhanh chóng”
  * Subtitle: “Kết nối phụ huynh với gia sư phù hợp theo môn học, khu vực, trình độ và ngân sách.”
  * CTA chính: “Đăng ký tìm gia sư”
  * CTA phụ: “Xem gia sư tiêu biểu”
  * Mini search/filter box:

    * Môn học
    * Lớp
    * Khu vực
    * Hình thức: tại nhà / online
* Stats section:

  * 1000+ học sinh
  * 500+ gia sư
  * 700+ học sinh tiến bộ
  * 500+ phụ huynh quay lại
* Intro section:

  * Giới thiệu ngắn về trung tâm.
  * Các nhóm dịch vụ:

    * Mầm non và tiểu học
    * Lớp 1 đến lớp 12
    * Luyện thi chuyển cấp
    * Luyện thi đại học
    * Luyện thi chứng chỉ tiếng Anh: IELTS, TOEIC, TOEFL, KET, PET
    * Ngoại ngữ: Anh, Nhật, Hàn, Trung, Pháp
    * Năng khiếu: vẽ, đàn, piano, guitar, tin học
    * Bồi dưỡng học sinh giỏi
* Quy trình làm việc:

  1. Phụ huynh đăng ký nhu cầu
  2. Trung tâm tiếp nhận và tư vấn
  3. Gửi hồ sơ gia sư phù hợp
  4. Học thử và theo dõi lâu dài
* Vì sao chọn trung tâm:

  * Gia sư có hồ sơ rõ ràng
  * Có kiểm tra trình độ
  * Dạy thử tuần đầu
  * Tối ưu chi phí
  * Hỗ trợ đổi gia sư nếu không phù hợp
  * Tư vấn miễn phí
* Dịch vụ nổi bật:

  * Dạy kèm 1-1 tại nhà hoặc online
  * Lớp học nhóm tiết kiệm
  * Tìm kiếm gia sư miễn phí
  * Luyện thi chuyển cấp/đại học
  * Luyện thi học sinh giỏi/trường chuyên
  * Thuê phòng học nhỏ
* Đội ngũ gia sư tiêu biểu:

  * Hiển thị 8 gia sư dạng card.
  * Mỗi card có avatar placeholder, tên giả, năm sinh, trường, chuyên ngành, môn dạy, rating.
* Lớp mới cần gia sư:

  * Hiển thị 6 lớp mới.
  * Có nút xem tất cả.
* Bảng giá tóm tắt:

  * Gia sư sinh viên
  * Gia sư giáo viên
  * Gia sư online
  * Gia sư luyện thi
* Tin tức/tư vấn mới:

  * 3-6 bài viết.
* Footer:

  * Thông tin trung tâm giả
  * Dịch vụ
  * Chính sách
  * Hướng dẫn
  * Liên kết mạng xã hội giả

2. `/gioi-thieu`
   Trang giới thiệu.
   Nội dung:

* Giới thiệu trung tâm.
* Sứ mệnh.
* Cam kết.
* Thành tích.
* Quy trình kiểm duyệt gia sư.
* Các nhóm học sinh được hỗ trợ.
* CTA đăng ký tìm gia sư.

3. `/dang-ky-tim-gia-su`
   Trang form phụ huynh đăng ký tìm gia sư.

Form gồm:

* Họ tên phụ huynh
* Số điện thoại
* Email
* Địa chỉ/khu vực
* Hình thức học: tại nhà / online / học nhóm
* Lớp học:

  * Lớp Lá
  * Lớp 1 đến Lớp 12
  * Luyện thi đại học
  * Lớp năng khiếu
  * Lớp ngoại ngữ
  * Lớp người lớn
* Môn học:

  * Toán
  * Lý
  * Hóa
  * Văn
  * Tiếng Anh
  * Tiếng Việt
  * Rèn chữ đẹp
  * Báo bài
  * Luyện thi chuyển cấp
  * Luyện thi đại học
  * Luyện thi học sinh giỏi
  * IELTS
  * TOEIC
  * TOEFL
  * KET/PET
  * Tiếng Nhật
  * Tiếng Hàn
  * Tiếng Trung
  * Tin học
  * Vẽ
  * Piano
  * Guitar
  * Khác
* Số lượng học sinh
* Học lực kỳ học gần nhất:

  * Giỏi
  * Khá
  * Trung bình
  * Yếu
  * Kém
* Số buổi/tuần:

  * 1 đến 7 buổi
* Thời gian học mong muốn
* Yêu cầu trình độ gia sư:

  * Sinh viên
  * Giáo viên
  * Cử nhân
  * Thạc sĩ
  * Không yêu cầu
* Yêu cầu giới tính:

  * Nam
  * Nữ
  * Không yêu cầu
* Mã số gia sư đã chọn, optional
* Ngân sách dự kiến
* Yêu cầu khác
* Checkbox đồng ý liên hệ tư vấn
* Submit button: “Đăng ký tìm gia sư”

Validation:

* Họ tên bắt buộc.
* Số điện thoại bắt buộc, 9-11 số.
* Môn học bắt buộc.
* Lớp học bắt buộc.
* Số buổi bắt buộc.
* Sau khi submit hiển thị toast: “Đã gửi yêu cầu. Trung tâm sẽ liên hệ tư vấn.”

Bên phải form có sidebar:

* Quy trình 4 bước.
* Cam kết tư vấn miễn phí.
* Box hotline/Zalo.
* Cảnh báo phụ huynh nên kiểm tra giấy tờ gia sư, nhưng viết bằng nội dung mới, không copy website gốc.

4. `/dang-ky-tro-thanh-gia-su`
   Trang form đăng ký làm gia sư.

Form gồm:

* Họ tên
* Số điện thoại
* Email
* Năm sinh
* Giới tính
* Trường đang học/đã tốt nghiệp
* Chuyên ngành
* Nghề nghiệp hiện tại:

  * Sinh viên
  * Giáo viên
  * Cử nhân
  * Thạc sĩ
  * Khác
* Kinh nghiệm dạy
* Môn có thể dạy
* Lớp có thể dạy:

  * Lớp Lá
  * Lớp 1 đến Lớp 12
  * Luyện thi đại học
  * Lớp năng khiếu
  * Lớp ngoại ngữ
  * Lớp người lớn
* Khu vực có thể dạy:

  * Quận 1
  * Quận 3
  * Quận 5
  * Quận 7
  * Quận 10
  * Quận 12
  * Bình Thạnh
  * Gò Vấp
  * Tân Bình
  * Tân Phú
  * Phú Nhuận
  * Thủ Đức
  * Bình Tân
  * Hóc Môn
  * Bình Chánh
  * Online
* Thời gian có thể dạy:

  * Thứ 2 sáng/chiều/tối
  * Thứ 3 sáng/chiều/tối
  * Thứ 4 sáng/chiều/tối
  * Thứ 5 sáng/chiều/tối
  * Thứ 6 sáng/chiều/tối
  * Thứ 7 sáng/chiều/tối
  * Chủ nhật sáng/chiều/tối
* Lương tối thiểu mong muốn / 1 buổi
* Ảnh đại diện optional
* File hồ sơ optional, chỉ mock UI
* Yêu cầu khác
* Submit button: “Đăng ký làm gia sư”

Sau submit hiển thị toast thành công.

Trang có sections:

* Lợi ích khi làm gia sư:

  * Chủ động chọn lớp
  * Lớp cập nhật thường xuyên
  * Thu nhập tốt
  * Hỗ trợ tư vấn
* Quy trình nhận lớp:

  1. Đăng ký hồ sơ
  2. Trung tâm xác minh
  3. Chọn lớp phù hợp
  4. Nhận lớp và bắt đầu dạy
* Danh sách lớp mới gợi ý.

5. `/gia-su-tieu-bieu`
   Trang danh sách gia sư tiêu biểu.

Layout:

* Hero/title: “Danh sách gia sư tiêu biểu”
* Filter:

  * Từ khóa
  * Môn dạy
  * Lớp dạy
  * Khu vực
  * Trình độ
  * Giới tính
* Grid card gia sư.

Tutor card gồm:

* Avatar placeholder
* Mã gia sư
* Tên giả
* Năm sinh
* Trường/đơn vị
* Chuyên ngành
* Môn dạy
* Lớp dạy được
* Khu vực
* Rating
* Nút “Xem hồ sơ”
* Nút “Chọn gia sư này”

6. `/gia-su-tieu-bieu/[id]`
   Trang chi tiết gia sư.
   Hiển thị:

* Avatar lớn
* Mã gia sư
* Họ tên
* Năm sinh
* Giới tính
* Trường
* Chuyên ngành
* Trình độ
* Môn dạy
* Khu vực dạy
* Thời gian rảnh
* Kinh nghiệm
* Thành tích
* Phong cách dạy
* Học phí tham khảo
* CTA:

  * “Yêu cầu gia sư này”
  * “Đăng ký tư vấn”
* Gia sư liên quan.

7. `/lop-moi`
   Trang danh sách lớp mới cần gia sư.

Filter:

* Từ khóa
* Môn học
* Lớp
* Khu vực
* Hình thức học
* Số buổi/tuần
* Lương tối thiểu
* Trạng thái:

  * Chưa giao
  * Đã giao
  * Giảm phí
* Sort:

  * Mới nhất
  * Lương cao nhất
  * Lương thấp nhất

Class card gồm:

* Mã lớp
* Trạng thái
* Lớp/môn
* Học viên
* Địa chỉ/khu vực
* Số buổi/tuần
* Thời gian học
* Học phí/lương
* Yêu cầu gia sư
* Ghi chú
* Nút “Nhận lớp”
* Nút “Xem chi tiết”

8. `/lop-moi/[id]`
   Trang chi tiết lớp.
   Hiển thị:

* Mã lớp
* Trạng thái
* Môn học
* Lớp
* Số học sinh
* Học lực
* Khu vực
* Địa chỉ gần đúng
* Số buổi
* Thời gian học
* Học phí/lương
* Yêu cầu gia sư
* Ghi chú
* CTA nhận lớp.
* Form đăng ký nhận lớp ngắn:

  * Họ tên gia sư
  * Số điện thoại
  * Email
  * Kinh nghiệm
  * Lời nhắn
* Lớp liên quan.

9. `/bang-gia-gia-su`
   Trang bảng giá gia sư.

Sections:

* Hero: “Bảng giá gia sư tham khảo”
* Tabs hoặc bảng theo nhóm:

  * Mầm non/Tiểu học
  * THCS
  * THPT
  * Luyện thi chuyển cấp
  * Luyện thi đại học
  * Ngoại ngữ
  * Năng khiếu
  * Online
* Bảng có cột:

  * Cấp học/môn học
  * Gia sư sinh viên
  * Gia sư giáo viên
  * Số buổi/tuần
  * Thời lượng/buổi
  * Học phí tham khảo/tháng
* Note:

  * Mỗi buổi thường 90 phút.
  * Học phí có thể thay đổi theo môn học, khu vực, số học viên, trình độ gia sư.
  * Học phí thanh toán trực tiếp theo thỏa thuận.
* CTA:

  * “Nhận tư vấn học phí”
  * “Đăng ký tìm gia sư”

10. `/dich-vu`
    Trang tổng hợp dịch vụ.
    Cards:

* Dạy kèm 1-1 tại nhà hoặc online
* Lớp học nhóm tiết kiệm
* Tìm kiếm gia sư miễn phí
* Luyện thi chuyển cấp/đại học
* Luyện thi học sinh giỏi/trường chuyên
* Thuê phòng học nhỏ
* Gia sư ngoại ngữ
* Gia sư năng khiếu

11. `/dich-vu/[slug]`
    Trang SEO dịch vụ.
    Tạo các slug:

* `day-kem-1-1-tai-nha-hoac-online`
* `lop-hoc-nhom-tiet-kiem`
* `tim-gia-su-mien-phi`
* `luyen-thi-chuyen-cap`
* `luyen-thi-dai-hoc`
* `luyen-thi-hoc-sinh-gioi`
* `gia-su-ngoai-ngu`
* `gia-su-nang-khieu`

Layout:

* H1 theo dịch vụ.
* Nội dung mock 800-1200 chữ.
* Lợi ích.
* Đối tượng phù hợp.
* Quy trình đăng ký.
* Bảng giá liên quan.
* Gia sư liên quan.
* FAQ.
* CTA.

12. `/tin-tuc`
    Trang blog/tin tức.
    Category:

* Kinh nghiệm tìm gia sư
* Kinh nghiệm làm gia sư
* Phương pháp học tập
* Luyện thi
* Cảnh báo phụ huynh
* Hỏi đáp

Blog card:

* Thumbnail placeholder
* Title
* Excerpt
* Category
* Date
* Read more

13. `/tin-tuc/[slug]`
    Trang chi tiết bài viết.

* H1
* Date
* Category
* Table of contents
* Nội dung mock có h2/h3
* Related posts
* Sidebar CTA đăng ký tìm gia sư.

14. `/lien-he`
    Trang liên hệ.

* Thông tin trung tâm giả:

  * Địa chỉ giả
  * Hotline giả
  * Email giả
  * Facebook giả
  * Zalo giả
* Form liên hệ:

  * Họ tên
  * Số điện thoại
  * Email
  * Nội dung
* Map placeholder.
* CTA lớn.

15. `/chinh-sach-bao-mat`
    Trang chính sách bảo mật, viết nội dung mock.

16. `/dieu-khoan-su-dung`
    Trang điều khoản sử dụng, viết nội dung mock.

17. `/admin`
    Admin dashboard mock.
    Không cần login thật.

Các mục:

* Dashboard
* Quản lý lớp mới
* Quản lý gia sư
* Quản lý yêu cầu tìm gia sư
* Quản lý bài viết

Dashboard:

* Tổng học sinh
* Tổng gia sư
* Lớp chưa giao
* Yêu cầu mới
* Biểu đồ giả hoặc stats cards.

Quản lý lớp:

* Table class items.
* Add/edit/delete bằng local state.
* Filter trạng thái.

Quản lý gia sư:

* Table tutors.
* Add/edit/delete bằng local state.
* Filter môn/khu vực.

Quản lý yêu cầu:

* Table requests từ form mock.
* Trạng thái:

  * Mới
  * Đã gọi
  * Đã ghép gia sư
  * Hủy

Data types:

Tutor:

* id: string
* code: string
* name: string
* birthYear: number
* gender: "Nam" | "Nữ"
* avatar: string
* school: string
* major: string
* level: "Sinh viên" | "Giáo viên" | "Cử nhân" | "Thạc sĩ"
* subjects: string[]
* grades: string[]
* areas: string[]
* availableTimes: string[]
* experience: string
* achievements: string[]
* teachingStyle: string
* expectedSalary: string
* rating: number
* reviewCount: number

ClassItem:

* id: string
* code: string
* status: "open" | "assigned" | "discount"
* title: string
* subject: string
* grade: string
* studentCount: number
* studentLevel: "Giỏi" | "Khá" | "Trung bình" | "Yếu" | "Kém"
* area: string
* address: string
* learningMode: "Tại nhà" | "Online" | "Học nhóm"
* sessionsPerWeek: number
* duration: string
* schedule: string
* tutorRequirement: string
* salary: number
* note: string
* createdAt: string

TutorRequest:

* id: string
* parentName: string
* phone: string
* email?: string
* area: string
* grade: string
* subjects: string[]
* studentCount: number
* studentLevel: string
* sessionsPerWeek: number
* schedule: string
* tutorLevel: string
* tutorGender: string
* budget: string
* note?: string
* status: "new" | "called" | "matched" | "cancelled"
* createdAt: string

Post:

* id: string
* slug: string
* title: string
* excerpt: string
* category: string
* thumbnail: string
* date: string
* content: string

PriceItem:

* id: string
* category: string
* subjectOrGrade: string
* studentTutorPrice: string
* teacherTutorPrice: string
* sessionsPerWeek: string
* duration: string
* note?: string

Mock data yêu cầu:

* 40 gia sư giả.
* 30 lớp mới giả.
* 12 bài viết giả.
* 30 môn học.
* 20 khu vực TPHCM.
* 8 nhóm bảng giá.

Component structure:

* `/src/components/layout/TopContactBar.tsx`
* `/src/components/layout/Header.tsx`
* `/src/components/layout/Footer.tsx`
* `/src/components/layout/MobileMenu.tsx`
* `/src/components/common/FloatingContactButtons.tsx`
* `/src/components/common/SectionTitle.tsx`
* `/src/components/common/CTABox.tsx`
* `/src/components/home/Hero.tsx`
* `/src/components/home/StatsSection.tsx`
* `/src/components/home/ProcessSection.tsx`
* `/src/components/home/WhyChooseUs.tsx`
* `/src/components/home/ServiceGrid.tsx`
* `/src/components/tutors/TutorCard.tsx`
* `/src/components/tutors/TutorFilter.tsx`
* `/src/components/classes/ClassCard.tsx`
* `/src/components/classes/ClassFilter.tsx`
* `/src/components/forms/FindTutorForm.tsx`
* `/src/components/forms/RegisterTutorForm.tsx`
* `/src/components/forms/ReceiveClassForm.tsx`
* `/src/components/pricing/PricingTable.tsx`
* `/src/components/blog/PostCard.tsx`
* `/src/components/admin/AdminSidebar.tsx`
* `/src/components/admin/AdminStats.tsx`

Yêu cầu SEO:

* Mỗi page có metadata title/description tiếng Việt.
* Dùng heading semantic.
* Có breadcrumb ở trang chi tiết.
* URL slug tiếng Việt không dấu.
* Nội dung mock không copy từ web thật.

Yêu cầu kỹ thuật:

* Project chạy được ngay.
* TypeScript không lỗi.
* Tailwind responsive đầy đủ.
* Forms có validation.
* Submit form chỉ toast thành công và log data ra console/local state.
* Dữ liệu nằm trong `/src/data`.
* Types nằm trong `/src/types`.
* Utility filter/search nằm trong `/src/lib`.
* Có README hướng dẫn:

  * Install
  * Run dev
  * Build
  * Cấu trúc thư mục
  * Cách thêm dữ liệu mock

Quan trọng:

* Không dùng tên “Gia Sư Miễn Phí” trong UI.
* Không dùng số điện thoại, địa chỉ, email, tài khoản ngân hàng, link Facebook/Zalo thật.
* Không dùng ảnh thật từ website tham khảo.
* Không copy nội dung bài viết thật.
* Chỉ lấy cảm hứng từ cấu trúc: homepage dịch vụ gia sư, form tìm gia sư, form trở thành gia sư, danh sách gia sư tiêu biểu, danh sách lớp mới, bảng giá, tin tức, liên hệ.
