import type { MetadataRoute } from "next";
import { classes } from "@/data/classes";
import { posts } from "@/data/posts";
import { serviceContents } from "@/data/services";
import { tutors } from "@/data/tutors";
import { siteConfig } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const staticRoutes = [
    "",
    "/gioi-thieu",
    "/dang-ky-tim-gia-su",
    "/dang-ky-tro-thanh-gia-su",
    "/gia-su-tieu-bieu",
    "/lop-moi",
    "/bang-gia-gia-su",
    "/dich-vu",
    "/tin-tuc",
    "/lien-he",
    "/chinh-sach-bao-mat",
    "/dieu-khoan-su-dung",
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date("2026-07-09") })),
    ...tutors.map((tutor) => ({ url: `${baseUrl}/gia-su-tieu-bieu/${tutor.id}`, lastModified: new Date("2026-07-09") })),
    ...classes.map((item) => ({ url: `${baseUrl}/lop-moi/${item.id}`, lastModified: new Date(item.createdAt) })),
    ...posts.map((post) => ({ url: `${baseUrl}/tin-tuc/${post.slug}`, lastModified: new Date("2026-07-09") })),
    ...serviceContents.map((service) => ({ url: `${baseUrl}/dich-vu/${service.slug}`, lastModified: new Date("2026-07-09") })),
  ];
}
