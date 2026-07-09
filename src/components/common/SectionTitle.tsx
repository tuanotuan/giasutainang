import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionTitle({ eyebrow, title, description, align = "center", light = false }: SectionTitleProps) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <span className={cn("eyebrow", light && "bg-white/10 text-primary-100")}>
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </span>
      )}
      <h2 className={cn("text-3xl font-extrabold tracking-tight sm:text-4xl", light ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-7", light ? "text-primary-100" : "text-slate-600")}>
          {description}
        </p>
      )}
    </div>
  );
}
