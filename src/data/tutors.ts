import type { Tutor } from "@/types";

// Production tutor profiles are managed in Cloudflare D1 through the admin area.
// Keep the static fallback empty so deleted or unavailable records never reappear.
export const tutors: Tutor[] = [];
