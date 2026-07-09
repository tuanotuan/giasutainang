"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { classes as initialClasses } from "@/data/classes";
import type { ClassItem } from "@/types";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ClassCard } from "@/components/classes/ClassCard";

export function NewClasses() {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses);
  useEffect(() => {
    fetch("/api/classes")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { items: ClassItem[] }) => setClasses(data.items))
      .catch(() => undefined);
  }, []);
  return (
    <section className="section-space bg-slate-50/70">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <SectionTitle
            eyebrow="Cơ hội mới mỗi ngày"
            title="Lớp mới cần gia sư"
            description="Danh sách lớp đang chờ người dạy phù hợp, được trung tâm cập nhật thường xuyên."
            align="left"
          />
          <Link href="/lop-moi" className="button-secondary mb-10">
            Xem tất cả lớp <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {classes.slice(0, 6).map((item) => <ClassCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
