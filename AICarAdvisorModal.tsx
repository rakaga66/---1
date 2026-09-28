"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import {
  Bot,
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  UploadCloud,
  Shield,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface AICarAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookRecommendation: (rec: { packageId?: string; serviceId?: string }) => void;
}

export const AICarAdvisorModal: React.FC<AICarAdvisorModalProps> = ({
  isOpen,
  onClose,
  onBookRecommendation,
}) => {
  const { t, language, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [carName, setCarName] = useState("Porsche 911 / Range Rover");
  const [paintCondition, setPaintCondition] = useState<string>("swirls");
  const [parkingPlace, setParkingPlace] = useState<string>("sun");
  const [primaryGoal, setPrimaryGoal] = useState<string>("armor");
  const [budgetTier, setBudgetTier] = useState<string>("mid");
  const [uploadedPhotoPreview, setUploadedPhotoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<{
    packageId: string;
    packageNameAr: string;
    packageNameEn: string;
    servicesAr: string[];
    servicesEn: string[];
    estimatedPriceSar: number;
    durationAr: string;
    durationEn: string;
    rationaleAr: string;
    rationaleEn: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPhotoPreview(url);
    }
  };

  const handleRunDiagnosis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);

      if (budgetTier === "high" || primaryGoal === "armor") {
        setRecommendationResult({
          packageId: "pkg-gold",
          packageNameAr: "باقة درع الذهب: حماية الواجهة PPF + نانو سيراميك 10H",
          packageNameEn: "Gold Armor: Front PPF + Full 10H Ceramic",
          servicesAr: [
            "فيلم حماية PPF أمريكي ذاتي المعالجة لكامل الواجهة (الصدام، الكبوت، الرفارف، المرايا)",
            "تصحيح طلاء مرحلتين لإزالة أي دوائر غسيل سابقة",
            "4 طبقات نانو سيراميك ألماني مصلب 10H لمقاومة رطوبة وشمس جدة",
            "عازل الزجاج والجنوط مجاناً",
          ],
          servicesEn: [
            "Self-healing front PPF impact shield for high-speed highway gravel",
            "Two-stage paint correction to remove micro-swirls",
            "4 Layers German 10H diamond ceramic",
            "Complimentary glass and rim protection",
          ],
          estimatedPriceSar: 5900,
          durationAr: "2 - 3 أيام عمل",
          durationEn: "2 - 3 Business Days",
          rationaleAr:
            "بناءً على قيادتك في جدة وحالة الطلاء، الواجهة هي الأكثر عرضة لضربات الحصى وسافي الطرق السريعة. دمج الـPPF للواجهة مع السيراميك 10H لباقي الجسم يمنحك التوازن المثالي بين الحماية واللمعان بأفضل قيمة استثمارية.",
          rationaleEn:
            "Given your driving environment and paint condition, front-end PPF blocks high-speed gravel while 10H ceramic ensures effortless washing and UV resistance.",
        });
      } else if (budgetTier === "entry") {
        setRecommendationResult({
          packageId: "pkg-silver",
          packageNameAr: "باقة درع الفضة: نانو سيراميك 3 سنوات",
          packageNameEn: "Silver Shield 3-Year Nano Ceramic",
          servicesAr: [
            "تصحيح طلاء مرحلتين لإزالة 85% من الخدوش والدوائر",
            "طبقتان نانو سيراميك 9H ألماني مصلب",
            "عازل هيدروفوبيك للزجاج الأمامي",
          ],
          servicesEn: [
            "2-Stage paint correction eliminating 85% of swirls",
            "Dual-layer 9H German ceramic",
            "Windshield hydrophobic coating",
          ],
          estimatedPriceSar: 1950,
          durationAr: "24 ساعة عمل",
          durationEn: "24 Hours",
          rationaleAr:
            "خيار اقتصادي ممتاز يعيد لسيارتك لمعان الوكالة ويحميها من بهتان أشعة الشمس وتراكم الأتربة مع ضمان 3 سنوات رسمي.",
          rationaleEn:
            "Exceptional high-value solution restoring factory depth and gloss while shielding clear coat from UV fading.",
        });
      } else {
        setRecommendationResult({
          packageId: "pkg-gold",
          packageNameAr: "باقة درع الذهب المتكاملة",
          packageNameEn: "Gold Armor Package",
          servicesAr: [
            "حماية الواجهة PPF",
            "نانو سيراميك 10H شامل",
            "تلميع وتصحيح طلاء",
          ],
          servicesEn: ["Front PPF", "10H Full Ceramic", "Multi-stage Polish"],
          estimatedPriceSar: 5900,
          durationAr: "48 ساعة",
          durationEn: "48 Hours",
          rationaleAr:
            "التوصية المثالية المتوازنة لسيارات جدة لمقاومة الحرارة والأملاح والخدوش.",
          rationaleEn:
            "Ideal balanced package for Jeddah conditions to defeat coastal salt and gravel chips.",
        });
      }
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-carbon-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-carbon-950 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t.advisor.title}
              </h2>
              <p className="text-xs text-gray-400">{t.advisor.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-carbon-800 text-gray-400 hover:text-white hover:bg-carbon-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm flex-1">
          {recommendationResult ? (
            /* Result Screen */
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-base">
                    {t.advisor.resultTitle}
                  </h3>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    {t.advisor.resultSub}
                  </p>
                </div>
              </div>

              {/* Recommended Package Card */}
              <div className="glass-panel p-6 rounded-3xl border border-cyan-glow/40 shadow-glow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-xs font-bold text-cyan-glow uppercase tracking-wider block">
                      {language === "ar" ? "الحزمة الموصى بها:" : "Recommended Armor:"}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {language === "ar"
                        ? recommendationResult.packageNameAr
                        : recommendationResult.packageNameEn}
                    </h4>
                  </div>

                  <div className="text-start sm:text-end">
                    <span className="text-xs text-gray-400 block">{t.advisor.estimatedPrice}</span>
                    <span className="text-2xl font-black text-white font-sans text-cyan-glow">
                      {recommendationResult.estimatedPriceSar.toLocaleString()} {t.services.sar}
                    </span>
                  </div>
                </div>

                {/* AI Rationale */}
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 p-4 rounded-2xl bg-carbon-850/80 border border-white/5">
                  {language === "ar"
                    ? recommendationResult.rationaleAr
                    : recommendationResult.rationaleEn}
                </p>

                {/* Included Services */}
                <div className="space-y-2 mb-6">
                  {(language === "ar"
                    ? recommendationResult.servicesAr
                    : recommendationResult.servicesEn
                  ).map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-glow shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-white/10">
                  <span className="font-semibold text-white">
                    {t.advisor.duration}:{" "}
                    {language === "ar"
                      ? recommendationResult.durationAr
                      : recommendationResult.durationEn}
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-carbon-800/80 border border-white/5 text-xs text-gray-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span>{t.advisor.disclaimer}</span>
              </div>
            </div>
          ) : (
            /* Diagnostic Form Questions */
            <div className="space-y-6">
              {/* Question 1: Paint condition */}
              <div>
                <label className="block text-xs font-bold text-white mb-2.5">
                  1. {t.advisor.q1}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: "new", label: t.advisor.q1_opt1 },
                    { id: "swirls", label: t.advisor.q1_opt2 },
                    { id: "scratches", label: t.advisor.q1_opt3 },
                    { id: "sun", label: t.advisor.q1_opt4 },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaintCondition(opt.id)}
                      className={`p-3 rounded-xl text-start text-xs font-semibold border transition-all ${
                        paintCondition === opt.id
                          ? "bg-cyan-950/40 border-cyan-glow text-white shadow-glow"
                          : "bg-carbon-800 border-white/10 text-gray-300 hover:bg-carbon-750"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Parking environment */}
              <div>
                <label className="block text-xs font-bold text-white mb-2.5">
                  2. {t.advisor.q2}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "shaded", label: t.advisor.q2_opt1 },
                    { id: "sun", label: t.advisor.q2_opt2 },
                    { id: "highway", label: t.advisor.q2_opt3 },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setParkingPlace(opt.id)}
                      className={`p-3 rounded-xl text-start text-xs font-semibold border transition-all ${
                        parkingPlace === opt.id
                          ? "bg-cyan-950/40 border-cyan-glow text-white shadow-glow"
                          : "bg-carbon-800 border-white/10 text-gray-300 hover:bg-carbon-750"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Primary Objective */}
              <div>
                <label className="block text-xs font-bold text-white mb-2.5">
                  3. {t.advisor.q3}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "armor", label: t.advisor.q3_opt1 },
                    { id: "gloss", label: t.advisor.q3_opt2 },
                    { id: "full", label: t.advisor.q3_opt3 },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPrimaryGoal(opt.id)}
                      className={`p-3 rounded-xl text-start text-xs font-semibold border transition-all ${
                        primaryGoal === opt.id
                          ? "bg-cyan-glow text-black font-extrabold shadow-glow"
                          : "bg-carbon-800 border-white/10 text-gray-300 hover:bg-carbon-750"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Budget tier */}
              <div>
                <label className="block text-xs font-bold text-white mb-2.5">
                  4. {t.advisor.q4}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "entry", label: t.advisor.q4_opt1 },
                    { id: "mid", label: t.advisor.q4_opt2 },
                    { id: "high", label: t.advisor.q4_opt3 },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBudgetTier(opt.id)}
                      className={`p-3 rounded-xl text-start text-xs font-semibold border transition-all ${
                        budgetTier === opt.id
                          ? "bg-cyan-glow text-black font-extrabold shadow-glow"
                          : "bg-carbon-800 border-white/10 text-gray-300 hover:bg-carbon-750"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Photo Upload */}
              <div className="p-4 rounded-2xl bg-carbon-850 border border-white/10">
                <label className="block text-xs font-bold text-gray-300 mb-2">
                  5. {t.advisor.uploadOptional}
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-carbon-800 hover:bg-carbon-700 text-cyan-glow border border-cyan-glow/30 text-xs font-bold flex items-center gap-2 transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    <span>{language === "ar" ? "اختيار صورة للسيارة" : "Choose Vehicle Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSimulatePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadedPhotoPreview && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === "ar" ? "تم رفع الصورة وجاهزة للتحليل" : "Photo Loaded"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-6 bg-carbon-950 border-t border-white/10 flex items-center justify-between shrink-0">
          {recommendationResult ? (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setRecommendationResult(null)}
                className="px-4 py-2.5 rounded-xl bg-carbon-800 text-gray-300 font-bold text-xs"
              >
                {language === "ar" ? "إعادة الفحص" : "Retake Quiz"}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookRecommendation({
                    packageId: recommendationResult.packageId,
                  });
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-glow to-blue-600 text-black font-extrabold text-xs sm:text-sm shadow-glow hover:shadow-glow-lg flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.advisor.bookRecommended}</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={handleRunDiagnosis}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-glow text-black font-black text-sm shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isAnalyzing
                    ? language === "ar"
                      ? "جاري التحليل ومطابقة الباقة..."
                      : "Analyzing Vehicle Condition..."
                    : t.advisor.analyzeBtn}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
