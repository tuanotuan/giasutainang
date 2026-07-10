import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export const fieldClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100";

export const textAreaClass =
  "min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100";

export function FormField({
  label,
  required,
  error,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </span>
      )}
    </label>
  );
}

export function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card sm:p-7">
      <legend className="sr-only">{title}</legend>
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4 sm:mb-6 sm:pb-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-xs font-extrabold text-white">{number}</span>
        <div>
          <h2 className="font-bold text-ink">{title}</h2>
          {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
        </div>
      </div>
      {children}
    </fieldset>
  );
}
