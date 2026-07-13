# AGENTS.md

## Project Goal
Build and maintain the production Vietnamese tutoring center website "Gia Sư Tài Năng" at `https://giasutainang.online`.

## Important Rules
- Do not copy real branding, logo, images, phone numbers, addresses, articles, or private data from any reference website.
- Use mock/seed data only for demo tutor and class profiles; real form submissions and admin changes are stored in Cloudflare D1.
- Keep fictional tutor profiles visibly labeled `Hồ sơ minh họa · Chưa xác minh`; do not display rating numbers, star icons, or fabricated review counts on public tutor cards/details. New real profiles must default to `unverified`; never mark a profile verified without a real verification process.
- Keep fictional tutor demographics coherent: students born 2003–2007 with 1–3 years experience, bachelor-level profiles born 1997–2002 with 3–6 years, and teachers born 1990–2000 with 5–11 years.
- UI should be inspired by Vietnamese tutoring service websites, but all content must be original.
- Prioritize clean code, reusable components, and responsive design.

## Tech Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Lucide React
- Mock data in `/src/data`
- Types in `/src/types`
- Utilities in `/src/lib`
- Cloudflare Worker API in `/worker`
- Cloudflare D1 database and Workers AI
- Cloudflare private R2 and Worker Rate Limiting bindings

## Coding Rules
- Use reusable components.
- Keep pages thin; move UI sections into components.
- Keep data separate from UI.
- Validate forms.
- Do not show required-field errors while users are still making dependent selections. Validate on submit, then scroll/focus the first invalid field with a clear friendly message.
- Keep the parent learning-mode choice limited to `Tại nhà` and `Online`; use student count to represent group needs.
- Make layout responsive.
- Treat mobile usability as a required acceptance criterion for every UI change.
- Test common phone widths (320px, 375px, 390px, and 430px) before considering UI work complete.
- Keep touch targets at least 44px, prevent horizontal overflow, respect mobile safe areas, and ensure fixed elements do not cover content or form controls.
- Avoid hardcoding repeated data inside components.
- Preserve the existing Cloudflare Worker, D1 database, admin authentication, and Workers AI integration.
- Use `Học lực kỳ học gần nhất` (not `Học lực hiện tại`) in the parent tutor-request form.
- Keep the expected-budget example human-readable (`2 triệu/tháng`) and retain the nearby new-tab link to `/bang-gia-gia-su` so form progress is preserved.
- Preserve automatic scroll-and-focus behavior when admin users add or edit classes, tutors, prices, or posts; account for sticky headers on mobile.
- Keep the official hotline and Zalo contact number synchronized as `0365002142` across site config, Worker prompts/fallbacks, public UI, and documentation.
- Preserve the homepage promise wording: `Miễn phí tư vấn & kết nối`; clarify that parents pay no tutor-introduction fee without implying that tutoring itself is free.
- Preserve the tutor-application lifecycle (`new`, `reviewing`, `needs_info`, `approved`, `rejected`), internal admin notes, and idempotent approval into a tutor profile.
- Keep tutor applications in the standalone admin `Duyệt ứng viên` section; do not mix them back into parent `Yêu cầu tìm gia sư`.
- Keep application files private in R2 binding `FILES`; allow only JPG/PNG/WebP up to 5MB and PDF/DOC/DOCX up to 10MB, and require authenticated admin access for downloads.
- Keep bucket `giasutainang-files` bound as `FILES`; private application upload has been deployed and owner-accepted.
- Keep the public footer truthful: include clear contact, navigation, privacy, and legal-policy information, but never show a Ministry of Industry and Trade verification badge without an official verified registration link.
- Floating contact and quick-chat controls must hide when the footer enters the viewport; they must never obscure footer links, social controls, or policy content.
- Preserve the security baseline: Worker runs before every production asset, HTTP redirects to HTTPS, and security headers apply to both static and API responses.
- Keep admin cookies `__Host-`, Secure, HttpOnly, SameSite=Strict, signed, time-limited, and never readable from browser JavaScript.
- Reject cross-site unsafe requests; keep rate limits for admin login, public writes, and public/admin AI. Do not remove request-size caps or server-side Zod validation.
- Never expose detailed family addresses or private notes from public class APIs. Public pages may show only the approximate area.
- Keep R2 private; require authenticated admin plus a valid D1 reference, verify allowed file signatures, sanitize filenames, and force attachment downloads with nosniff/sandbox headers.
- Run `npm audit --omit=dev`, `npm run lint`, `npm run build`, `npx wrangler deploy --dry-run`, and `npm run security:check` (after deployment) for security-sensitive changes.
- Review `SECURITY.md` before changing auth, headers, rate limits, uploads, Cloudflare bindings, or incident-response guidance.
- Keep tutor-request email notifications non-blocking and send only a safe summary plus the admin link. Never include the parent's phone, email, street address, free-text note, or uploaded files in notification email.
- Keep private notification destinations in Cloudflare secret `NOTIFICATION_EMAIL`, never in public UI, source control, logs, or Markdown. It may contain up to five verified addresses separated by commas, semicolons, or newlines. Email Routing and the `NOTIFY_EMAIL` production binding must remain active.
- The temporary admin email-test endpoint and button were removed after live delivery was owner-accepted; do not restore them unless explicitly requested.

## Documentation Workflow
- After every code, configuration, content, or UI change, review and update **all Markdown files in the repository** before declaring the task complete.
- `spec.md` must describe current product decisions, completed capabilities, constraints, and the latest handoff state.
- `README.md` must describe the actual setup, deployment, routes, APIs, project structure, and user-visible features.
- `agents.md` must keep durable workflow rules and current architectural constraints for future sessions.
- Even when a Markdown file needs no factual change, update its `Last updated` / handoff note so a new session can confirm it was reviewed.
- A task is not complete until documentation changes are committed and pushed with the implementation.

## Task Rule
Before coding, read `spec.md`, `agents.md`, and `README.md` carefully and follow the current-state notes over obsolete phase-one requirements.
After coding, run relevant checks, update every `.md` file, commit, push, and record the resulting handoff state.

Last updated: 2026-07-13 — production demographic audit passed across all 50 tutor profiles with zero level/age mismatches.
