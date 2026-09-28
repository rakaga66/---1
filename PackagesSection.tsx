"use client";

import React, { useState } from "react";
import { initialPackages } from "@/lib/data";
import { VehicleSize } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import {
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  Crown,
  Check,
} from "lucide-react";

interface PackagesSectionProps {
  onBookPackage: (packageId: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onBookPackage }) => {
  const { t, language, isRTL } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<VehicleSize>("sedan");

  const sizeOptions: { id: VehicleSize; labelAr: string; labelEn: string }[] = [
    { id: "coupe", labelAr: "كوبيه / مدمجة", labelEn: "Coupe / Compact" },
    { id: "sedan", labelAr: "سيدان فاخرة", labelEn: "Luxury Sedan" },
    { id: "midSuv", labelAr: "جيب كروس أوفر", labelEn: "Midsize SUV" },
    { id: "largeSuv", labelAr: "جيب عائلي كبير", labelEn: "Full-size SUV" },
    { id: "exotic", labelAr: "سوبركار / هايبركار", labelEn: "Supercar / Exotic" },
  ];

  return (
    <section id="packages-section" className="py-24 bg-carbon-900 border-t border-white/[0.06] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-glow/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gold-glow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>Curated Protection Bundles</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t.packages.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.packages.subtitle}
          </p>

          {/* Vehicle Size Selector Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-carbon-850 border border-white/10 max-w-2xl mx-auto">
            {sizeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedSize(opt.id)}
                className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  selectedSize === opt.id
                    ? "bg-cyan-glow text-black font-bold shadow-glow"
                    : "text-gray-400 hover:text-white hover:bg-carbon-800"
                }`}
              >
                {language === "ar" ? opt.labelAr : opt.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {initialPackages.map((pkg) => {
            const calculatedPrice = Math.round(pkg.basePrice * (pkg.priceMultipliers[selectedSize] || 1));
            const isGold = pkg.tier === "gold";
            const isUltimate = pkg.tier === "ultimate";

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  isGold
                    ? "bg-carbon-850 border-2 border-cyan-glow shadow-glow-lg -translate-y-2 lg:-translate-y-3 z-20"
                    : isUltimate
                    ? "bg-carbon-850 border border-amber-500/50 shadow-gold-glow"
                    : "glass-panel border border-white/10 hover:border-white/20"
                } p-6 flex-1`}
              >
                {/* Popular / Recommended Badge */}
                {isGold && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-glow to-blue-600 text-black text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    <span>{language === "ar" ? "الأكثر طلباً وموصى به" : "Most Popular"}</span>
                  </div>
                )}

                {isUltimate && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Crown className="w-3.5 h-3.5 fill-black" />
                    <span>{language === "ar" ? "أعلى فئة VIP بيسبوك" : "Bespoke Royal Spec"}</span>
                  </div>
                )}

                <div>
                  {/* Tier Title */}
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {language === "ar" ? pkg.nameAr : pkg.nameEn}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1 leading-snug">
                      {language === "ar" ? pkg.taglineAr : pkg.taglineEn}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 p-3.5 rounded-2xl bg-carbon-800/80 border border-white/5 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-white font-sans">
                      {calculatedPrice.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-gray-400">{t.services.sar}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-glow" />
                        {language === "ar" ? pkg.durationAr : pkg.durationEn}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3 h-3" />
                        {pkg.warrantyYears} {language === "ar" ? "سنوات" : "Y"}
                      </span>
                    </div>
                  </div>

                  {/* Ideal For Target Segment */}
                  <div className="mb-5 p-2.5 rounded-xl bg-carbon-900/60 border border-white/5 text-xs text-gray-300">
                    <span className="font-bold text-gray-400 block mb-0.5">{t.packages.idealFor}</span>
                    <span>{language === "ar" ? pkg.idealForAr : pkg.idealForEn}</span>
                  </div>

                  {/* Inclusions List */}
                  <div className="space-y-2.5 mb-6">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {t.packages.includedServices}
                    </span>
                    {(language === "ar" ? pkg.servicesIncludedAr : pkg.servicesIncludedEn).map(
                      (service, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-cyan-glow shrink-0 mt-0.5" />
                          <span className="leading-snug">{service}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-4 border-t border-white/[0.08] mt-auto">
                  <button
                    onClick={() => onBookPackage(pkg.id)}
                    className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      isGold
                        ? "bg-gradient-to-r from-cyan-glow to-blue-600 text-black shadow-glow hover:shadow-glow-lg"
                        : isUltimate
                        ? "bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-gold-glow hover:scale-[1.02]"
                        : "bg-carbon-800 hover:bg-carbon-700 text-white border border-white/10"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{t.packages.choosePackage}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
