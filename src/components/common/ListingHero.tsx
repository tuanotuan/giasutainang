import { BookOpenCheck, Home } from "lucide-react";
import Link from "next/link";

interface ListingHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function ListingHero({ eyebrow, title, description }: ListingHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary-800 py-14 text-white sm:py-16">
      <div className="absolute -right-16 -top-32 h-80 w-80 rounded-full border-[52px] border-white/5" />
      <div className="container-page relative">
        <nav className="mb-6 flex items-center gap-2 text-xs text-primary-100" aria-label="Breadcrumb">
          <Link href="/" className="flex items-center gap-1.5 transition hover:text-white">
            <Home className="h-3.5 w-3.5" /> Trang chủ
          </Link>
          <span>/</span>
          <span className="text-white">{title}</span>
        </nav>
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
          <BookOpenCheck className="h-4 w-4" /> {eyebrow}
        </span>
        <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl leading-7 text-primary-100">{description}</p>
      </div>
    </section>
  );
}
