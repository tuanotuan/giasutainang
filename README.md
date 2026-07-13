# Gia Sư Tài Năng

> Current handoff: production full-stack site with D1/admin/Workers AI, private R2 application uploads, production-verified API/browser security, professional responsive footer, mobile polish, cascading address selectors, and hotline/Zalo `0365002142`. Last reviewed: **2026-07-12**.

Website tiếng Việt của trung tâm Gia Sư Tài Năng, xây dựng bằng Next.js 16 App Router, TypeScript, Tailwind CSS và Cloudflare Workers Static Assets.

Site hiện có giao diện public, form đăng ký, danh sách lớp/gia sư/bài viết, khu quản trị `/admin` và Worker API dùng dữ liệu thật từ Cloudflare D1. Danh mục gia sư khởi tạo gồm 50 hồ sơ hư cấu để minh họa cách trình bày, không đại diện cho người thật.

## Cài đặt

Yêu cầu Node.js 20.9 trở lên.

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

Xuất 50 hồ sơ gia sư hiện có trên production thành PDF A4 trong `exports/` (cần Microsoft Edge trên Windows):

```bash
npm run export:tutors-pdf
```

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

Dùng mật khẩu quản trị riêng, dài ít nhất 14 ký tự; `SESSION_SECRET` nên là chuỗi ngẫu nhiên tối thiểu 32 byte. Không lưu hai giá trị này trong Git hoặc biến public `NEXT_PUBLIC_*`.

Tạo R2 bucket riêng tư tên `giasutainang-files`, sau đó thêm binding vào `wrangler.jsonc` khi bucket đã tồn tại:

```jsonc
"r2_buckets": [
  {
    "binding": "FILES",
    "bucket_name": "giasutainang-files"
  }
]
```

Sau khi deploy có DB binding:

1. Vào `/admin`.
2. Đăng nhập bằng `ADMIN_PASSWORD`.
3. Nếu thấy thông báo database chưa khởi tạo, bấm “Khởi tạo database”.
4. Hệ thống sẽ tạo bảng D1 và nạp dữ liệu ban đầu từ `src/data`.

## Thông báo yêu cầu mới qua Gmail

Worker đã có luồng gửi email nền sau khi D1 lưu thành công một yêu cầu tìm gia sư. Email chỉ chứa mã yêu cầu, môn, lớp, khu vực tổng quát, hình thức học và liên kết `/admin`; lỗi gửi email không làm mất yêu cầu của phụ huynh.

Để kích hoạt miễn phí cho tối đa năm địa chỉ nhận nội bộ:

1. Cloudflare → **Email Service** → **Email Routing** → onboard `giasutainang.online`.
2. Thêm từng Gmail nhận thông báo vào **Destination addresses** và bấm liên kết xác minh trong từng Gmail.
3. Thêm Worker secret `NOTIFICATION_EMAIL` với các Gmail đã xác minh, ngăn cách bằng dấu phẩy, dấu chấm phẩy hoặc xuống dòng; không commit địa chỉ nội bộ vào Git.
4. Sau khi xác minh thành công, binding cố định sau được thêm vào `wrangler.jsonc` và deploy:

```jsonc
"send_email": [
  { "name": "NOTIFY_EMAIL" }
]
```

Sender dùng `thongbao@giasutainang.online`. Cloudflare chỉ gửi tới destination address đã xác minh. Email Routing, binding `NOTIFY_EMAIL` và secret `NOTIFICATION_EMAIL` đã được cấu hình. Mỗi yêu cầu thật được gửi riêng tới từng người nhận để không lộ danh sách email; một địa chỉ gửi lỗi không cản các địa chỉ còn lại. Nút và API gửi thử đã được xóa sau khi chủ sở hữu xác nhận email thật hoạt động.

## Bảo mật vận hành

- Mọi request production chạy qua Worker; HTTP được chuyển sang HTTPS và phản hồi có HSTS, CSP, chống clickjacking, MIME sniffing và chính sách quyền trình duyệt.
- Cookie admin dùng tiền tố `__Host-`, `HttpOnly`, `Secure`, `SameSite=Strict`, chữ ký HMAC và tự hết hạn sau 8 giờ. Sau lần triển khai bảo mật đầu tiên, admin cần đăng nhập lại một lần.
- Login, form công khai, trợ lý hỏi đáp và công cụ AI quản trị có rate limit trong Worker. Request khác nguồn bị chặn trước các thao tác ghi.
- JSON tối đa 64KB; multipart tối đa 16MB. Dữ liệu được Zod kiểm tra lại tại server, không tin validation phía trình duyệt.
- API lớp công khai không trả địa chỉ chi tiết hoặc lời nhắn riêng của gia đình.
- R2 giữ bucket riêng tư; file được kiểm tra dung lượng, MIME và chữ ký đầu file. Admin tải file bằng endpoint đã xác thực ở chế độ `attachment`, `nosniff`, CSP sandbox.
- Next.js đang cố định ở `16.2.10`; PostCSS lồng trong Next được override lên bản đã vá. `npm audit` hiện trả về 0 lỗ hổng đã biết.
- Chạy `npm run security:check` sau deploy để kiểm tra HTTPS redirect, security headers, chống request khác nguồn, ẩn địa chỉ lớp và `security.txt`.
- Xem checklist Cloudflare, giới hạn còn lại và quy trình ứng phó tại [`SECURITY.md`](./SECURITY.md).

## API hiện có

Public:

- `GET /api/classes`
- `GET /api/classes/:id`
- `GET /api/tutors`
- `GET /api/tutors/:id`
- `GET /api/posts`
- `GET /api/posts/:slug`
- `GET /api/prices`
- `POST /api/requests/find-tutor`
- `POST /api/requests/register-tutor`
- `POST /api/requests/receive-class`
- `POST /api/requests/contact`
- `POST /api/ai/chat` (hỏi đáp công khai, không yêu cầu dữ liệu cá nhân)

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
- `PATCH /api/admin/submissions/:id` (trạng thái và ghi chú hồ sơ ứng viên)
- `POST /api/admin/submissions/:id/approve` (duyệt và tạo hồ sơ gia sư, chống tạo trùng)
- `GET /api/admin/files?key=...` (tải file ứng viên riêng tư; yêu cầu đăng nhập admin, tham chiếu D1 hợp lệ và R2 binding `FILES`)
- `POST /api/admin/ai/request/:id` (gợi ý ghép gia sư)
- `POST /api/admin/ai/zalo/:id` (soạn tin xác nhận Zalo)
- `POST /api/admin/ai/class-post/:id` (soạn bài đăng lớp)
- `POST /api/admin/ai/tutor-audit/:id` (kiểm tra độ đầy đủ hồ sơ)
- `POST /api/admin/ai/roadmap` (gợi ý lộ trình học)
- `GET /api/admin/ai/report` (tổng hợp vận hành)

## Cấu trúc thư mục

```text
worker/
└── index.ts             # Cloudflare Worker API, auth cookie, D1 schema và CRUD

scripts/
└── security-smoke.mjs   # Kiểm tra bảo mật production sau deploy

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
| `/gia-su-tieu-bieu/chi-tiet/?id=...` | Hồ sơ gia sư từ API/D1, gồm cả hồ sơ thêm trong admin |
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
| `/tin-tuc/chi-tiet/?slug=...` | Chi tiết bài viết từ API/D1, gồm cả bài thêm trong admin |
| `/lien-he` | Liên hệ |
| `/admin` | Dashboard quản trị |

## Quản trị dữ liệu

Trong `/admin`:

- Thêm/sửa/xóa lớp mới.
- Đổi trạng thái lớp: chưa giao, ưu tiên, đã giao.
- Xem yêu cầu tìm gia sư từ form phụ huynh.
- Form phụ huynh lưu số điện thoại dùng Zalo; địa chỉ được chọn lần lượt theo tỉnh/thành phố → quận/huyện/khu vực → phường/xã, sau đó chỉ cần nhập số nhà và tên đường.
- Việc đổi tỉnh/khu vực không báo lỗi sớm; lỗi bắt buộc chỉ hiện sau khi gửi form và trang tự cuộn tới ô thiếu đầu tiên.
- Form phụ huynh chỉ chọn “Tại nhà” hoặc “Online”; nhu cầu học một hay nhiều học sinh được xác định bằng trường số lượng học sinh.
- Form dùng nhãn “Học lực kỳ học gần nhất” để phụ huynh dựa vào kết quả gần nhất, tránh cách hiểu mơ hồ.
- Ô ngân sách dùng ví dụ dễ hiểu “2 triệu/tháng”; liên kết bảng giá mở ở tab mới để không làm mất nội dung form đang điền.
- Xem đăng ký nhận lớp, ứng tuyển gia sư và liên hệ.
- Hồ sơ ứng tuyển được tách thành mục quản trị riêng **Duyệt ứng viên**, có bộ lọc trạng thái, màn hình chi tiết, ghi chú nội bộ và nút duyệt để tạo hồ sơ gia sư công khai.
- Mục **Yêu cầu tìm gia sư** chỉ xử lý yêu cầu phụ huynh, đăng ký nhận lớp và liên hệ; không trộn hồ sơ ứng viên.
- Việc duyệt lại cùng một đơn không tạo hồ sơ trùng; mã gia sư đã tạo được lưu ngược vào đơn ứng tuyển.
- Form ứng viên có thể tải ảnh JPG/PNG/WebP tối đa 5MB và hồ sơ PDF/DOC/DOCX tối đa 10MB lên R2 riêng tư; admin tải file đã qua kiểm tra định dạng từ màn hình duyệt.
- Thêm/sửa/xóa gia sư và bài viết bằng biểu mẫu đầy đủ.
- Danh mục ban đầu có 50 hồ sơ hư cấu nguyên bản, avatar chữ cái trung tính và luôn hiện nhãn “Hồ sơ minh họa · Chưa xác minh”. Giao diện public không hiển thị điểm, sao hay lượt đánh giá. Migration `tutor_demo_replaced_v3` thay danh mục cũ. Hồ sơ do admin thêm hoặc duyệt từ ứng viên mặc định là “Chưa xác minh”.
- Tuổi và kinh nghiệm của hồ sơ minh họa được tạo theo trình độ: sinh viên sinh 2003–2007/kinh nghiệm 1–3 năm, cử nhân 1997–2002/3–6 năm, giáo viên 1990–2000/5–11 năm. Migration `tutor_demographics_fixed_v1` đồng bộ lại 50 bản ghi D1.
- Có thông báo thành công/lỗi, xác nhận thân thiện trước khi xóa và trạng thái rỗng cho từng danh sách.
- Thêm/sửa/xóa bảng học phí; thay đổi được hiển thị trên trang bảng giá và trang chủ.
- Trợ lý thông minh dùng Cloudflare Workers AI để gợi ý ghép gia sư, soạn tin Zalo, soạn bài đăng lớp, kiểm tra hồ sơ, tạo lộ trình học và tổng hợp vận hành.
- Khung “Hỏi nhanh” ngoài website trả lời thông tin học phí, quy trình, lịch học và học trực tuyến; không yêu cầu khách cung cấp dữ liệu cá nhân.
- Mọi tính năng tạo nội dung đều có câu trả lời dự phòng nếu Workers AI tạm thời không khả dụng.
- Giao diện điện thoại có thanh liên hệ cố định, vùng bấm tối thiểu 44px, form không tự phóng to trên iPhone, bộ lọc dạng bảng kéo và bảng giá dạng thẻ dễ đọc.
- Hero trang chủ nhấn mạnh “Miễn phí tư vấn & kết nối”, nói rõ phụ huynh không trả phí giới thiệu gia sư và dùng CTA “Tìm gia sư miễn phí”.
- Trang quản trị trên mobile có thanh mục cuộn ngang, hướng dẫn vuốt bảng, cột mã cố định và ẩn các nút liên hệ công khai.
- Khi nhấn thêm hoặc sửa lớp, gia sư, bảng giá hay bài viết, trang tự cuộn tới biểu mẫu và đặt con trỏ vào ô đầu tiên.

## Lưu ý

- Tên trung tâm, logo, hotline, email, Zalo/Facebook và địa chỉ là thông tin do chủ trung tâm cung cấp.
- Dữ liệu gia sư, lớp, bài viết ban đầu vẫn là seed/fallback để site không bị trắng khi DB chưa sẵn sàng.
- Không commit `ADMIN_PASSWORD`, `SESSION_SECRET` hoặc thông tin bí mật vào repo.

## Workflow bàn giao cho session mới

Trước khi bắt đầu chỉnh sửa, đọc theo thứ tự:

1. `spec.md` — quyết định sản phẩm và trạng thái bàn giao hiện tại.
2. `agents.md` — quy tắc làm việc, mobile và tài liệu bắt buộc.
3. `README.md` — kiến trúc, cách chạy, deploy, route và API đang có.
4. `SECURITY.md` — security baseline, checklist Cloudflare và xử lý sự cố.

Sau **mọi** thay đổi:

1. Chạy kiểm tra phù hợp (`npm run lint`, `npm run build`, và Worker dry-run nếu liên quan).
2. Rà soát và cập nhật tất cả file `.md` trong repository.
3. Ghi trạng thái/commit mới nhất để session sau không dựa vào thông tin cũ.
4. Commit và push code cùng tài liệu lên `main`.

Last updated: 2026-07-13 — added a reproducible A4 PDF export for all 50 production tutor profiles.
