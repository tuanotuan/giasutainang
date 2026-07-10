# AGENTS.md

## Project Goal
Build a Vietnamese tutoring center website named "Gia Sư Minh Tâm".

## Important Rules
- Do not copy real branding, logo, images, phone numbers, addresses, articles, or private data from any reference website.
- Use only mock data.
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

## Coding Rules
- Use reusable components.
- Keep pages thin; move UI sections into components.
- Keep data separate from UI.
- Validate forms.
- Make layout responsive.
- Treat mobile usability as a required acceptance criterion for every UI change.
- Test common phone widths (320px, 375px, 390px, and 430px) before considering UI work complete.
- Keep touch targets at least 44px, prevent horizontal overflow, respect mobile safe areas, and ensure fixed elements do not cover content or form controls.
- Avoid hardcoding repeated data inside components.
- Do not add a real backend unless requested.
- Do not add real authentication unless requested.

## Task Rule
Before coding, read `SPEC.md` carefully and follow it.
After coding, update `README.md` with run instructions and project structure.
