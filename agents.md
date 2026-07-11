# AGENTS.md

## Project Goal
Build and maintain the production Vietnamese tutoring center website "Gia Sư Tài Năng" at `https://giasutainang.online`.

## Important Rules
- Do not copy real branding, logo, images, phone numbers, addresses, articles, or private data from any reference website.
- Use mock/seed data only for demo tutor and class profiles; real form submissions and admin changes are stored in Cloudflare D1.
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

Last updated: 2026-07-11 — documentation synchronized after changing the official hotline/Zalo to `0365002142`.
