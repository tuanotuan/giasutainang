import type { ClassItem, Tutor } from "@/types";

export interface TutorFilterValues {
  keyword: string;
  subject: string;
  grade: string;
  area: string;
  level: string;
  gender: string;
}

export interface ClassFilterValues {
  keyword: string;
  subject: string;
  grade: string;
  area: string;
  learningMode: string;
  sessionsPerWeek: string;
  minimumSalary: string;
  status: string;
  sort: "newest" | "salary-desc" | "salary-asc";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .trim();
}

export function filterTutors(items: Tutor[], filters: TutorFilterValues) {
  const keyword = normalize(filters.keyword);
  return items.filter((tutor) => {
    const searchable = normalize([
      tutor.name,
      tutor.code,
      tutor.school,
      tutor.major,
      ...tutor.subjects,
      ...tutor.areas,
    ].join(" "));

    return (
      (!keyword || searchable.includes(keyword)) &&
      (!filters.subject || tutor.subjects.includes(filters.subject)) &&
      (!filters.grade || tutor.grades.includes(filters.grade)) &&
      (!filters.area || tutor.areas.includes(filters.area)) &&
      (!filters.level || tutor.level === filters.level) &&
      (!filters.gender || tutor.gender === filters.gender)
    );
  });
}

export function filterClasses(items: ClassItem[], filters: ClassFilterValues) {
  const keyword = normalize(filters.keyword);
  const minimumSalary = Number(filters.minimumSalary || 0);
  const result = items.filter((item) => {
    const searchable = normalize([
      item.code,
      item.title,
      item.subject,
      item.grade,
      item.area,
      item.note,
    ].join(" "));

    return (
      (!keyword || searchable.includes(keyword)) &&
      (!filters.subject || item.subject === filters.subject) &&
      (!filters.grade || item.grade === filters.grade) &&
      (!filters.area || item.area === filters.area) &&
      (!filters.learningMode || item.learningMode === filters.learningMode) &&
      (!filters.sessionsPerWeek || item.sessionsPerWeek === Number(filters.sessionsPerWeek)) &&
      (!minimumSalary || item.salary >= minimumSalary) &&
      (!filters.status || item.status === filters.status)
    );
  });

  return result.sort((a, b) => {
    if (filters.sort === "salary-desc") return b.salary - a.salary;
    if (filters.sort === "salary-asc") return a.salary - b.salary;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
