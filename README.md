# Gia Sư Tài Năng

Website tiếng Việt của trung tâm Gia Sư Tài Năng, xây dựng với Next.js App Router, TypeScript và Tailwind CSS. Thông tin thương hiệu và liên hệ đã được cập nhật; hồ sơ gia sư, lớp học, học phí và bài viết hiện vẫn là dữ liệu mẫu.

## Cài đặt

Yêu cầu Node.js 20 trở lên.

```bash
npm install
```

Có thể khai báo URL website thật khi deploy:

```bash
NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban.vn
```

## Chạy môi trường phát triển

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Build production

```bash
npm run build
```

Static export được tạo trong thư mục `out/`.

## Deploy miễn phí lên Cloudflare Workers Static Assets

1. Vào Cloudflare Dashboard → Compute → Workers & Pages.
2. Chọn Create application → Connect GitHub.
3. Chọn repository `tuanotuan/giasutainang`.
4. Cấu hình:

```text
Production branch: main
Build command: npm run build
Deploy command: npx wrangler deploy
Non-production deploy command: npx wrangler versions upload
Root directory: /
```

5. Thêm biến môi trường:

```text
NEXT_PUBLIC_SITE_URL=https://giasutainang.online
```

6. Deploy và thêm custom domain sau khi bản build thành công.

## Cấu trúc thư mục

```text
src/
├── app/                 # App Router, metadata và các trang
├── components/
│   ├── blog/            # Card bài viết
│   ├── admin/           # Dashboard và thành phần quản trị mock
│   ├── classes/         # Card lớp học
│   ├── common/          # Thành phần UI dùng chung
│   ├── forms/           # Form và field dùng chung
│   ├── home/            # Các section của trang chủ
│   ├── layout/          # Header, footer, top bar, mobile menu
│   ├── pricing/         # Bảng học phí
│   └── tutors/          # Card gia sư
├── data/                # Toàn bộ dữ liệu mô phỏng
├── lib/                 # Hàm tiện ích
└── types/               # Kiểu dữ liệu TypeScript
```

## Thêm dữ liệu mô phỏng

- Thêm hồ sơ gia sư trong `src/data/tutors.ts` theo interface `Tutor`.
- Thêm lớp mới trong `src/data/classes.ts` theo interface `ClassItem`.
- Thêm bài tư vấn trong `src/data/posts.ts` theo interface `Post`.
- Thêm gói học phí trong `src/data/prices.ts` theo interface `PriceItem`.
- Nội dung chung, menu, môn học và khu vực nằm trong `src/data/site.ts`.
- Nội dung các trang dịch vụ nằm trong `src/data/services.ts`.
- Yêu cầu tìm gia sư dùng cho admin mock nằm trong `src/data/requests.ts`.

Các interface được khai báo tập trung tại `src/types/index.ts`. Giữ `id`, `code` và `slug` duy nhất khi bổ sung dữ liệu.

## Phạm vi Phase 1

- Layout responsive dùng chung: top contact bar, header, mobile menu, footer.
- Floating contact buttons.
- Trang chủ đầy đủ: hero và bộ lọc nhanh, thống kê, giới thiệu, quy trình, lý do lựa chọn, dịch vụ, gia sư tiêu biểu, lớp mới, bảng giá, bài tư vấn và CTA.
- Dữ liệu giả được tách khỏi UI, không sử dụng dữ liệu từ website thật.

## Phạm vi Phase 2

- Trang `/gia-su-tieu-bieu` với 40 hồ sơ mô phỏng.
- Lọc gia sư theo từ khóa, môn, lớp, khu vực, trình độ và giới tính.
- Trang `/lop-moi` với 30 lớp mô phỏng.
- Lọc lớp theo từ khóa, môn, lớp, khu vực, hình thức, số buổi, mức lương và trạng thái.
- Sắp xếp lớp theo thời gian hoặc mức lương.
- Phân trang, giao diện bộ lọc riêng cho mobile và trạng thái không có kết quả.
- Logic tìm kiếm/lọc dùng chung nằm tại `src/lib/filters.ts`.

## Phạm vi Phase 3

- Trang `/dang-ky-tim-gia-su` với form nhu cầu đầy đủ và sidebar hướng dẫn.
- Trang `/dang-ky-tro-thanh-gia-su` với form hồ sơ, chọn nhiều môn/lớp/khu vực/khung giờ và upload file mô phỏng.
- Validation bằng React Hook Form, Zod và `@hookform/resolvers`.
- Hiển thị lỗi ngay tại trường, toast thành công và log dữ liệu ra console; chưa gửi tới backend.
- Schema tập trung tại `src/lib/validations.ts`, các lựa chọn form nằm trong `src/data/form-options.ts`.

## Phạm vi Phase 4

- Blog `/tin-tuc` với 12 bài mô phỏng, lọc danh mục, tìm kiếm và phân trang.
- Trang chi tiết bài viết có breadcrumb, mục lục, bài liên quan và metadata động.
- 8 trang dịch vụ SEO tại `/dich-vu/[slug]` với lợi ích, đối tượng, quy trình, bảng giá và FAQ.
- Trang giới thiệu, bảng giá, liên hệ, chính sách bảo mật và điều khoản sử dụng.
- Trang chi tiết cho toàn bộ 40 gia sư và 30 lớp.
- `sitemap.xml`, `robots.txt`, Open Graph và metadata tiếng Việt.

## Phạm vi Phase 5

- Dashboard mock tại `/admin`, không có đăng nhập thật.
- Thống kê, biểu đồ CSS và tổng quan trạng thái lớp.
- Quản lý lớp, gia sư và bài viết với thao tác thêm/sửa/xóa bằng local state.
- Cập nhật trạng thái yêu cầu tìm gia sư ngay trên bảng.
- Dữ liệu admin trở về ban đầu khi tải lại trang và không được gửi lên máy chủ.

## Responsive và accessibility

- Layout thích ứng cho mobile, tablet và desktop.
- Bộ lọc mobile dạng bottom sheet; bảng giá và bảng admin cuộn ngang trên màn hình nhỏ.
- Menu hamburger hoạt động đến breakpoint desktop rộng.
- Có skip link, focus state, nhãn form, thông báo lỗi và toast có `aria-live`.

## Các route chính

| Route | Nội dung |
| --- | --- |
| `/` | Trang chủ |
| `/gioi-thieu` | Giới thiệu trung tâm |
| `/gia-su-tieu-bieu` | Danh sách và bộ lọc gia sư |
| `/gia-su-tieu-bieu/[id]` | Hồ sơ gia sư |
| `/lop-moi` | Danh sách và bộ lọc lớp |
| `/lop-moi/[id]` | Chi tiết và form nhận lớp |
| `/dang-ky-tim-gia-su` | Form phụ huynh |
| `/dang-ky-tro-thanh-gia-su` | Form đăng ký gia sư |
| `/bang-gia-gia-su` | Bảng học phí |
| `/dich-vu` | Danh sách dịch vụ |
| `/dich-vu/[slug]` | Trang SEO dịch vụ |
| `/tin-tuc` | Blog |
| `/tin-tuc/[slug]` | Chi tiết bài viết |
| `/lien-he` | Liên hệ |
| `/admin` | Dashboard quản trị mock |

## Lưu ý

- Tên trung tâm, logo và thông tin liên hệ trong `src/data/site.ts` là thông tin do chủ trung tâm cung cấp.
- Hồ sơ gia sư, lớp học, bảng giá và nội dung blog vẫn là dữ liệu mẫu.
- Các form chỉ validate, hiển thị toast và log dữ liệu trong console.
- Upload file chỉ là giao diện mô phỏng.
- Chưa có backend, database hay authentication.
