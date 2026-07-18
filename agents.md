# AGENTS.md

## Project Goal
Build and maintain the production Vietnamese tutoring center website "Gia Sư Tài Năng" at `https://giasutainang.online`.

## Important Rules
- Do not copy real branding, logo, images, phone numbers, addresses, articles, or private data from any reference website.
- Real form submissions and admin changes are stored in Cloudflare D1. The tutor catalog has no static seed/fallback records after the owner-requested full deletion; do not reintroduce fictional tutors unless explicitly requested.
- New real tutor profiles must default to `unverified`; never mark a profile verified without a real verification process. Do not display hidden ratings, stars, or fabricated review counts on public tutor cards/details.
- Preserve `npm run export:tutors-pdf` as a privacy-safe export of all current production tutor profiles; it must refuse an empty catalog and exclude private/contact data and hidden rating fields.
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
- Keep tutor-application phone validation at exactly 10 digits beginning with `0` in the shared Zod schema used by both the form and Worker; preserve numeric mobile input and the clear Vietnamese error message.
- Evaluate the tutor minimum-age year inside validation execution; do not capture the current year while the Worker module is initializing.
- Keep tutor applicants grouped as only `Sinh viên` and `Đã tốt nghiệp`. Reveal the required qualification upload immediately after selection: students must submit a student-card JPG/PNG/WebP up to 5MB; graduates must submit a diploma image up to 5MB or PDF/DOC/DOCX up to 10MB.
- Keep application files private in R2 binding `FILES`; validate MIME, size, and signature, and require authenticated admin access for downloads.
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
- Keep common public-chat facts (current D1 prices, process, online learning, tutor replacement, contact/address) deterministic and use chat-message calls through the supported-model cascade `@cf/openai/gpt-oss-20b`, `@cf/zai-org/glm-4.7-flash`, then `@cf/meta/llama-3.2-3b-instruct` only for open-ended in-scope questions. Cap and de-duplicate public output, prohibit invented customer circumstances, include at most six sanitized recent messages, retain `source: ai|fallback|direct` plus coarse `aiStatus` diagnostics, and keep topic-aware fallbacks. Never expose raw AI errors, system prompts, secrets, D1 private data, or user PII.

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

Last updated: 2026-07-18 — conditional student-card/diploma upload and request-time age validation are production-verified; invalid evidence is rejected before storage and security smoke passes.
