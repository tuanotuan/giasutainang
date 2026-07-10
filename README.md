# Gia Sư Tài Năng

Website tiếng Việt của trung tâm Gia Sư Tài Năng, xây dựng bằng Next.js App Router, TypeScript, Tailwind CSS và Cloudflare Workers Static Assets.

Site hiện có giao diện public, form đăng ký, danh sách lớp/gia sư/bài viết, khu quản trị `/admin` và Worker API để nâng cấp sang dữ liệu thật bằng Cloudflare D1.

## Cài đặt

Yêu cầu Node.js 20 trở lên.

```bash
npm install
```

## Chạy local

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

Lưu ý: khi chạy bằng `next dev`, các route `/api/*` của Cloudflare Worker không chạy. Giao diện public sẽ tự fallback sang dữ liệu mẫu trong `src/data`.

## Build production

```bash
npm run build
```

Static export nằm trong thư mục `out/`.

Kiểm tra Worker trước khi deploy:

```bash
npx wrangler deploy --dry-run
```

## Deploy miễn phí lên Cloudflare Workers

Repository: `tuanotuan/giasutainang`

Cấu hình Cloudflare Builds:

```text
Production branch: main
Build command: npm run build
Deploy command: npx wrangler deploy
Non-production deploy command: npx wrangler versions upload
Root directory: /
```

Biến môi trường public:

```text
NEXT_PUBLIC_SITE_URL=https://giasutainang.online
```

Custom domains đã dùng:

```text
giasutainang.online
www.giasutainang.online
```

## Cấu hình dữ liệu thật với Cloudflare D1

Tạo D1 database miễn phí trên Cloudflare, ví dụ tên:

```text
giasutainang-db
```

Sau khi tạo, lấy `database_id` và thêm vào `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "giasutainang-db",
    "database_id": "DATABASE_ID_CUA_BAN"
  }
]
```

Trong Cloudflare Worker settings, thêm secret/variable:

```text
ADMIN_PASSWORD=mat-khau-admin-cua-ban
SESSION_SECRET=chuoi-random-dai-de-ky-cookie
```

Sau khi deploy có DB binding:

1. Vào `/admin`.
2. Đăng nhập bằng `ADMIN_PASSWORD`.
3. Nếu thấy thông báo database chưa khởi tạo, bấm “Khởi tạo database”.
4. Hệ thống sẽ tạo bảng D1 và nạp dữ liệu ban đầu từ `src/data`.

## API hiện có

Public:

- `GET /api/classes`
- `GET /api/classes/:id`
- `GET /api/tutors`
- `GET /api/posts`
- `GET /api/prices`
- `POST /api/requests/find-tutor`
- `POST /api/requests/register-tutor`
- `POST /api/requests/receive-class`
- `POST /api/requests/contact`

Admin:

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/session`
- `POST /api/admin/setup`
- `GET /api/admin/state`
- CRUD `/api/admin/classes`
- CRUD `/api/admin/tutors`
- CRUD `/api/admin/posts`
- CRUD `/api/admin/prices`
- `PATCH /api/admin/requests/:id`

## Cấu trúc thư mục

```text
worker/
└── index.ts             # Cloudflare Worker API, auth cookie, D1 schema và CRUD

src/
├── app/                 # App Router, metadata và các trang
├── components/
│   ├── admin/           # Dashboard quản trị thật qua Worker API
│   ├── blog/            # Card và danh sách bài viết
│   ├── classes/         # Card, filter, chi tiết lớp dùng dữ liệu API
│   ├── common/          # UI dùng chung
│   ├── forms/           # Form có validation và submit API
│   ├── home/            # Các section trang chủ
│   ├── layout/          # Header, footer, top bar, mobile menu
│   ├── pricing/         # Bảng học phí
│   └── tutors/          # Card và danh sách gia sư
├── data/                # Dữ liệu seed/fallback ban đầu
├── lib/                 # Helper API, filter, validation, utility
└── types/               # TypeScript interfaces
```

## Route chính

| Route | Nội dung |
| --- | --- |
| `/` | Trang chủ |
| `/gioi-thieu` | Giới thiệu trung tâm |
| `/gia-su-tieu-bieu` | Danh sách và bộ lọc gia sư |
| `/gia-su-tieu-bieu/[id]` | Hồ sơ gia sư seed |
| `/lop-moi` | Danh sách và bộ lọc lớp, ưu tiên dữ liệu API |
| `/lop-moi/chi-tiet/?id=...` | Chi tiết lớp từ API/D1, dùng cho lớp thêm mới |
| `/lop-moi/[id]` | Chi tiết lớp seed cũ |
| `/dang-ky-tim-gia-su` | Form phụ huynh |
| `/dang-ky-tro-thanh-gia-su` | Form đăng ký gia sư |
| `/bang-gia-gia-su` | Bảng học phí |
| `/dich-vu` | Danh sách dịch vụ |
| `/dich-vu/[slug]` | Trang SEO dịch vụ |
| `/tin-tuc` | Blog |
| `/tin-tuc/[slug]` | Chi tiết bài viết seed |
| `/lien-he` | Liên hệ |
| `/admin` | Dashboard quản trị |

## Quản trị dữ liệu

Trong `/admin`:

- Thêm/sửa/xóa lớp mới.
- Đổi trạng thái lớp: chưa giao, ưu tiên, đã giao.
- Xem yêu cầu tìm gia sư từ form phụ huynh.
- Xem đăng ký nhận lớp, ứng tuyển gia sư và liên hệ.
- Thêm/sửa/xóa nhanh gia sư và bài viết.
- Thêm/sửa/xóa bảng học phí; thay đổi được hiển thị trên trang bảng giá và trang chủ.

## Lưu ý

- Tên trung tâm, logo, hotline, email, Zalo/Facebook và địa chỉ là thông tin do chủ trung tâm cung cấp.
- Dữ liệu gia sư, lớp, bài viết ban đầu vẫn là seed/fallback để site không bị trắng khi DB chưa sẵn sàng.
- Không commit `ADMIN_PASSWORD`, `SESSION_SECRET` hoặc thông tin bí mật vào repo.
