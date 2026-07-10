"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation, siteConfig } from "@/data/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700"
        aria-label="Mở menu"
        aria-expanded={open}
        aria-controls="menu-di-dong"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] xl:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div id="menu-di-dong" role="dialog" aria-modal="true" aria-label="Danh mục điều hướng" className="absolute right-0 top-0 flex h-[100dvh] w-[min(92%,380px)] flex-col bg-white px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1.25rem+env(safe-area-inset-top))] shadow-2xl">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-bold text-primary-800">Danh mục</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"
                aria-label="Đóng menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-slate-100 py-3 text-[15px] font-semibold text-slate-700 transition active:bg-primary-50 active:text-primary-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="button-primary mt-3 w-full">
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
