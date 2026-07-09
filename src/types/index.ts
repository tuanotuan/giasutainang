export type TutorLevel = "Sinh viên" | "Giáo viên" | "Cử nhân" | "Thạc sĩ";

export interface Tutor {
  id: string;
  code: string;
  name: string;
  birthYear: number;
  gender: "Nam" | "Nữ";
  avatar: string;
  school: string;
  major: string;
  level: TutorLevel;
  subjects: string[];
  grades: string[];
  areas: string[];
  availableTimes: string[];
  experience: string;
  achievements: string[];
  teachingStyle: string;
  expectedSalary: string;
  rating: number;
  reviewCount: number;
}

export interface ClassItem {
  id: string;
  code: string;
  status: "open" | "assigned" | "discount";
  title: string;
  subject: string;
  grade: string;
  studentCount: number;
  studentLevel: "Giỏi" | "Khá" | "Trung bình" | "Yếu" | "Kém";
  area: string;
  address: string;
  learningMode: "Tại nhà" | "Online" | "Học nhóm";
  sessionsPerWeek: number;
  duration: string;
  schedule: string;
  tutorRequirement: string;
  salary: number;
  note: string;
  createdAt: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  thumbnail: string;
  date: string;
  content: string;
}

export interface PriceItem {
  id: string;
  category: string;
  subjectOrGrade: string;
  studentTutorPrice: string;
  teacherTutorPrice: string;
  sessionsPerWeek: string;
  duration: string;
  note?: string;
}

export interface TutorRequest {
  id: string;
  parentName: string;
  phone: string;
  email?: string;
  area: string;
  learningMode: "Tại nhà" | "Online" | "Học nhóm";
  grade: string;
  subjects: string[];
  studentCount: number;
  studentLevel: string;
  sessionsPerWeek: number;
  schedule: string;
  tutorLevel: string;
  tutorGender: string;
  selectedTutorCode?: string;
  budget: string;
  note?: string;
  status: "new" | "called" | "matched" | "cancelled";
  createdAt: string;
}
