import Image from "next/image";
import { Star } from "lucide-react";
import { Testimonial } from "@/lib/data";

// Presentational only — reused by the homepage section and the admin
// preview page.
export function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((t) => (
        <div key={t.id} className="relative bg-white p-8 rounded-xl border border-gray-100 shadow-md flex flex-col justify-between h-full">
          {t.status === "draft" && (
            <span className="absolute top-3 right-3 bg-amber-500 text-[#0c2340] px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider shadow">
              Draft — not public
            </span>
          )}
          <div>
            {/* Stars */}
            <div className="flex items-center space-x-1 text-amber-400 mb-6">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-gray-600 text-sm italic leading-relaxed mb-8">&quot;{t.quote}&quot;</p>
          </div>

          <div className="flex items-center space-x-4 border-t border-gray-50 pt-6">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <Image src={t.avatar} alt={t.name} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h4 className="text-[#0c2340] font-serif font-bold text-sm">{t.name}</h4>
              <p className="text-[#d4af37] text-[10px] uppercase tracking-wider font-mono">
                {t.role} {t.graduationYear ? `(Class of '${String(t.graduationYear).slice(-2)})` : ""}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
