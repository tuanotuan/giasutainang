import { Clock3, Mail, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

export function TopContactBar() {
  return (
    <div className="hidden bg-primary-900 text-white lg:block">
      <div className="container-page flex h-10 items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <a className="flex items-center gap-2 transition hover:text-primary-100" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
            <Phone className="h-3.5 w-3.5" />
            Hotline: {siteConfig.phone}
          </a>
          <a className="flex items-center gap-2 transition hover:text-primary-100" href={`mailto:${siteConfig.email}`}>
            <Mail className="h-3.5 w-3.5" />
            {siteConfig.email}
          </a>
          <span className="flex items-center gap-2 text-primary-100">
            <Clock3 className="h-3.5 w-3.5" />
            {siteConfig.hours}
          </span>
        </div>
        <a className="flex items-center gap-2 font-semibold text-amber-300 transition hover:text-amber-200" href={siteConfig.zalo} target="_blank" rel="noreferrer">
          <MessageCircle className="h-3.5 w-3.5" />
          Zalo tư vấn
        </a>
      </div>
    </div>
  );
}
