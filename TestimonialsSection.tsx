"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { clientReviews } from "@/lib/data";
import { Star, ShieldCheck, Quote } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-24 bg-carbon-900 border-t border-white/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-cyan-glow text-cyan-glow" />
            <span>4.95 Google Rating • 620+ Verified Clients</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {clientReviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-cyan-glow/30 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Stars & Car Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{language === "ar" ? rev.commentAr : rev.commentEn}"
                </p>
              </div>

              {/* Author & Vehicle */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-glow" />
                  </div>
                  <div className="text-[11px] text-cyan-glow font-bold mt-0.5">{rev.car}</div>
                </div>

                <span className="text-[10px] text-gray-500 max-w-[110px] text-end leading-tight">
                  {language === "ar" ? rev.serviceAr : rev.serviceEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
