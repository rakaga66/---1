"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { ApexStore } from "@/lib/store";
import { BookingRecord, CustomerUser, WorkshopStage } from "@/lib/types";
import {
  LayoutDashboard,
  Kanban,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  X,
  CheckCircle2,
  Clock,
  Car,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bot,
  Zap,
} from "lucide-react";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewBookingInTracker: (id: string) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onViewBookingInTracker,
}) => {
  const { t, language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "kanban" | "bookings" | "crm" | "automation">(
    "kanban"
  );

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [stats, setStats] = useState(ApexStore.getStats());

  const refreshAdminData = () => {
    setBookings(ApexStore.getBookings());
    setCustomers(ApexStore.getCustomers());
    setStats(ApexStore.getStats());
  };

  useEffect(() => {
    if (isOpen) {
      refreshAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const kanbanColumns: { id: WorkshopStage; titleAr: string; titleEn: string; color: string }[] = [
    { id: "Waiting", titleAr: "بانتظار الوصول", titleEn: "Waiting", color: "border-gray-500 text-gray-300" },
    { id: "Received", titleAr: "تم الاستلام", titleEn: "Received", color: "border-blue-500 text-blue-400" },
    { id: "Inspection", titleAr: "الفحص الميكروني", titleEn: "Inspection", color: "border-cyan-500 text-cyan-400" },
    { id: "Polishing", titleAr: "التلميع والتصحيح", titleEn: "Polishing", color: "border-amber-500 text-amber-400" },
    { id: "ProtectionApplication", titleAr: "تركيب الحماية والنانو", titleEn: "Protection", color: "border-purple-500 text-purple-400" },
    { id: "QualityControl", titleAr: "فحص الجودة النهائي", titleEn: "QC Check", color: "border-pink-500 text-pink-400" },
    { id: "Ready", titleAr: "جاهزة للاستلام", titleEn: "Ready", color: "border-emerald-500 text-emerald-400" },
  ];

  const handleAdvanceStage = (bookingId: string, currentStage: WorkshopStage, direction: "next" | "prev") => {
    const currentIndex = kanbanColumns.findIndex((c) => c.id === currentStage);
    if (currentIndex === -1) return;

    let targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < kanbanColumns.length) {
      const nextStage = kanbanColumns[targetIndex].id;
      ApexStore.updateWorkshopStage(bookingId, nextStage);
      refreshAdminData();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[95vh] flex flex-col bg-carbon-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-carbon-950 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-glow/15 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {t.admin.title}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  LIVE ERP
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">{t.admin.kanbanHelp}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-carbon-800 text-gray-400 hover:text-white hover:bg-carbon-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-3 bg-carbon-850 border-b border-white/5 text-center text-xs shrink-0">
          <div className="p-2 rounded-xl bg-carbon-900/60 border border-white/5">
            <span className="text-[10px] text-gray-400 block">{t.admin.statsTodayBookings}</span>
            <span className="text-base font-black text-cyan-glow font-sans mt-0.5 block">
              {stats.todayBookings}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-carbon-900/60 border border-white/5">
            <span className="text-[10px] text-gray-400 block">{t.admin.statsWorkshopCars}</span>
            <span className="text-base font-black text-amber-400 font-sans mt-0.5 block">
              {stats.inWorkshopCars}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-carbon-900/60 border border-white/5">
            <span className="text-[10px] text-gray-400 block">{t.admin.statsDailyRev}</span>
            <span className="text-base font-black text-emerald-400 font-sans mt-0.5 block">
              {stats.todayRevenue.toLocaleString()} SAR
            </span>
          </div>

          <div className="p-2 rounded-xl bg-carbon-900/60 border border-white/5">
            <span className="text-[10px] text-gray-400 block">{t.admin.statsMonthlyRev}</span>
            <span className="text-base font-black text-white font-sans mt-0.5 block">
              {stats.monthlyRevenue.toLocaleString()} SAR
            </span>
          </div>

          <div className="p-2 rounded-xl bg-carbon-900/60 border border-white/5">
            <span className="text-[10px] text-gray-400 block">{t.admin.statsAOV}</span>
            <span className="text-base font-black text-cyan-glow font-sans mt-0.5 block">
              {stats.averageOrderValue.toLocaleString()} SAR
            </span>
          </div>

          <div className="p-2 rounded-xl bg-carbon-900/60 border border-white/5">
            <span className="text-[10px] text-gray-400 block">{t.admin.statsRetention}</span>
            <span className="text-base font-black text-emerald-400 font-sans mt-0.5 block">
              {stats.retentionRate}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-carbon-900 px-4 gap-2 overflow-x-auto shrink-0">
          {[
            { id: "kanban", label: t.admin.navKanban, icon: Kanban },
            { id: "bookings", label: t.admin.navBookings, icon: Calendar },
            { id: "crm", label: t.admin.navCRM, icon: Users },
            { id: "automation", label: t.admin.navAutomation, icon: Zap },
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

        {/* Main Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: KANBAN WORKSHOP PIPELINE */}
          {activeTab === "kanban" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {language === "ar"
                    ? "انقر على الأسهم لنقل السيارة بين مراحل الورشة. يتم تحديث شاشة العميل فورياً!"
                    : "Click arrows to transition vehicle across workshop stages. Live client stream updates instantly!"}
                </span>
              </div>

              {/* Kanban Horizontal Columns Scrollable */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 overflow-x-auto pb-4">
                {kanbanColumns.map((col, colIdx) => {
                  const columnBookings = bookings.filter((b) => b.workshopStage === col.id);

                  return (
                    <div
                      key={col.id}
                      className="bg-carbon-850/80 border border-white/10 rounded-2xl p-3 flex flex-col min-w-[210px]"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                        <span className={`text-xs font-black uppercase ${col.color}`}>
                          {language === "ar" ? col.titleAr : col.titleEn}
                        </span>
                        <span className="w-5 h-5 rounded-full bg-carbon-800 text-[10px] font-bold text-white flex items-center justify-center font-sans">
                          {columnBookings.length}
                        </span>
                      </div>

                      {/* Cards list in column */}
                      <div className="space-y-2.5 flex-1">
                        {columnBookings.map((b) => (
                          <div
                            key={b.id}
                            className="p-3 rounded-xl bg-carbon-800/90 border border-white/10 hover:border-cyan-glow/40 transition-all shadow-md group"
                          >
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-bold text-cyan-glow font-sans">{b.id}</span>
                              <span className="text-[10px] text-gray-400">{b.timeSlot}</span>
                            </div>

                            <div className="text-xs font-black text-white leading-tight">
                              {b.car.make} {b.car.model}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {b.customerName} • {b.car.plate}
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                              <span className="text-xs font-black text-white font-sans text-cyan-glow">
                                {b.totalAmount.toLocaleString()} SAR
                              </span>

                              {/* Stage Transition Control Arrows */}
                              <div className="flex items-center gap-1">
                                {colIdx > 0 && (
                                  <button
                                    onClick={() => handleAdvanceStage(b.id, b.workshopStage, "prev")}
                                    className="p-1 rounded-md bg-carbon-700 hover:bg-carbon-600 text-gray-300"
                                    title="المرحلة السابقة"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                                  </button>
                                )}
                                {colIdx < kanbanColumns.length - 1 && (
                                  <button
                                    onClick={() => handleAdvanceStage(b.id, b.workshopStage, "next")}
                                    className="p-1 rounded-md bg-cyan-glow hover:bg-cyan-accent text-black font-bold"
                                    title="المرحلة التالية"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {columnBookings.length === 0 && (
                          <div className="text-center py-8 text-[11px] text-gray-600 border border-dashed border-white/5 rounded-xl">
                            {language === "ar" ? "لا توجد سيارات" : "Empty"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ALL BOOKINGS LIST */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start text-gray-300">
                  <thead className="bg-carbon-850 text-gray-400 font-bold uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-3 text-start">رقم الحجز</th>
                      <th className="p-3 text-start">العميل</th>
                      <th className="p-3 text-start">السيارة</th>
                      <th className="p-3 text-start">التاريخ والوقت</th>
                      <th className="p-3 text-start">المبلغ الإجمالي</th>
                      <th className="p-3 text-start">حالة الورشة</th>
                      <th className="p-3 text-start">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-carbon-850/50">
                        <td className="p-3 font-mono font-bold text-cyan-glow">{b.id}</td>
                        <td className="p-3 font-bold text-white">{b.customerName}</td>
                        <td className="p-3">
                          {b.car.make} {b.car.model} ({b.car.year})
                        </td>
                        <td className="p-3">
                          {b.date} • {b.timeSlot}
                        </td>
                        <td className="p-3 font-sans font-bold text-white">
                          {b.totalAmount.toLocaleString()} SAR
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-glow/30 text-cyan-glow text-[10px] font-bold">
                            {t.tracking.stages[b.workshopStage] || b.workshopStage}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              onClose();
                              onViewBookingInTracker(b.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-carbon-800 hover:bg-carbon-700 text-cyan-glow font-bold text-[11px]"
                          >
                            تتبع
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER CRM */}
          {activeTab === "crm" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((c) => (
                  <div key={c.id} className="p-5 rounded-2xl bg-carbon-850 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{c.name}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          {c.tier}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-cyan-glow font-bold">
                        {c.points} PTS
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 font-sans">{c.phone}</div>

                    <div className="p-2.5 rounded-xl bg-carbon-900 border border-white/5 text-xs text-gray-300">
                      <div className="text-gray-400 font-bold mb-1">السيارات المسجلة:</div>
                      {c.cars.map((car) => (
                        <div key={car.id} className="text-[11px] text-white">
                          • {car.make} {car.model} ({car.year})
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-gray-400 p-2.5 rounded-xl bg-carbon-900/60 border border-white/5">
                      <span className="font-bold text-gray-300 block mb-0.5">ملاحظات الفني والمركز:</span>
                      <span>{c.staffNotes || "لا توجد ملاحظات خاصة."}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SALES AUTOMATION */}
          {activeTab === "automation" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-cyan-glow font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>محرك أتمتة المبيعات والرسائل الذكية (Sales Automation Machine)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-carbon-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">نشط وتلقائي</span>
                    <span className="text-[10px] text-gray-400">Trigger: Upsell Rule</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    اقتراح النانو سيراميك عند طلب تلميع الطلاء
                  </h4>
                  <p className="text-xs text-gray-400">
                    إذا حجز العميل خدمة Polishing، يقوم النظام باقتراح حماية 10H Ceramic بخصم 15% مباشرة في شاشة الـCheckout.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-carbon-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">نشط وتلقائي</span>
                    <span className="text-[10px] text-gray-400">Trigger: 6 Months Checkup</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    تذكير الصيانة الدورية المجانية للسيراميك والـPPF
                  </h4>
                  <p className="text-xs text-gray-400">
                    إرسال رسالة واتساب آلية بعد مرور 6 أشهر من تركيب الحماية لدعوة العميل لغسيل وصيانة مجانية في فرع جدة.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
