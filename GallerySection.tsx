"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Clock, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";

export const GallerySection: React.FC = () => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  const projects = [
    {
      id: "gal-1",
      category: "ppf",
      car: "Porsche 911 GT3 RS",
      serviceAr: "تغليف كامل بأفلام PPF ذاتية المعالجة 8.5 مل",
      serviceEn: "Full Body Self-Healing PPF Armor",
      durationAr: "3 أيام عمل",
      durationEn: "3 Business Days",
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "gal-2",
      category: "ceramic",
      car: "Mercedes-Benz G63 AMG",
      serviceAr: "نانو سيراميك 10H مصلب ولمعان مرآة رطب",
      serviceEn: "German 10H Ceramic Candy Mirror Gloss",
      durationAr: "24 ساعة عمل",
      durationEn: "24 Hours",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "gal-3",
      category: "ppf",
      car: "Ferrari 296 GTB",
      serviceAr: "باقة أبيكس ألتيميت بيسبوك الشاملة",
      serviceEn: "Apex Bespoke Royal Armor Package",
      durationAr: "4 أيام عمل",
      durationEn: "4 Business Days",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "gal-4",
      category: "interior",
      car: "Range Rover Autobiography",
      serviceAr: "تنظيف مقصورة عميق ومعالجة الجلود بالأوزون",
      serviceEn: "Master Interior Spa & Ceramic Leather Guard",
      durationAr: "8 ساعات",
      durationEn: "8 Hours",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "gal-5",
      category: "polishing",
      car: "BMW M4 Competition",
      serviceAr: "تصحيح طلاء ميكروني وإزالة 95% من الدوائر",
      serviceEn: "Multi-stage Paint Correction & Swirl Removal",
      durationAr: "2 يوم عمل",
      durationEn: "2 Days",
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "gal-6",
      category: "ceramic",
      car: "Lexus LX600 VIP",
      serviceAr: "درع الذهب: حماية الواجهة وعازل حراري نانو",
      serviceEn: "Gold Armor: Front PPF + XPEL Thermal Tint",
      durationAr: "2 يوم عمل",
      durationEn: "2 Days",
      image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className="py-24 bg-carbon-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showroom Excellence Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t.gallery.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.gallery.subtitle}
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: language === "ar" ? "جميع الأعمال" : "All Projects" },
              { id: "ppf", label: "PPF" },
              { id: "ceramic", label: "Ceramic 10H" },
              { id: "polishing", label: language === "ar" ? "تصحيح الطلاء" : "Polishing" },
              { id: "interior", label: language === "ar" ? "الداخلية الفاخرة" : "Interior" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === f.id
                    ? "bg-cyan-glow text-black shadow-glow font-extrabold"
                    : "bg-carbon-850 text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="group rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-cyan-glow/40 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden bg-carbon-900">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${proj.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/20 to-transparent" />

                <div className="absolute bottom-3 start-4 end-4">
                  <h3 className="text-lg font-black text-white">{proj.car}</h3>
                  <p className="text-xs text-cyan-glow font-semibold mt-0.5">
                    {language === "ar" ? proj.serviceAr : proj.serviceEn}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-carbon-900/90 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-glow" />
                  <span>{language === "ar" ? proj.durationAr : proj.durationEn}</span>
                </span>

                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "ضمان رسمي معتمد" : "Certified"}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
