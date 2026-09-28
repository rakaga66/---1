"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useLanguage } from "@/lib/language-context";
import { ApexStore } from "@/lib/store";
import {
  CustomerUser,
  CustomerCar,
  VehicleSize,
  WarrantyCertificate,
  BookingRecord,
} from "@/lib/types";
import { initialLoyaltyRewards } from "@/lib/data";
import {
  User,
  X,
  Car,
  ShieldCheck,
  Award,
  FileText,
  Plus,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onTrackBooking: (id: string) => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onTrackBooking,
}) => {
  const { t, language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<"garage" | "bookings" | "warranties" | "loyalty">(
    "garage"
  );

  const [customer, setCustomer] = useState<CustomerUser>(ApexStore.getActiveCustomer());
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [warranties, setWarranties] = useState<WarrantyCertificate[]>([]);

  // Add Car Dialog State
  const [showAddCar, setShowAddCar] = useState(false);
  const [newMake, setNewMake] = useState("Mercedes-Benz");
  const [newModel, setNewModel] = useState("E300 AMG Line");
  const [newYear, setNewYear] = useState(2025);
  const [newPlate, setNewPlate] = useState("ط ل ق 300");
  const [newSize, setNewSize] = useState<VehicleSize>("sedan");

  // Certificate Modal State
  const [viewingCertificate, setViewingCertificate] = useState<WarrantyCertificate | null>(null);

  const refreshData = () => {
    const cust = ApexStore.getActiveCustomer();
    setCustomer(cust);
    const allBookings = ApexStore.getBookings();
    setBookings(allBookings.filter((b) => b.customerPhone === cust.phone || b.customerName === cust.name));
    const allWarranties = ApexStore.getWarranties();
    setWarranties(allWarranties.filter((w) => w.customerPhone === cust.phone || w.customerName === cust.name));
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddNewCar = (e: React.FormEvent) => {
    e.preventDefault();
    ApexStore.addCarToGarage(customer.id, {
      make: newMake,
      model: newModel,
      year: newYear,
      plate: newPlate,
      color: "Standard",
      sizeCategory: newSize,
    });
    setShowAddCar(false);
    refreshData();
  };

  const handleRedeem = (pointsCost: number) => {
    const success = ApexStore.redeemReward(customer.id, pointsCost);
    if (success) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
      refreshData();
    } else {
      alert(language === "ar" ? "رصيد النقاط غير كافٍ" : "Insufficient points");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-carbon-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Portal Header */}
        <div className="p-5 sm:p-6 bg-carbon-950 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-glow/15 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow font-bold text-lg font-sans">
              {customer.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold text-white">{customer.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">
                  {customer.tier}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">{customer.phone}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-carbon-800 text-gray-400 hover:text-white hover:bg-carbon-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loyalty Quick Stats Strip */}
        <div className="p-4 bg-carbon-850 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-gray-400 block text-[11px]">{t.portal.points}</span>
              <span className="text-base font-black text-amber-400 font-sans">
                {customer.points.toLocaleString()} PTS
              </span>
            </div>
          </div>

          {/* Progress Bar towards Next Tier */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>{language === "ar" ? "التقدم نحو المكافأة التالية" : "Progress to Next Reward"}</span>
              <span className="font-bold text-cyan-glow">
                {Math.min(100, Math.round((customer.points / 3000) * 100))}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-carbon-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-glow to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (customer.points / 3000) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-300">
            <div>
              <span className="text-gray-400 block text-[10px]">{language === "ar" ? "إجمالي الإنفاق:" : "Lifetime Spend:"}</span>
              <span className="font-bold font-sans text-white">
                {customer.lifetimeSpend.toLocaleString()} SAR
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">{language === "ar" ? "عدد الزيارات:" : "Visits:"}</span>
              <span className="font-bold font-sans text-cyan-glow">{customer.totalVisits}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-carbon-900 px-4 gap-2 overflow-x-auto shrink-0">
          {[
            { id: "garage", label: t.portal.tabGarage, icon: Car },
            { id: "bookings", label: t.portal.tabBookings, icon: Calendar },
            { id: "warranties", label: t.portal.tabWarranties, icon: ShieldCheck },
            { id: "loyalty", label: t.portal.tabLoyalty, icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-cyan-glow text-cyan-glow"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* TAB 1: GARAGE */}
          {activeTab === "garage" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{t.portal.tabGarage}</h3>
                <button
                  onClick={() => setShowAddCar(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-glow/15 hover:bg-cyan-glow/25 text-cyan-glow border border-cyan-glow/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.portal.addCarBtn}</span>
                </button>
              </div>

              {showAddCar && (
                <form
                  onSubmit={handleAddNewCar}
                  className="p-5 rounded-2xl bg-carbon-850 border border-cyan-glow/30 space-y-4 animate-fade-in"
                >
                  <h4 className="text-xs font-bold text-cyan-glow uppercase tracking-wider">
                    {language === "ar" ? "بيانات السيارة الجديدة" : "New Vehicle Information"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-gray-400 block mb-1">{t.builder.make}</label>
                      <input
                        type="text"
                        value={newMake}
                        onChange={(e) => setNewMake(e.target.value)}
                        className="w-full bg-carbon-800 border border-white/10 rounded-lg p-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">{t.builder.model}</label>
                      <input
                        type="text"
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value)}
                        className="w-full bg-carbon-800 border border-white/10 rounded-lg p-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">{t.builder.year}</label>
                      <input
                        type="number"
                        value={newYear}
                        onChange={(e) => setNewYear(Number(e.target.value))}
                        className="w-full bg-carbon-800 border border-white/10 rounded-lg p-2.5 text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">{language === "ar" ? "رقم اللوحة" : "Plate"}</label>
                      <input
                        type="text"
                        value={newPlate}
                        onChange={(e) => setNewPlate(e.target.value)}
                        className="w-full bg-carbon-800 border border-white/10 rounded-lg p-2.5 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCar(false)}
                      className="px-4 py-2 rounded-lg bg-carbon-800 text-gray-400 hover:text-white text-xs font-bold"
                    >
                      {language === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-cyan-glow text-black text-xs font-black shadow-glow"
                    >
                      {language === "ar" ? "حفظ في الكراج" : "Save to Garage"}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customer.cars.map((car) => (
                  <div
                    key={car.id}
                    className="p-5 rounded-2xl bg-carbon-850 border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-black text-white">
                          {car.make} {car.model}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-carbon-800 text-gray-300 text-xs font-bold font-sans">
                          {car.year}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>
                          {language === "ar" ? "رقم اللوحة:" : "Plate:"}{" "}
                          <span className="text-gray-200 font-bold">{car.plate}</span>
                        </div>
                        <div>
                          {language === "ar" ? "حالة الطلاء:" : "Condition:"}{" "}
                          <span className="text-emerald-400 font-medium">{car.paintCondition || "Pristine"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenBooking();
                        }}
                        className="flex-1 py-2 rounded-xl bg-carbon-800 hover:bg-carbon-750 text-cyan-glow text-xs font-bold border border-cyan-glow/20 transition-colors"
                      >
                        {language === "ar" ? "حجز موعد لهذه السيارة" : "Book Service for Car"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS & INVOICES */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">{t.portal.tabBookings}</h3>
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 sm:p-5 rounded-2xl bg-carbon-850 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{booking.id}</span>
                          <span className="px-2 py-0.5 rounded bg-cyan-glow/15 text-cyan-glow text-[10px] font-bold">
                            {t.tracking.stages[booking.workshopStage] || booking.workshopStage}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300 font-bold mt-1">
                          {booking.car.make} {booking.car.model} ({booking.car.year})
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {booking.date} • {booking.timeSlot}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                        <div className="text-base font-black text-white font-sans text-cyan-glow">
                          {booking.totalAmount.toLocaleString()} SAR
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              onTrackBooking(booking.id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-carbon-800 hover:bg-carbon-700 text-cyan-glow border border-cyan-glow/30 text-xs font-bold"
                          >
                            {language === "ar" ? "تتبع الورشة" : "Track Workshop"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  {language === "ar" ? "لا توجد حجوزات مسجلة حالياً." : "No bookings registered yet."}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WARRANTIES */}
          {activeTab === "warranties" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">{t.portal.tabWarranties}</h3>
              {warranties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {warranties.map((war) => (
                    <div
                      key={war.id}
                      className="p-5 rounded-2xl bg-carbon-850 border border-white/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            {war.status}
                          </span>
                          <span className="text-[11px] text-gray-400 font-sans">{war.id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          {language === "ar" ? war.serviceNameAr : war.serviceNameEn}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{war.carDescription}</p>
                        <div className="text-[11px] text-gray-300 mt-3 space-y-0.5">
                          <div>
                            {language === "ar" ? "تاريخ الإصدار:" : "Issued:"}{" "}
                            <span className="text-white font-sans">{war.issueDate}</span>
                          </div>
                          <div>
                            {language === "ar" ? "صالح حتى:" : "Expires:"}{" "}
                            <span className="text-emerald-400 font-sans font-bold">{war.expiryDate}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setViewingCertificate(war)}
                        className="mt-4 py-2 px-3 rounded-xl bg-carbon-800 hover:bg-carbon-750 text-white font-bold text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-glow" />
                        <span>{t.portal.downloadWarranty}</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  {language === "ar" ? "لا توجد شهادات ضمان نشطة." : "No active warranties found."}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LOYALTY REWARDS */}
          {activeTab === "loyalty" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">{t.portal.tabLoyalty}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {language === "ar"
                    ? "اكسب 1 نقطة مقابل كل 10 ر.س تنفقها في أبيكس، واستبدلها بمكافآت حصرية."
                    : "Earn 1 point per 10 SAR spent and redeem for bespoke perks."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialLoyaltyRewards.map((reward) => {
                  const canAfford = customer.points >= reward.pointsCost;
                  return (
                    <div
                      key={reward.id}
                      className="p-5 rounded-2xl bg-carbon-850 border border-white/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-black text-amber-400 font-sans">
                            {reward.pointsCost} PTS
                          </span>
                          <span className="text-xs text-emerald-400 font-bold">
                            {language === "ar" ? `قيمة ${reward.discountSar} ر.س` : `Value ${reward.discountSar} SAR`}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          {language === "ar" ? reward.titleAr : reward.titleEn}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleRedeem(reward.pointsCost)}
                        disabled={!canAfford}
                        className={`mt-4 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          canAfford
                            ? "bg-amber-400 hover:bg-amber-300 text-black font-extrabold shadow-gold-glow"
                            : "bg-carbon-800 text-gray-500 cursor-not-allowed border border-white/5"
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>
                          {canAfford
                            ? t.portal.redeemPoints
                            : language === "ar"
                            ? "النقاط غير كافية"
                            : "Points Needed"}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Certificate Modal Viewer */}
        {viewingCertificate && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
            <div className="relative w-full max-w-2xl bg-carbon-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
              <button
                onClick={() => setViewingCertificate(null)}
                className="absolute top-4 end-4 p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                  APEX OFFICIAL DIGITAL WARRANTY CERTIFICATE
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {language === "ar"
                    ? viewingCertificate.serviceNameAr
                    : viewingCertificate.serviceNameEn}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{viewingCertificate.carDescription}</p>
              </div>

              <div className="p-4 rounded-2xl bg-carbon-900 border border-white/10 text-start space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === "ar" ? "رقم الشهادة:" : "Certificate ID:"}</span>
                  <span className="font-mono text-cyan-glow font-bold">{viewingCertificate.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === "ar" ? "كود التحقق الرقمي:" : "Verified Hash:"}</span>
                  <span className="font-mono text-gray-300">{viewingCertificate.verifiedCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === "ar" ? "مدة الضمان:" : "Duration:"}</span>
                  <span className="text-emerald-400 font-bold">
                    {viewingCertificate.warrantyYears}{" "}
                    {language === "ar" ? "سنوات رسمية شاملة" : "Years Official"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === "ar" ? "صالح حتى:" : "Expiry Date:"}</span>
                  <span className="text-white font-mono">{viewingCertificate.expiryDate}</span>
                </div>
              </div>

              <div className="text-start space-y-1.5 text-xs text-gray-400">
                <span className="font-bold text-gray-300 block">{language === "ar" ? "البنود والتغطية:" : "Coverage Terms:"}</span>
                {(language === "ar" ? viewingCertificate.termsAr : viewingCertificate.termsEn).map(
                  (t, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </div>
                  )
                )}
              </div>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-3 rounded-xl bg-cyan-glow text-black font-extrabold text-sm shadow-glow"
              >
                {language === "ar" ? "طباعة / حفظ شهادة الضمان (PDF)" : "Print / Save Warranty PDF"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
