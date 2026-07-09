import { stats } from "@/data/site";

export function StatsSection() {
  return (
    <section className="bg-white pb-16 pt-16 sm:pb-20 lg:pt-32">
      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
        {stats.map(({ value, label, icon: Icon }, index) => (
          <div key={label} className={`flex items-center gap-4 ${index > 0 ? "lg:border-l lg:border-slate-200 lg:pl-8" : ""}`}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <strong className="block text-2xl font-black text-primary-800 sm:text-3xl">{value}</strong>
              <span className="text-xs font-medium text-slate-500 sm:text-sm">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
