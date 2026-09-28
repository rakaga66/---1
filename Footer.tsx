"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { Shield, MapPin, Clock, Phone, Mail, ExternalLink } from "lucide-react";

interface FooterProps {
  onScrollTo: (id: string) => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenAdvisor: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollTo,
  onOpenBooking,
  onOpenTracker,
  onOpenAdvisor,
  onOpenAdmin,
}) => {
  const { t, language } = useLanguage();

  const seoTags = [
    "PPF جدة",
    "نانو سيراميك جدة",
    "تلميع سيارات جدة",
    "عازل حراري جدة",
    "أفضل مركز عناية سيارات جدة",
    "XPEL جدة",
    "حماية سوبركارز جدة",
    "تصحيح طلاء جدة",
  ];

  return (
    <footer className="bg-carbon-950 border-t border-white/[0.08] pt-16 pb-12 text-sm text-gray-400 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-glow to-blue-600 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-carbon-950 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-glow" />
                </div>
              </div>
              <span className="font-extrabold tracking-wider text-xl text-white font-sans">
                APEX STUDIO
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              {t.footer.about}
            </p>
            <div className="text-xs text-gray-500 font-sans">
              CR: 4030491823 • Jeddah Municipality Certified
            </div>
          </div>

          {/* Jeddah Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.locations}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-glow shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-bold">{t.footer.branch1}</div>
                  <span className="text-[11px] text-gray-400">
                    طريق الملك عبدالعزيز، شمال ميدان الكرة الأرضية، حي الشاطئ
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-glow shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-bold">{t.footer.branch2}</div>
                  <span className="text-[11px] text-gray-400">
                    شارع الأمير سلطان تقاطع صاري، حي الروضة
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-[11px] text-gray-300 pt-2 border-t border-white/5">
                <Clock className="w-3.5 h-3.5 text-cyan-glow shrink-0" />
                <span>{t.footer.hours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === "ar" ? "روابط سريعة" : "Navigation"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onScrollTo("services-section")}
                  className="hover:text-cyan-glow transition-colors"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("packages-section")}
                  className="hover:text-cyan-glow transition-colors"
                >
                  {t.nav.packages}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("builder-section")}
                  className="hover:text-cyan-glow transition-colors"
                >
                  {t.nav.buildPackage}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("before-after-section")}
                  className="hover:text-cyan-glow transition-colors"
                >
                  {t.nav.beforeAfter}
                </button>
              </li>
              <li>
                <button onClick={onOpenAdvisor} className="hover:text-cyan-glow transition-colors text-emerald-400 font-semibold">
                  {t.nav.aiAdvisor}
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-cyan-glow transition-colors">
                  {t.nav.trackCar}
                </button>
              </li>
            </ul>
          </div>

          {/* SEO & Direct Booking Concierge */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === "ar" ? "خدمة العملاء VIP" : "VIP Concierge"}
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="tel:+966504821990"
                className="flex items-center gap-2 text-gray-300 hover:text-cyan-glow font-sans font-semibold"
              >
                <Phone className="w-4 h-4 text-cyan-glow" />
                <span>+966 50 482 1990</span>
              </a>
              <div className="flex items-center gap-2 text-gray-300 font-sans">
                <Mail className="w-4 h-4 text-cyan-glow" />
                <span>concierge@apexstudio.sa</span>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-glow hover:bg-cyan-accent text-black font-extrabold text-xs shadow-glow transition-colors"
            >
              {t.hero.ctaBook}
            </button>

            <button
              onClick={onOpenAdmin}
              className="w-full py-1.5 px-3 rounded-lg bg-carbon-900 hover:bg-carbon-850 text-gray-500 hover:text-gray-300 text-[11px] border border-white/5 transition-colors"
            >
              {language === "ar" ? "بوابة الإدارة ERP" : "Admin Operations Portal"}
            </button>
          </div>
        </div>

        {/* SEO Keywords Pills Strip */}
        <div className="pt-6 border-t border-white/5 pb-6">
          <div className="text-[11px] text-gray-400 mb-2 font-bold">
            {language === "ar" ? "الكلمات المفتاحية والخدمات الشائعة في جدة:" : "Popular Searches in Jeddah:"}
          </div>
          <div className="flex flex-wrap gap-2">
            {seoTags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md bg-carbon-900 border border-white/5 text-[10px] text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>{t.footer.rights}</div>
          <div className="text-[11px] text-gray-400">{t.footer.powered}</div>
        </div>
      </div>

      {/* JSON-LD Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoRepair",
            name: "APEX Auto Studio Jeddah",
            image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
            "@id": "https://apexstudio.sa",
            url: "https://apexstudio.sa",
            telephone: "+966504821990",
            address: {
              "@type": "PostalAddress",
              streetAddress: "King Abdulaziz Road, Al-Shati",
              addressLocality: "Jeddah",
              postalCode: "23511",
              addressCountry: "SA",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 21.6053,
              longitude: 39.1234,
            },
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
              opens: "09:00",
              closes: "22:30",
            },
            priceRange: "$$$$",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.95",
              reviewCount: "620",
            },
          }),
        }}
      />
    </footer>
  );
};
