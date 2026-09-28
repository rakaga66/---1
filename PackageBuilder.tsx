"use client";

import React, { useState, useMemo } from "react";
import { VehicleSize, CustomerCar } from "@/lib/types";
import { initialServices, carBrandsList } from "@/lib/data";
import { useLanguage } from "@/lib/language-context";
import {
  Sliders,
  CheckCircle2,
  Calendar,
  Sparkles,
  Clock,
  ShieldCheck,
  Tag,
  Zap,
} from "lucide-react";

interface PackageBuilderProps {
  onProceedToBooking: (builderData: {
    car: CustomerCar;
    serviceIds: string[];
    totalAmount: number;
  }) => void;
}

export const PackageBuilder: React.FC<PackageBuilderProps> = ({ onProceedToBooking }) => {
  const { t, language, isRTL } = useLanguage();

  // Car Details State
  const [selectedBrandIndex, setSelectedBrandIndex] = useState<number>(0);
  const [selectedModel, setSelectedModel] = useState<string>("911 GT3 RS");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedSize, setSelectedSize] = useState<VehicleSize>("coupe");
  const [plateNumber, setPlateNumber] = useState<string>("أ ب ج 911");

  // Selected Services State
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    "serv-ppf-front",
    "serv-ceramic-10h",
    "serv-thermal-tint",
  ]);

  const activeBrand = carBrandsList[selectedBrandIndex] || carBrandsList[0];

  const handleToggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  // Calculation Engine
  const { originalPrice, discountAmount, finalPrice, estimatedHours, maxWarranty } = useMemo(() => {
    let subtotal = 0;
    let hours = 0;
    let warranty = 1;

    selectedServiceIds.forEach((sId) => {
      const s = initialServices.find((item) => item.id === sId);
      if (s) {
        const itemPrice = Math.round(s.basePrice * (s.priceMultipliers[selectedSize] || 1));
        subtotal += itemPrice;
        warranty = Math.max(warranty, s.warrantyYears);
        // Approximate hours
        if (s.id.includes("ppf-full")) hours += 48;
        else if (s.id.includes("ppf-front")) hours += 24;
        else if (s.id.includes("ceramic")) hours += 16;
        else if (s.id.includes("paint")) hours += 14;
        else if (s.id.includes("tint")) hours += 4;
        else if (s.id.includes("interior")) hours += 6;
        else hours += 3;
      }
    });

    // Tiered Bundle Discount:
    // 1 service: 0% discount
    // 2 services: 10% discount
    // 3 services: 15% discount
    // 4+ services: 20% discount
    let discountPct = 0;
    if (selectedServiceIds.length === 2) discountPct = 0.10;
    else if (selectedServiceIds.length === 3) discountPct = 0.15;
    else if (selectedServiceIds.length >= 4) discountPct = 0.20;

    const discountVal = Math.round(subtotal * discountPct);
    const finalVal = Math.max(0, subtotal - discountVal);

    return {
      originalPrice: subtotal,
      discountAmount: discountVal,
      finalPrice: finalVal,
      estimatedHours: hours || 6,
      maxWarranty: warranty,
    };
  }, [selectedServiceIds, selectedSize]);

  const handleConfirm = () => {
    if (selectedServiceIds.length === 0) return;
    const car: CustomerCar = {
      id: `car-custom-${Date.now()}`,
      make: activeBrand.make,
      model: selectedModel,
      year: selectedYear,
      plate: plateNumber || "أ ب ج 123",
      color: "Custom",
      sizeCategory: selectedSize,
    };

    onProceedToBooking({
      car,
      serviceIds: selectedServiceIds,
      totalAmount: finalPrice,
    });
  };

  const yearsList = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

  return (
    <section id="builder-section" className="py-24 bg-carbon-950 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-glow/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Customizer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t.builder.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.builder.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Vehicle & Service Selector (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Vehicle Configuration Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-cyan-glow/20 text-cyan-glow flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>{t.builder.step1}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Brand Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">
                    {t.builder.make}
                  </label>
                  <select
                    value={selectedBrandIndex}
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      setSelectedBrandIndex(idx);
                      setSelectedModel(carBrandsList[idx].models[0]);
                    }}
                    className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-xs sm:text-sm focus:border-cyan-glow focus:outline-none transition-colors"
                  >
                    {carBrandsList.map((brand, idx) => (
                      <option key={idx} value={idx}>
                        {brand.make}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">
                    {t.builder.model}
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-xs sm:text-sm focus:border-cyan-glow focus:outline-none transition-colors"
                  >
                    {activeBrand.models.map((mod, idx) => (
                      <option key={idx} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">
                    {t.builder.year}
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-xs sm:text-sm focus:border-cyan-glow focus:outline-none transition-colors font-sans"
                  >
                    {yearsList.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plate Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">
                    {language === "ar" ? "رقم اللوحة (اختياري)" : "Plate (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="أ ب ج 911"
                    className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-xs sm:text-sm focus:border-cyan-glow focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Vehicle Body Size Selection Grid */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">
                  {t.builder.size}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {(
                    [
                      { id: "coupe", label: t.builder.sizes.coupe },
                      { id: "sedan", label: t.builder.sizes.sedan },
                      { id: "midSuv", label: t.builder.sizes.midSuv },
                      { id: "largeSuv", label: t.builder.sizes.largeSuv },
                      { id: "exotic", label: t.builder.sizes.exotic },
                    ] as const
                  ).map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size.id)}
                      className={`p-3 rounded-2xl text-xs font-semibold text-center transition-all ${
                        selectedSize === size.id
                          ? "bg-cyan-glow text-black font-bold shadow-glow border-2 border-cyan-glow"
                          : "bg-carbon-800/80 text-gray-300 hover:bg-carbon-700 border border-white/10"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Service Selection Checkboxes */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-cyan-glow/20 text-cyan-glow flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span>{t.builder.step2}</span>
                </h3>
                <span className="text-xs text-cyan-glow font-bold">
                  {language === "ar"
                    ? `تم اختيار ${selectedServiceIds.length} خدمات`
                    : `${selectedServiceIds.length} Selected`}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {initialServices.map((service) => {
                  const isChecked = selectedServiceIds.includes(service.id);
                  const price = Math.round(
                    service.basePrice * (service.priceMultipliers[selectedSize] || 1)
                  );

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleToggleService(service.id)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex items-start gap-3.5 ${
                        isChecked
                          ? "bg-cyan-950/40 border-cyan-glow/60 shadow-glow"
                          : "bg-carbon-800/70 border-white/10 hover:border-white/20 hover:bg-carbon-750"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? "bg-cyan-glow border-cyan-glow text-black"
                            : "border-white/30 bg-carbon-900"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-4 h-4 fill-black text-cyan-glow" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-white leading-tight">
                            {language === "ar" ? service.nameAr : service.nameEn}
                          </h4>
                          <span className="text-sm font-black text-white font-sans shrink-0">
                            {price.toLocaleString()} {t.services.sar}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                          {language === "ar" ? service.shortDescAr : service.shortDescEn}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-glow" />
                            {language === "ar" ? service.durationAr : service.durationEn}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            {service.warrantyYears} {language === "ar" ? "سنوات ضمان" : "Y Warranty"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Real-time Summary Card (4 Cols Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-glow/40 shadow-glow-lg">
              <div className="flex items-center gap-2 mb-6 text-cyan-glow font-bold text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{t.builder.summaryTitle}</span>
              </div>

              {/* Selected Car Tag */}
              <div className="p-3.5 rounded-2xl bg-carbon-800/80 border border-white/10 mb-6">
                <span className="text-[11px] text-gray-400 block">{language === "ar" ? "السيارة المحددة:" : "Vehicle Spec:"}</span>
                <div className="text-base font-black text-white mt-0.5">
                  {activeBrand.make} {selectedModel} ({selectedYear})
                </div>
                <div className="text-xs text-cyan-glow font-semibold mt-1">
                  {t.builder.sizes[selectedSize]}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 border-b border-white/10 text-sm">
                <div className="flex items-center justify-between text-gray-400">
                  <span>{t.builder.originalPrice}</span>
                  <span className="font-sans line-through">
                    {originalPrice.toLocaleString()} {t.services.sar}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {t.builder.bundleDiscount}
                    </span>
                    <span className="font-sans">
                      -{discountAmount.toLocaleString()} {t.services.sar}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-400 text-xs">
                  <span>{t.builder.estimatedTime}</span>
                  <span className="text-white font-medium">
                    {Math.ceil(estimatedHours / 24) > 1
                      ? `${Math.ceil(estimatedHours / 24)} ${language === "ar" ? "أيام عمل" : "Business Days"}`
                      : `${estimatedHours} ${language === "ar" ? "ساعات" : "Hours"}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-400 text-xs">
                  <span>{language === "ar" ? "الضمان الأقصى:" : "Max Warranty:"}</span>
                  <span className="text-emerald-400 font-bold">
                    {maxWarranty} {language === "ar" ? "سنوات رسمية" : "Years Official"}
                  </span>
                </div>
              </div>

              {/* Total & Savings Banner */}
              <div className="py-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-gray-300 font-bold">{t.builder.finalPrice}</span>
                  <div className="text-3xl font-black text-white font-sans text-cyan-glow">
                    {finalPrice.toLocaleString()} {t.services.sar}
                  </div>
                </div>

                {discountAmount > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-pulse">
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {language === "ar"
                        ? `أنت توفر الآن ${discountAmount.toLocaleString()} ر.س مع هذا العرض المجمع!`
                        : `You are saving ${discountAmount.toLocaleString()} SAR with this bundle!`}
                    </span>
                  </div>
                )}
              </div>

              {/* Book Button */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={selectedServiceIds.length === 0}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-glow to-blue-600 text-black font-black text-sm sm:text-base shadow-glow hover:shadow-glow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>{t.builder.bookCustom}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
