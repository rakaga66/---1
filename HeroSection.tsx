"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface HeroSectionProps {
  onOpenBooking: () => void;
  onScrollTo: (elementId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onScrollTo,
}) => {
  const { t, language, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden pt-12 pb-20 bg-carbon-950">
      {/* Background Cinematic Visual & Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        {/* Gradients to blend smoothly */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/80 to-carbon-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-950/90 via-transparent to-carbon-950/90" />
        {/* Radial ambient spotlight */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-glow/15 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-glow/30 text-cyan-glow text-xs sm:text-sm font-semibold mb-6 shadow-glow backdrop-blur-md animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-ping" />
          <span>{t.hero.tag}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] mb-6 max-w-4xl text-balance">
          {language === "ar" ? (
            <>
              احمِ سيارتك.{" "}
              <span className="text-cyan-glow block sm:inline">
                وخليها ترجع كأنها جديدة.
              </span>
            </>
          ) : (
            <>
              Protect Your Vehicle.{" "}
              <span className="text-cyan-glow block sm:inline">
                Restore Its Showroom Glory.
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-gray-300 font-normal leading-relaxed max-w-3xl mb-10 text-balance">
          {t.hero.desc}
        </p>

        {/* Dual Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-glow to-blue-600 text-black font-extrabold text-base sm:text-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 group"
          >
            <Calendar className="w-5 h-5 text-black" />
            <span>{t.hero.ctaBook}</span>
            <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onScrollTo("packages-section")}
            className="w-full sm:w-auto px-7 py-4 rounded-xl glass-panel text-white font-bold text-base sm:text-lg hover:border-cyan-glow/40 hover:bg-white/[0.06] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>{t.hero.ctaPackages}</span>
          </button>

          <button
            onClick={() => onScrollTo("builder-section")}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-carbon-850 hover:bg-carbon-800 text-cyan-accent border border-cyan-glow/20 font-bold text-base hover:border-cyan-glow/50 transition-all flex items-center justify-center gap-2"
          >
            <Sliders className="w-4 h-4 text-cyan-glow" />
            <span>{t.hero.ctaBuild}</span>
          </button>
        </div>

        {/* Social Proof Counter Bar */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl">
          {/* Proof 1: Cars Serviced */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/[0.07] text-center hover:border-cyan-glow/30 transition-all group">
            <div className="text-2xl sm:text-4xl font-black text-white group-hover:text-cyan-glow transition-colors font-sans">
              {t.hero.proofCars}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {t.hero.proofCarsLabel}
            </div>
          </div>

          {/* Proof 2: Google Rating */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/[0.07] text-center hover:border-yellow-400/30 transition-all group">
            <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-4xl font-black text-white group-hover:text-yellow-400 transition-colors font-sans">
              <span>{t.hero.proofRating}</span>
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 inline" />
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {t.hero.proofRatingLabel}
            </div>
          </div>

          {/* Proof 3: Official Warranty */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/[0.07] text-center hover:border-cyan-glow/30 transition-all group">
            <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-4xl font-black text-white group-hover:text-cyan-glow transition-colors font-sans">
              <ShieldCheck className="w-6 h-6 text-cyan-glow hidden sm:inline" />
              <span>{t.hero.proofWarranty}</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {t.hero.proofWarrantyLabel}
            </div>
          </div>

          {/* Proof 4: On-time Delivery */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/[0.07] text-center hover:border-emerald-400/30 transition-all group">
            <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-4xl font-black text-white group-hover:text-emerald-400 transition-colors font-sans">
              <Clock className="w-6 h-6 text-emerald-400 hidden sm:inline" />
              <span>{t.hero.proofTime}</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
              {t.hero.proofTimeLabel}
            </div>
          </div>
        </div>

        {/* Certified Material Partners Banner */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-400 uppercase tracking-widest font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-glow" />
            <span>XPEL DAP Certified USA</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-glow" />
            <span>Gyeon Quartz Authorized</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-glow" />
            <span>Koch-Chemie Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-glow" />
            <span>Stek Automotive Defense</span>
          </div>
        </div>
      </div>
    </section>
  );
};
