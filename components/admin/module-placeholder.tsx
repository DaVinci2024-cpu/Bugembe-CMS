import { LucideIcon } from "lucide-react";

export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-xl mx-auto my-6 shadow-xs space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#0c2340]/5 border border-[#0c2340]/10 flex items-center justify-center mx-auto text-[#0c2340]">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
          Coming Soon
        </span>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">{description}</p>
      </div>
    </div>
  );
}
