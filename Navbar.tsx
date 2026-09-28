"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import {
  Shield,
  Calendar,
  User,
  Sliders,
  Sparkles,
  Bot,
  Activity,
  Menu,
  X,
  Phone,
} from "lucide-react";

interface NavbarProps {
  onOpenBooking: (prefill?: { serviceId?: string; packageId?: string }) => void;
  onOpenAdvisor: () => void;
  onOpenTracker: (id?: string) => void;
  onOpenPortal: () => void;
  onOpenAdmin: () => void;
  onScrollTo: (elementId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAdvisor,
  onOpenTracker,
  onOpenPortal,
  onOpenAdmin,
  onScrollTo,
}) => {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/[0.08] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-glow to-cyan-dark flex items-center justify-center p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-carbon-900 rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-glow animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-xl text-white font-sans">
                  APEX
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold rounded bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
                {language === "ar" ? "جدة • العناية الفائقة والحماية" : "Jeddah • Premium Detailing"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
            <button
              onClick={() => onScrollTo("services-section")}
              className="hover:text-cyan-glow transition-colors"
            >
              {t.nav.services}
            </button>
            <button
              onClick={() => onScrollTo("packages-section")}
              className="hover:text-cyan-glow transition-colors"
            >
              {t.nav.packages}
            </button>
            <button
              onClick={() => onScrollTo("builder-section")}
              className="hover:text-cyan-glow transition-colors flex items-center gap-1.5 text-cyan-accent font-semibold"
            >
              <Sliders className="w-4 h-4" />
              {t.nav.buildPackage}
            </button>
            <button
              onClick={() => onScrollTo("before-after-section")}
              className="hover:text-cyan-glow transition-colors"
            >
              {t.nav.beforeAfter}
            </button>
            <button
              onClick={onOpenAdvisor}
              className="hover:text-cyan-glow transition-colors flex items-center gap-1.5 text-emerald-400"
            >
              <Bot className="w-4 h-4 animate-bounce" />
              {t.nav.aiAdvisor}
            </button>
            <button
              onClick={() => onOpenTracker()}
              className="hover:text-cyan-glow transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-cyan-glow" />
              {t.nav.trackCar}
            </button>
          </nav>

          {/* Action CTAs & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-carbon-800 hover:bg-carbon-700 text-gray-300 border border-white/10 transition-colors"
              title="تغيير اللغة / Switch Language"
            >
              {language === "ar" ? "English" : "العربية"}
            </button>

            {/* Customer Portal Button */}
            <button
              onClick={onOpenPortal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-carbon-800 hover:bg-carbon-700 text-gray-200 border border-white/10 transition-colors"
            >
              <User className="w-4 h-4 text-cyan-glow" />
              <span>{t.nav.portal}</span>
            </button>

            {/* Admin Console Button */}
            <button
              onClick={onOpenAdmin}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-carbon-850 hover:bg-carbon-750 text-gray-400 hover:text-white border border-white/5 transition-colors"
              title="لوحة الإدارة ERP"
            >
              <span>{t.nav.admin}</span>
            </button>

            {/* Primary Book Appointment CTA */}
            <button
              onClick={() => onOpenBooking()}
              className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-glow to-blue-600 text-black font-bold text-xs sm:text-sm shadow-glow hover:shadow-glow-lg transition-all duration-300 transform active:scale-95 flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {t.nav.bookNow}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-carbon-800 text-gray-300 hover:text-white border border-white/10"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-carbon-900/95 border-b border-white/10 px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => {
                onScrollTo("services-section");
                setMobileMenuOpen(false);
              }}
              className="text-start p-2.5 rounded-lg bg-carbon-800 text-gray-200 hover:bg-carbon-700"
            >
              {t.nav.services}
            </button>
            <button
              onClick={() => {
                onScrollTo("packages-section");
                setMobileMenuOpen(false);
              }}
              className="text-start p-2.5 rounded-lg bg-carbon-800 text-gray-200 hover:bg-carbon-700"
            >
              {t.nav.packages}
            </button>
            <button
              onClick={() => {
                onScrollTo("builder-section");
                setMobileMenuOpen(false);
              }}
              className="text-start p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-glow/30 text-cyan-glow font-bold flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4" />
              {t.nav.buildPackage}
            </button>
            <button
              onClick={() => {
                onScrollTo("before-after-section");
                setMobileMenuOpen(false);
              }}
              className="text-start p-2.5 rounded-lg bg-carbon-800 text-gray-200 hover:bg-carbon-700"
            >
              {t.nav.beforeAfter}
            </button>
            <button
              onClick={() => {
                onOpenAdvisor();
                setMobileMenuOpen(false);
              }}
              className="text-start p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              {t.nav.aiAdvisor}
            </button>
            <button
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="text-start p-2.5 rounded-lg bg-carbon-800 text-gray-200 hover:bg-carbon-700 flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-cyan-glow" />
              {t.nav.trackCar}
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenPortal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 px-3 rounded-lg bg-carbon-800 border border-white/10 text-xs font-semibold text-center text-white flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-cyan-glow" />
              {t.nav.portal}
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 px-3 rounded-lg bg-carbon-800 border border-white/10 text-xs font-semibold text-center text-gray-400 flex items-center justify-center gap-1.5"
            >
              {t.nav.admin}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
