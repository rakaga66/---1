"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import {
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  FileCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";

export const WhyUsSection: React.FC = () => {
  const { t, language } = useLanguage();

  const reasons = [
    {
      icon: ShieldCheck,
      title: t.whyUs.p1Title,
      desc: t.whyUs.p1Desc,
      tag: "100% Genuine",
    },
    {
      icon: Layers,
      title: t.whyUs.p2Title,
      desc: t.whyUs.p2Desc,
      tag: "Dust-Free",
    },
    {
      icon: Cpu,
      title: t.whyUs.p3Title,
      desc: t.whyUs.p3Desc,
      tag: "No Blades",
    },
    {
      icon: Sparkles,
      title: t.whyUs.p4Title,
      desc: t.whyUs.p4Desc,
      tag: "Ultrasound Micron",
    },
    {
      icon: FileCheck,
      title: t.whyUs.p5Title,
      desc: t.whyUs.p5Desc,
      tag: "Up to 10 Years",
    },
    {
      icon: Truck,
      title: t.whyUs.p6Title,
      desc: t.whyUs.p6Desc,
      tag: "Enclosed Flatbed",
    },
  ];

  return (
    <section className="py-24 bg-carbon-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>The APEX Standard</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t.whyUs.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-cyan-glow/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center text-cyan-glow group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-carbon-800">
                    {r.tag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-glow transition-colors">
                  {r.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
