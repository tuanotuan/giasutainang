# Security — Gia Sư Tài Năng

Last updated: 2026-07-15. Owner-requested tutor-catalog deletion reviewed: one-time D1 deletion marker, no static tutor fallback or seed-only detail routes, no committed profile PDF, and future profiles remain unverified/private-data-safe. Production verification pending deployment.

## Phạm vi

Tài liệu này mô tả lớp bảo vệ hiện có cho `https://giasutainang.online`, dữ liệu D1, file R2, khu quản trị và quy trình xử lý sự cố. Không hệ thống nào có thể bảo đảm tuyệt đối không bị xâm nhập; mục tiêu là giảm bề mặt tấn công, giới hạn thiệt hại và phát hiện/xử lý sớm.

## Lớp bảo vệ đã triển khai trong mã nguồn

- Worker chạy trước toàn bộ static assets và API; hai hostname production tự chuyển HTTP sang HTTPS.
- HSTS một năm (không preload), CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, Referrer Policy, Permissions Policy và COOP/CORP.
- Cookie quản trị `__Host-gstn_admin`: Secure, HttpOnly, SameSite Strict, HMAC-SHA256, mã phiên ngẫu nhiên, hết hạn sau 8 giờ.
- Request ghi từ origin khác bị chặn; D1 dùng prepared statements; ID và trạng thái quan trọng được kiểm tra.
- Rate limit tại Worker: đăng nhập 8 lần/phút, mỗi endpoint form 20 lần/phút và public/admin AI 10 lần/phút theo client/location. Rate limit này là lớp giảm abuse, không phải bộ đếm tuyệt đối.
- JSON tối đa 64KB; multipart tối đa 16MB. Form phụ huynh, ứng viên, nhận lớp và liên hệ đều được kiểm tra lại tại server bằng Zod.
- API lớp công khai xóa địa chỉ chi tiết và lời nhắn riêng; dữ liệu đầy đủ chỉ có trong admin đã xác thực.
- Bucket R2 không public. File phải đúng giới hạn, MIME và magic bytes; tên file được làm sạch; download cần session admin và tham chiếu D1, dùng attachment + nosniff + CSP sandbox.
- Prompt AI công khai coi câu hỏi và tối đa sáu tin nhắn gần nhất là dữ liệu không đáng tin cậy, giới hạn mỗi nội dung 300 ký tự, không có quyền truy cập PII hoặc secrets; endpoint AI có rate limit riêng. Đầu ra bị giới hạn độ dài và loại câu lặp; response chỉ công bố nguồn xử lý và nhóm trạng thái sức khỏe tổng quát, không trả lỗi nhà cung cấp, system prompt hay chi tiết nội bộ.
- Dependency được khóa ở Next.js 16.2.10, ESLint 9 flat config và PostCSS đã vá. `npm audit` là bắt buộc trước bàn giao.
- `/.well-known/security.txt` công bố kênh báo cáo bảo mật.
- Email thông báo yêu cầu mới chạy nền sau khi D1 lưu thành công, không chứa số điện thoại/địa chỉ chi tiết/ghi chú riêng. Tối đa năm destination đã xác minh được giữ trong Cloudflare Secret, gửi thành từng email riêng để không lộ danh sách người nhận; lỗi ở một địa chỉ không chặn các địa chỉ khác.
- Endpoint và nút thử email tạm thời đã được xóa sau khi chủ sở hữu xác nhận luồng email thật hoạt động.
- Danh mục gia sư không có static seed/fallback sau lần xóa toàn bộ do chủ sở hữu yêu cầu. Hồ sơ mới chỉ đến từ admin hoặc quy trình duyệt ứng viên, mặc định chưa xác minh và vẫn không công khai dữ liệu liên hệ riêng.

## Việc chủ sở hữu cần xác nhận trên Cloudflare và các tài khoản

Các mục này không thể bảo đảm chỉ bằng Git; hãy thực hiện lần lượt sau khi deployment mới hoạt động ổn định:

1. Cloudflare → SSL/TLS → Edge Certificates: bật **Always Use HTTPS** và đặt **Minimum TLS Version = TLS 1.2**; giữ TLS 1.3 bật.
2. Cloudflare → Security/WAF: xác nhận **Cloudflare Free Managed Ruleset** đang hoạt động; xem Security Events định kỳ.
3. Cloudflare → DNS → Settings: chỉ bật DNSSEC khi sẵn sàng thêm đúng DS record tại Namecheap; cấu hình sai có thể làm domain mất truy cập.
4. Bật 2FA cho Cloudflare, Namecheap, GitHub và email quản trị. Lưu recovery codes ở nơi ngoại tuyến an toàn.
5. Đổi `ADMIN_PASSWORD` thành mật khẩu duy nhất dài ít nhất 14 ký tự; tạo `SESSION_SECRET` ngẫu nhiên tối thiểu 32 byte. Không gửi hai secret qua chat hoặc commit Git.
6. GitHub: bật Dependabot alerts/updates, secret scanning nếu tài khoản hỗ trợ, và bảo vệ nhánh `main` khi workflow đã ổn định.
7. Kiểm tra Cloudflare Workers logs, WAF Security Events, D1 usage và R2 usage khi có lưu lượng tăng bất thường.

Tài liệu Cloudflare chính thức: [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/), [Minimum TLS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/minimum-tls/), [Free Managed Ruleset](https://developers.cloudflare.com/waf/managed-rules/), [DNSSEC](https://developers.cloudflare.com/dns/dnssec/), [Worker Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

## Giới hạn còn lại

- Admin hiện dùng một mật khẩu, chưa có MFA ở tầng ứng dụng. Ưu tiên tương lai: đặt `/admin` và `/api/admin/*` sau Cloudflare Access hoặc bổ sung TOTP/recovery flow.
- Kiểm tra magic bytes không thay thế antivirus. File PDF/DOC/DOCX vẫn phải được coi là không đáng tin cậy; chỉ mở bằng ứng dụng cập nhật và Protected View.
- Worker Rate Limiting có tính eventual/locality nên có thể cho qua một lượng nhỏ request vượt ngưỡng. WAF và Turnstile là lớp bổ sung nên cân nhắc nếu spam tăng.
- D1/R2 do Cloudflare quản lý; cần theo dõi backup/Time Travel và kiểm thử khôi phục, không chỉ dựa vào production copy.
- CSP hiện cho phép inline script/style để tương thích static export của Next.js. Nâng cấp nonce/hash CSP là mục tiêu hardening tiếp theo nếu kiến trúc cho phép.

## Kiểm tra sau mỗi thay đổi nhạy cảm

```bash
npm audit --omit=dev
npm run lint
npm run build
npx wrangler deploy --dry-run
npm run security:check
```

Không chạy smoke check production lặp lại liên tục vì một số endpoint có rate limit.

## Báo cáo và ứng phó sự cố

Báo cáo riêng qua `tuan.hcmus77@gmail.com`; không đăng PII hoặc chi tiết khai thác công khai.

Khi nghi ngờ bị xâm nhập:

1. Tạm khóa truy cập admin bằng Cloudflare WAF/Access nếu cần.
2. Đổi ngay `ADMIN_PASSWORD` và `SESSION_SECRET` để vô hiệu phiên cũ; đổi token GitHub/Cloudflare nếu có nguy cơ lộ.
3. Xem Workers logs, WAF events, GitHub deployment history, D1 và R2 thay đổi bất thường.
4. Khôi phục dữ liệu từ D1 Time Travel/backup đã kiểm thử nếu dữ liệu bị sửa hoặc xóa.
5. Thông báo cho người bị ảnh hưởng khi có bằng chứng dữ liệu cá nhân bị lộ và lưu lại timeline xử lý.
6. Vá nguyên nhân gốc, chạy lại toàn bộ kiểm tra rồi mới mở quyền truy cập bình thường.
