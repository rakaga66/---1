"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { Clock, Tag, Flame, Calendar, ArrowRight, ArrowLeft } from "lucide-react";

interface OffersSectionProps {
  onClaimOffer: (packageId: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onClaimOffer }) => {
  const { t, language, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Real countdown timer towards end of month
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    mins: 38,
    secs: 22,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const offers = [
    {
      id: "pkg-gold",
      tagAr: "عرض باقة الموسم الذهبي",
      tagEn: "Seasonal Gold Offer",
      titleAr: "باقة درع الذهب: حماية الواجهة بالـPPF + نانو سيراميك 10H شامل",
      titleEn: "Gold Armor: Front PPF + Full 10H Ceramic Package",
      descAr: "احصل على حماية كاملة لمقدمة سيارتك ضد حصى وسافي الخطوط، مع 4 طبقات نانو سيراميك ألماني مصلب لباقي السيارة وسيراميك الجنوط مجاناً.",
      descEn: "Complete front impact shield against highway gravel, 4 cured 10H ceramic layers, and complimentary rim ceramic.",
      origPrice: 7200,
      offerPrice: 5900,
      savePct: 20,
      badge: "وفر 1,300 ر.س",
    },
    {
      id: "pkg-silver",
      tagAr: "عرض التلميع والنانو",
      tagEn: "Polish & Nano Duo",
      titleAr: "تصحيح الطلاء الميكروني + نانو سيراميك 3 سنوات",
      titleEn: "Multi-Stage Paint Correction + 3-Year Nano Ceramic",
      descAr: "إزالة دوائر الغسيل والخدوش السطحية بنسبة 90% مع تطبيق درع النانو سيراميك المقاوم لأملاح ورطوبة جدة وعازل الزجاج مجاناً.",
      descEn: "Eliminates 90% of swirl marks, adds 9H ceramic shield and free windshield hydrophobic rain coating.",
      origPrice: 2400,
      offerPrice: 1950,
      savePct: 18,
      badge: "وفر 450 ر.س",
    },
  ];

  return (
    <section className="py-24 bg-carbon-900 border-t border-white/[0.06] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-glow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Countdown Clock */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-cyan-glow fill-cyan-glow" />
            <span>Exclusive Seasonal Promotions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t.offers.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
            {t.offers.subtitle}
          </p>

          {/* Genuine Countdown Timer */}
          <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-carbon-850 border border-white/10 shadow-lg">
            <span className="text-xs text-gray-400 font-bold px-2">{t.offers.expiresIn}</span>
            <div className="flex items-center gap-1.5 font-sans font-black text-white">
              <span className="px-2.5 py-1 rounded-lg bg-carbon-900 border border-white/10 text-cyan-glow text-sm sm:text-base">
                {timeLeft.days} <span className="text-[10px] text-gray-400 font-normal">{t.offers.days}</span>
              </span>
              <span>:</span>
              <span className="px-2.5 py-1 rounded-lg bg-carbon-900 border border-white/10 text-cyan-glow text-sm sm:text-base">
                {timeLeft.hours} <span className="text-[10px] text-gray-400 font-normal">{t.offers.hours}</span>
              </span>
              <span>:</span>
              <span className="px-2.5 py-1 rounded-lg bg-carbon-900 border border-white/10 text-cyan-glow text-sm sm:text-base">
                {timeLeft.mins} <span className="text-[10px] text-gray-400 font-normal">{t.offers.mins}</span>
              </span>
              <span>:</span>
              <span className="px-2.5 py-1 rounded-lg bg-carbon-900 border border-white/10 text-cyan-glow text-sm sm:text-base">
                {timeLeft.secs} <span className="text-[10px] text-gray-400 font-normal">ث</span>
              </span>
            </div>
          </div>
        </div>

        {/* Offers Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-glow/30 hover:border-cyan-glow/60 transition-all duration-300 flex flex-col justify-between shadow-glow relative group"
            >
              <div className="absolute top-4 end-4 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
                {offer.badge}
              </div>

              <div>
                <span className="text-xs font-bold text-cyan-glow uppercase tracking-wider block mb-1">
                  {language === "ar" ? offer.tagAr : offer.tagEn}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
                  {language === "ar" ? offer.titleAr : offer.titleEn}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {language === "ar" ? offer.descAr : offer.descEn}
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-white font-sans text-cyan-glow">
                    {offer.offerPrice.toLocaleString()} {t.services.sar}
                  </span>
                  <span className="text-sm font-medium text-gray-500 line-through font-sans">
                    {offer.origPrice.toLocaleString()} {t.services.sar}
                  </span>
                </div>

                <button
                  onClick={() => onClaimOffer(offer.id)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-glow to-blue-600 text-black font-extrabold text-xs sm:text-sm shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t.offers.claimOffer}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
