"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("نانو سيراميك 10H");
  const [carName, setCarName] = useState("Porsche 911 / G63");
  const [estimatedPrice, setEstimatedPrice] = useState("2,400");

  const buildWhatsAppUrl = () => {
    const textAr = `مرحبًا، أرغب في الاستفسار وحجز خدمة ${selectedService} لسيارة ${carName} في فرع جدة، وظهر لي السعر التقديري في الموقع ${estimatedPrice} ريال.`;
    const textEn = `Hello, I'd like to inquire and book ${selectedService} for my ${carName} at your Jeddah studio. The website estimated around ${estimatedPrice} SAR.`;
    const message = language === "ar" ? textAr : textEn;
    return `https://wa.me/966504821990?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed bottom-6 end-6 z-40 flex flex-col items-end">
      {/* Interactive Micro-Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl glass-panel-glow border border-emerald-500/40 p-5 shadow-2xl text-start animate-fade-in text-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white text-sm">
                {language === "ar" ? "منسق حجوزات VIP - جدة" : "VIP Concierge - Jeddah"}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-gray-300 leading-relaxed">
            {language === "ar"
              ? "مرحباً بك في أبيكس ستوديو! يمكنك بدء محادثة واتساب فورية مجهزة ببيانات سيارتك والسعر التقديري مباشرة:"
              : "Welcome to APEX Studio! Start an instant WhatsApp chat with pre-filled vehicle and pricing specs:"}
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">
                {language === "ar" ? "الخدمة المطلوبة:" : "Desired Service:"}
              </label>
              <select
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  if (e.target.value.includes("PPF")) setEstimatedPrice("5,900");
                  else if (e.target.value.includes("سيراميك")) setEstimatedPrice("2,400");
                  else setEstimatedPrice("1,600");
                }}
                className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-2.5 text-xs"
              >
                <option value="نانو سيراميك 10H">نانو سيراميك ألماني 10H (German 10H Ceramic)</option>
                <option value="حماية PPF كاملة">درع الحماية الكامل PPF (Full Body PPF)</option>
                <option value="حماية الواجهة PPF">حماية الواجهة درع الذهب (Front End PPF)</option>
                <option value="عازل حراري نانو">عازل حراري نانو سيراميك XPEL (Thermal Tint)</option>
                <option value="تلميع وتصحيح طلاء">تصحيح طلاء ميكروني (Paint Correction)</option>
                <option value="تنظيف داخلي عميق">تنظيف داخلي وعزل جلود (Interior Spa)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-gray-400 block mb-1">
                {language === "ar" ? "موديل السيارة:" : "Vehicle Model:"}
              </label>
              <input
                type="text"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="Porsche 911 / Mercedes G63 / BMW X5"
                className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>

          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{language === "ar" ? "إرسال الاستفسار عبر واتساب" : "Send Inquiry via WhatsApp"}</span>
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 group relative"
        aria-label="تواصل واتساب"
      >
        <span className="absolute -top-1 -end-1 w-3.5 h-3.5 rounded-full bg-cyan-glow border-2 border-carbon-950 animate-ping" />
        <MessageSquare className="w-7 h-7 text-black fill-black" />
      </button>
    </div>
  );
};
