"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/language-context";
import { beforeAfterShowcases } from "@/lib/data";
import { ArrowLeftRight, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

interface BeforeAfterSliderProps {
  onBookService?: (serviceSlug?: string) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ onBookService }) => {
  const { t, language, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = selectedCategory === "all"
    ? beforeAfterShowcases
    : beforeAfterShowcases.filter((item) => item.category === selectedCategory);

  const currentItem = filteredItems[activeItemIndex] || beforeAfterShowcases[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 3) percentage = 3;
    if (percentage > 97) percentage = 97;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUpGlobal);
    window.addEventListener("touchend", handleMouseUpGlobal);
    return () => {
      window.removeEventListener("mouseup", handleMouseUpGlobal);
      window.removeEventListener("touchend", handleMouseUpGlobal);
    };
  }, []);

  const categories = [
    { id: "all", label: t.beforeAfter.all },
    { id: "ppf", label: t.beforeAfter.ppf },
    { id: "ceramic", label: t.beforeAfter.ceramic },
    { id: "polishing", label: t.beforeAfter.polishing },
    { id: "interior", label: t.beforeAfter.interior },
    { id: "headlight", label: t.beforeAfter.headlight },
  ];

  return (
    <section id="before-after-section" className="py-24 bg-carbon-900 border-t border-white/[0.06] relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-glow/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Comparison Slider</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t.beforeAfter.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.beforeAfter.subtitle}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveItemIndex(0);
                setSliderPosition(50);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-cyan-glow text-black shadow-glow font-bold"
                  : "bg-carbon-800 text-gray-400 hover:text-white hover:bg-carbon-700 border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Comparison Showcase Container */}
        <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 max-w-5xl mx-auto shadow-2xl">
          {/* Active Item Title & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 px-2">
            <div>
              <span className="text-xs font-bold text-cyan-glow uppercase tracking-wider">
                {language === "ar" ? "مشروع حقيقي معتمد" : "Verified Client Project"}
              </span>
              <h3 className="text-lg sm:text-2xl font-bold text-white mt-0.5">
                {language === "ar" ? currentItem.titleAr : currentItem.titleEn}
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-glow/20 text-cyan-glow text-xs font-semibold self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4 text-cyan-glow" />
              <span>{language === "ar" ? currentItem.statsAr : currentItem.statsEn}</span>
            </div>
          </div>

          {/* Interactive Split Drag Comparison Box */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full h-[360px] sm:h-[480px] lg:h-[540px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-inner group"
          >
            {/* After Image (Background full layer) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentItem.afterImg})` }}
            >
              {/* After Label Badge */}
              <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-cyan-glow/40 text-cyan-glow text-xs font-bold shadow-lg">
                {t.beforeAfter.after}
              </div>
            </div>

            {/* Before Image (Clipped overlay layer) */}
            <div
              className="absolute inset-0 bg-cover bg-center overflow-hidden transition-none"
              style={{
                backgroundImage: `url(${currentItem.beforeImg})`,
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              {/* Before Label Badge */}
              <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-gray-300 text-xs font-bold shadow-lg">
                {t.beforeAfter.before}
              </div>
            </div>

            {/* Draggable Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 z-30 w-1 bg-cyan-glow pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Handle Knob */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black/90 border-2 border-cyan-glow flex items-center justify-center shadow-glow text-cyan-glow pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                <ArrowLeftRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>

            {/* Instruction tooltip overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-gray-300 text-xs font-medium pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              {language === "ar" ? "اسحب المقبض يميناً ويساراً للمقارنة" : "Drag handle left & right to compare"}
            </div>
          </div>

          {/* Description & Pagination Carousel Controls */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
            <p className="text-gray-400 text-xs sm:text-sm max-w-2xl leading-relaxed text-center sm:text-start">
              {language === "ar" ? currentItem.descAr : currentItem.descEn}
            </p>

            {filteredItems.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setActiveItemIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1))
                  }
                  className="p-2.5 rounded-xl bg-carbon-800 hover:bg-carbon-700 text-white border border-white/10 transition-colors"
                  aria-label="Previous Showcase"
                >
                  <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                </button>
                <span className="text-xs font-bold text-gray-400 font-sans px-2">
                  {activeItemIndex + 1} / {filteredItems.length}
                </span>
                <button
                  onClick={() =>
                    setActiveItemIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0))
                  }
                  className="p-2.5 rounded-xl bg-carbon-800 hover:bg-carbon-700 text-white border border-white/10 transition-colors"
                  aria-label="Next Showcase"
                >
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
