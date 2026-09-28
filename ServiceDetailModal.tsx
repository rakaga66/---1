"use client";

import React, { useState } from "react";
import { ServiceItem } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import {
  X,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Calendar,
} from "lucide-react";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBook: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBook,
}) => {
  const { t, language, isRTL } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-carbon-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header Visual Banner */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden shrink-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${service.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-900 via-carbon-900/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-gray-300 hover:text-white border border-white/20 transition-all"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Service Title on Banner */}
          <div className="absolute bottom-4 start-6 end-6 z-10">
            {service.badge && (
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-glow/40 text-cyan-glow text-xs font-bold mb-2">
                {service.badge}
              </span>
            )}
            <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {language === "ar" ? service.nameAr : service.nameEn}
            </h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-carbon-850 border border-white/10 text-center">
            <div>
              <div className="text-xs text-gray-400 font-medium">{t.services.startingFrom}</div>
              <div className="text-lg sm:text-2xl font-black text-cyan-glow font-sans mt-0.5">
                {service.basePrice.toLocaleString()} {t.services.sar}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">{t.services.duration}</div>
              <div className="text-sm sm:text-base font-bold text-white mt-1 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{language === "ar" ? service.durationAr : service.durationEn}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">{t.services.warranty}</div>
              <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {service.warrantyYears}{" "}
                  {language === "ar" ? "سنوات رسمية" : "Years Official"}
                </span>
              </div>
            </div>
          </div>

          {/* Full Plain Description */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-glow" />
              <span>{language === "ar" ? "نبذة عن الخدمة والنتيجة" : "Service Overview & Outcome"}</span>
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {language === "ar" ? service.fullDescAr : service.fullDescEn}
            </p>
          </div>

          {/* The Problem It Solves */}
          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20">
            <h4 className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t.services.problemTitle}</span>
            </h4>
            <p className="text-gray-300">
              {language === "ar" ? service.problemAr : service.problemEn}
            </p>
          </div>

          {/* Concrete Benefits */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-glow" />
              <span>{t.services.benefitsTitle}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(language === "ar" ? service.benefitsAr : service.benefitsEn).map(
                (benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-carbon-800/80 border border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-glow shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-200">{benefit}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Frequently Asked Questions */}
          {service.faqs && service.faqs.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-yellow-400" />
                <span>{language === "ar" ? "الأسئلة الشائعة حول هذه الخدمة" : "Frequently Asked Questions"}</span>
              </h4>
              <div className="space-y-2">
                {service.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-white/10 rounded-xl overflow-hidden bg-carbon-800/60"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-3.5 text-start font-semibold text-white flex items-center justify-between gap-2 hover:bg-carbon-700/50 transition-colors"
                      >
                        <span className="text-xs sm:text-sm">
                          {language === "ar" ? faq.qAr : faq.qEn}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-3.5 pt-0 text-xs sm:text-sm text-gray-300 border-t border-white/5 bg-carbon-850/50">
                          {language === "ar" ? faq.aAr : faq.aEn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 sm:p-6 bg-carbon-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-xs text-gray-400">{t.services.startingFrom}:</span>
            <div className="text-xl sm:text-2xl font-black text-white font-sans">
              {service.basePrice.toLocaleString()} {t.services.sar}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-carbon-800 text-gray-300 font-semibold hover:bg-carbon-700 transition-colors text-xs sm:text-sm"
            >
              {language === "ar" ? "رجوع" : "Close"}
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(service.id);
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-glow to-blue-600 text-black font-extrabold shadow-glow hover:shadow-glow-lg transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.services.bookService}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
