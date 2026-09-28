"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { ApexStore } from "@/lib/store";
import { BookingRecord, WorkshopStage } from "@/lib/types";
import {
  Activity,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  MapPin,
  Camera,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface LiveVehicleTrackerProps {
  initialBookingId?: string;
  onOpenBooking: () => void;
}

export const LiveVehicleTracker: React.FC<LiveVehicleTrackerProps> = ({
  initialBookingId,
  onOpenBooking,
}) => {
  const { t, language, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState<string>(initialBookingId || "APX-8941");
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  // Sync with store updates
  const loadBooking = (term: string) => {
    if (!term.trim()) return;
    const found = ApexStore.getBookingById(term.trim());
    setActiveBooking(found || null);
    setSearched(true);
  };

  useEffect(() => {
    if (initialBookingId) {
      setSearchTerm(initialBookingId);
      loadBooking(initialBookingId);
    } else {
      // Default to demo car APX-8941
      loadBooking("APX-8941");
    }

    const handleStoreChange = () => {
      loadBooking(searchTerm);
    };

    window.addEventListener("apex_store_updated", handleStoreChange);
    return () => window.removeEventListener("apex_store_updated", handleStoreChange);
  }, [initialBookingId]);

  const stagesList: { id: WorkshopStage; titleAr: string; titleEn: string }[] = [
    { id: "Received", titleAr: "تم استلام السيارة", titleEn: "Vehicle Checked In" },
    { id: "Inspection", titleAr: "الفحص وسماكة الطلاء", titleEn: "Paint Depth Audit" },
    { id: "InDecontamination", titleAr: "التجهيز وإزالة الشوائب", titleEn: "Chemical Decon" },
    { id: "Polishing", titleAr: "التلميع وتصحيح الطلاء", titleEn: "Paint Correction" },
    { id: "ProtectionApplication", titleAr: "تركيب الحماية والنانو", titleEn: "PPF & Ceramic" },
    { id: "QualityControl", titleAr: "الفحص النهائي الطيفي", titleEn: "Final Inspection" },
    { id: "Ready", titleAr: "جاهزة للاستلام", titleEn: "Ready for Pickup" },
  ];

  const getStageIndex = (stage: WorkshopStage) => {
    if (stage === "Waiting") return -1;
    if (stage === "Delivered") return 7;
    return stagesList.findIndex((s) => s.id === stage);
  };

  const currentStageIndex = activeBooking ? getStageIndex(activeBooking.workshopStage) : -1;

  return (
    <section id="tracker-section" className="py-24 bg-carbon-900 border-t border-white/[0.06] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-glow/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Live Workshop Status Stream</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t.tracking.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.tracking.subtitle}
          </p>

          {/* Search Box */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadBooking(searchTerm)}
                placeholder={t.tracking.searchPlaceholder}
                className="w-full bg-carbon-850 border border-white/15 text-white rounded-2xl py-3.5 px-4 text-sm font-sans focus:border-cyan-glow focus:outline-none shadow-inner"
              />
            </div>
            <button
              onClick={() => loadBooking(searchTerm)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-glow hover:bg-cyan-accent text-black font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{t.tracking.searchBtn}</span>
            </button>
          </div>

          <div className="mt-3 text-[11px] text-gray-500">
            {language === "ar"
              ? "جرّب البحث برقم الحجز التجريبي: APX-8941 أو APX-8942 أو APX-8943"
              : "Try demo booking IDs: APX-8941, APX-8942, or APX-8943"}
          </div>
        </div>

        {/* Search Results Display */}
        {activeBooking ? (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 max-w-5xl mx-auto shadow-2xl space-y-8 animate-fade-in">
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-cyan-glow uppercase tracking-wider">
                    {language === "ar" ? "رقم الحجز:" : "Booking Ref:"} {activeBooking.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    {activeBooking.bookingStatus}
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white mt-1">
                  {activeBooking.car.make} {activeBooking.car.model} ({activeBooking.car.year})
                </h3>
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  <span>{activeBooking.customerName}</span>
                  <span>•</span>
                  <span>{activeBooking.car.plate}</span>
                </div>
              </div>

              {/* Handover & Location Badges */}
              <div className="flex flex-col sm:items-end gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-carbon-800 border border-white/5">
                  <Clock className="w-4 h-4 text-cyan-glow" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">{t.tracking.estimatedHandover}</span>
                    <span className="text-white font-bold">{activeBooking.estimatedCompletion}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-glow" />
                  <span>
                    {activeBooking.branchId === "jeddah-malik"
                      ? "فرع طريق الملك - حي الشاطئ"
                      : "فرع حي الروضة"}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Workshop Progress Stepper */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {language === "ar" ? "مسار مراحل الورشة الحية:" : "Live Workshop Lifecycle Stages:"}
                </span>
                <span className="text-xs text-cyan-glow font-bold">
                  {t.tracking.stages[activeBooking.workshopStage] || activeBooking.workshopStage}
                </span>
              </div>

              {/* Horizontal Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {stagesList.map((stage, idx) => {
                  const isPassed = currentStageIndex > idx;
                  const isCurrent = currentStageIndex === idx;

                  return (
                    <div
                      key={stage.id}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? "bg-cyan-950/60 border-cyan-glow shadow-glow"
                          : isPassed
                          ? "bg-carbon-850 border-emerald-500/30 text-gray-300"
                          : "bg-carbon-850/40 border-white/5 text-gray-600 opacity-60"
                      }`}
                    >
                      <div className="flex justify-center mb-1.5">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full bg-cyan-glow animate-ping" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-600" />
                        )}
                      </div>
                      <div
                        className={`text-[11px] font-bold leading-tight ${
                          isCurrent ? "text-cyan-glow" : isPassed ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {language === "ar" ? stage.titleAr : stage.titleEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technician Notes Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-carbon-850 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-glow/15 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block">{t.tracking.assignedTech}</span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {activeBooking.technicianName}
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {activeBooking.technicianNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Live Workshop Photos Feed */}
            {activeBooking.photos && activeBooking.photos.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-glow" />
                  <span>{t.tracking.workshopPhotos}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeBooking.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="rounded-2xl overflow-hidden bg-carbon-850 border border-white/10 group"
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url(${photo.url})` }}
                        />
                        <div className="absolute top-2 end-2 px-2 py-0.5 rounded-md bg-black/75 text-[10px] text-cyan-glow font-bold backdrop-blur-md">
                          {photo.timestamp}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-300 leading-snug">
                          {language === "ar" ? photo.captionAr : photo.captionEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : searched ? (
          <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center max-w-lg mx-auto space-y-4 animate-fade-in">
            <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              {language === "ar" ? "لم يتم العثور على حجز بهذا الرقم" : "No Booking Found"}
            </h3>
            <p className="text-xs text-gray-400">
              {language === "ar"
                ? "تأكد من إدخال رقم الحجز الصحيح (مثال: APX-8941) أو رقم الجوال المستخدم أثناء الحجز."
                : "Please check your booking reference code (e.g. APX-8941) or phone number."}
            </p>
            <button
              onClick={onOpenBooking}
              className="px-6 py-2.5 rounded-xl bg-cyan-glow text-black font-bold text-xs shadow-glow"
            >
              {language === "ar" ? "احجز موعداً جديداً الآن" : "Book New Appointment"}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};
