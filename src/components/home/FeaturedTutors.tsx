"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { tutors as initialTutors } from "@/data/tutors";
import type { Tutor } from "@/types";
import { SectionTitle } from "@/components/common/SectionTitle";
import { TutorCard } from "@/components/tutors/TutorCard";

export function FeaturedTutors() {
  const [tutors, setTutors] = useState<Tutor[]>(initialTutors);
  useEffect(() => {
    fetch("/api/tutors")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { items: Tutor[] }) => setTutors(data.items))
      .catch(() => undefined);
  }, []);
  return (
    <section className="section-space bg-white">
      <div className="container-page">
        <SectionTitle
          eyebrow="Đội ngũ tận tâm"
          title="Gia sư tiêu biểu"
          description="Tham khảo chuyên môn, khu vực và phong cách dạy để chọn hướng kết nối phù hợp với học sinh."
        />
        {tutors.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tutors.slice(0, 8).map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
            Danh sách gia sư đang được cập nhật. Trung tâm vẫn tiếp nhận nhu cầu và chủ động tìm hồ sơ phù hợp cho từng học sinh.
          </div>
        )}
        <div className="mt-9 text-center">
          <Link href="/gia-su-tieu-bieu" className="button-secondary">
            Xem tất cả gia sư <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
