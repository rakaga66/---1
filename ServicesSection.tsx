"use client";

import React, { useState } from "react";
import { initialServices } from "@/lib/data";
import { ServiceItem } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { ServiceDetailModal } from "./ServiceDetailModal";
import {
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Info,
} from "lucide-react";

interface ServicesSectionProps {
  onBookService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookService }) => {
  const { t, language, isRTL } = useLanguage();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section id="services-section" className="py-24 bg-carbon-950 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-cyan-glow/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automotive Engineering Mastery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t.services.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {initialServices.map((service) => (
            <div
              key={service.id}
              className="glass-panel rounded-3xl border border-white/10 hover:border-cyan-glow/40 transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-glow"
            >
              {/* Visual Card Image */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-carbon-850">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-900 via-carbon-900/30 to-transparent" />

                {/* Badge if available */}
                {service.badge && (
                  <div className="absolute top-3 end-3 px-3 py-1 rounded-full bg-cyan-950/80 backdrop-blur-md border border-cyan-glow/40 text-cyan-glow text-[11px] font-bold">
                    {service.badge}
                  </div>
                )}

                {/* Warranty Pill */}
                <div className="absolute bottom-3 start-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {service.warrantyYears}{" "}
                    {language === "ar" ? "سنوات ضمان" : "Y Warranty"}
                  </span>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-glow transition-colors">
                    {language === "ar" ? service.nameAr : service.nameEn}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                    {language === "ar" ? service.shortDescAr : service.shortDescEn}
                  </p>

                  {/* Bullet Benefits preview */}
                  <div className="space-y-1.5 mb-5">
                    {(language === "ar" ? service.benefitsAr : service.benefitsEn)
                      .slice(0, 2)
                      .map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-glow shrink-0" />
                          <span className="truncate">{benefit}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Bottom Pricing & Actions */}
                <div className="pt-4 border-t border-white/[0.08] mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] text-gray-400 block">{t.services.startingFrom}</span>
                      <span className="text-xl sm:text-2xl font-black text-white font-sans">
                        {service.basePrice.toLocaleString()} {t.services.sar}
                      </span>
                    </div>

                    <div className="text-end">
                      <span className="text-[11px] text-gray-400 block">{t.services.duration}</span>
                      <span className="text-xs font-semibold text-gray-300 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {language === "ar" ? service.durationAr : service.durationEn}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="w-full py-2.5 px-3 rounded-xl bg-carbon-800 hover:bg-carbon-700 text-gray-200 text-xs font-bold border border-white/10 transition-colors flex items-center justify-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{t.services.viewDetails}</span>
                    </button>

                    <button
                      onClick={() => onBookService(service.id)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-glow to-blue-600 text-black font-extrabold text-xs shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t.services.bookService}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBook={(id) => {
          setSelectedService(null);
          onBookService(id);
        }}
      />
    </section>
  );
};
