"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { useLanguage } from "@/lib/language-context";
import { ApexStore } from "@/lib/store";
import {
  CustomerCar,
  VehicleSize,
  BookingRecord,
} from "@/lib/types";
import {
  initialServices,
  initialPackages,
  upsellCatalog,
  carBrandsList,
} from "@/lib/data";
import {
  X,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Car,
  Shield,
  MapPin,
  User,
  CreditCard,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Plus,
  Share2,
} from "lucide-react";

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: {
    serviceId?: string;
    packageId?: string;
    car?: CustomerCar;
    totalAmount?: number;
  };
  onOpenTrackerWithId: (bookingId: string) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  prefill,
  onOpenTrackerWithId,
}) => {
  const { t, language, isRTL } = useLanguage();
  const ArrowNext = isRTL ? ArrowLeft : ArrowRight;
  const ArrowPrev = isRTL ? ArrowRight : ArrowLeft;

  // Active step (1 to 8)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Active customer from store
  const activeCustomer = ApexStore.getActiveCustomer();

  // Step 1: Car State
  const [selectedCarSource, setSelectedCarSource] = useState<"garage" | "new">("new");
  const [selectedGarageCarId, setSelectedGarageCarId] = useState<string>(
    activeCustomer?.cars[0]?.id || ""
  );
  const [carMake, setCarMake] = useState<string>("Porsche");
  const [carModel, setCarModel] = useState<string>("911 GT3 RS");
  const [carYear, setCarYear] = useState<number>(2025);
  const [carPlate, setCarPlate] = useState<string>("أ ب ج 911");
  const [carSize, setCarSize] = useState<VehicleSize>("coupe");

  // Step 2 & 3: Service / Package Selection
  const [bookingType, setBookingType] = useState<"package" | "services">("package");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("pkg-gold");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(["serv-ppf-front"]);

  // Step 4: Upsells
  const [selectedUpsellIds, setSelectedUpsellIds] = useState<string[]>(["up-calipers"]);

  // Step 5: Branch
  const [selectedBranch, setSelectedBranch] = useState<"jeddah-malik" | "jeddah-rawdah">(
    "jeddah-malik"
  );

  // Step 6: Date & Time
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-29");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:30 AM");

  // Step 7: Customer Info
  const [customerName, setCustomerName] = useState<string>(activeCustomer?.name || "سعود بن فهد");
  const [customerPhone, setCustomerPhone] = useState<string>(
    activeCustomer?.phone || "+966504821990"
  );
  const [customerEmail, setCustomerEmail] = useState<string>(
    activeCustomer?.email || "saud.f@apexclient.sa"
  );
  const [customerNotes, setCustomerNotes] = useState<string>("");

  // Step 8: Payment Mode
  const [paymentOption, setPaymentOption] = useState<"full" | "deposit" | "branch">("deposit");

  // Confirmation Success state
  const [createdBooking, setCreatedBooking] = useState<BookingRecord | null>(null);

  // Apply prefill if passed
  useEffect(() => {
    if (prefill) {
      if (prefill.car) {
        setCarMake(prefill.car.make);
        setCarModel(prefill.car.model);
        setCarYear(prefill.car.year);
        setCarPlate(prefill.car.plate);
        setCarSize(prefill.car.sizeCategory);
      }
      if (prefill.packageId) {
        setBookingType("package");
        setSelectedPackageId(prefill.packageId);
      } else if (prefill.serviceId) {
        setBookingType("services");
        setSelectedServiceIds([prefill.serviceId]);
      }
    }
  }, [prefill]);

  // Derived effective vehicle
  const currentVehicle: CustomerCar = useMemo(() => {
    if (selectedCarSource === "garage" && activeCustomer?.cars) {
      const found = activeCustomer.cars.find((c) => c.id === selectedGarageCarId);
      if (found) return found;
    }
    return {
      id: `car-temp-${Date.now()}`,
      make: carMake,
      model: carModel,
      year: carYear,
      plate: carPlate || "أ ب ج 911",
      color: "Standard",
      sizeCategory: carSize,
    };
  }, [
    selectedCarSource,
    selectedGarageCarId,
    activeCustomer,
    carMake,
    carModel,
    carYear,
    carPlate,
    carSize,
  ]);

  // Calculation Engine for Booking Total
  const { totalAmount, depositAmount, executionTimeLabel } = useMemo(() => {
    let base = 0;
    let duration = "24-48 ساعة";

    if (bookingType === "package") {
      const pkg = initialPackages.find((p) => p.id === selectedPackageId);
      if (pkg) {
        base = Math.round(pkg.basePrice * (pkg.priceMultipliers[currentVehicle.sizeCategory] || 1));
        duration = language === "ar" ? pkg.durationAr : pkg.durationEn;
      }
    } else {
      selectedServiceIds.forEach((sId) => {
        const serv = initialServices.find((s) => s.id === sId);
        if (serv) {
          base += Math.round(
            serv.basePrice * (serv.priceMultipliers[currentVehicle.sizeCategory] || 1)
          );
        }
      });
      duration = "1 - 2 أيام عمل";
    }

    // Add upsells
    selectedUpsellIds.forEach((uId) => {
      const up = upsellCatalog.find((u) => u.id === uId);
      if (up) base += up.price;
    });

    // Discount if full payment
    const finalTotal = paymentOption === "full" ? Math.round(base * 0.95) : base;
    const deposit = 300;

    return {
      totalAmount: finalTotal,
      depositAmount: deposit,
      executionTimeLabel: duration,
    };
  }, [
    bookingType,
    selectedPackageId,
    selectedServiceIds,
    selectedUpsellIds,
    currentVehicle.sizeCategory,
    paymentOption,
    language,
  ]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleToggleUpsell = (id: string) => {
    setSelectedUpsellIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinalSubmit = () => {
    const paymentMethodMap = {
      full: "ApplePay" as const,
      deposit: "Mada" as const,
      branch: "PayAtBranch" as const,
    };

    const paymentStatusMap = {
      full: "FullyPaid" as const,
      deposit: "DepositPaid" as const,
      branch: "Pending" as const,
    };

    const newRecord = ApexStore.createBooking({
      customerName,
      customerPhone,
      customerEmail,
      car: currentVehicle,
      branchId: selectedBranch,
      packageId: bookingType === "package" ? selectedPackageId : undefined,
      serviceIds: bookingType === "services" ? selectedServiceIds : [],
      upsellIds: selectedUpsellIds,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      totalAmount,
      depositPaid: paymentOption === "deposit" ? 300 : paymentOption === "full" ? totalAmount : 0,
      paymentMethod: paymentMethodMap[paymentOption],
      paymentStatus: paymentStatusMap[paymentOption],
      bookingStatus: "Confirmed",
      workshopStage: "Waiting",
      technicianName: "كابتن زياد العمري (كبير الفنيين)",
      technicianNotes: customerNotes || "تم تأكيد الحجز وإدراجه في جدول ورشة أبيكس.",
      estimatedCompletion: `${selectedDate} - 06:00 PM`,
    });

    setCreatedBooking(newRecord);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00F0FF", "#3B82F6", "#F59E0B", "#10B981"],
      });
    } catch {
      // ignore
    }
  };

  // Generate .ics calendar file download
  const handleDownloadCalendar = () => {
    if (!createdBooking) return;
    const title = `APEX Detailing Service - ${createdBooking.car.make} ${createdBooking.car.model}`;
    const desc = `Booking Ref: ${createdBooking.id}\\nBranch: ${
      createdBooking.branchId === "jeddah-malik" ? "King Abdulaziz Rd - Al Shati" : "Al Rawdah"
    }\\nTotal: ${createdBooking.totalAmount} SAR`;
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//APEX Studio Jeddah//Booking//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:APEX Auto Studio, Jeddah, Saudi Arabia`,
      `DTSTART:${createdBooking.date.replace(/-/g, "")}T073000Z`,
      `DTEND:${createdBooking.date.replace(/-/g, "")}T160000Z`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `APEX-Booking-${createdBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp Pre-filled link generator
  const getWhatsAppBookingLink = () => {
    if (!createdBooking) return "#";
    const carText = `${createdBooking.car.make} ${createdBooking.car.model} ${createdBooking.car.year}`;
    const branchText =
      createdBooking.branchId === "jeddah-malik"
        ? "فرع طريق الملك - حي الشاطئ"
        : "فرع حي الروضة";
    const msg = `مرحبًا، قمت بحجز موعد في أبيكس ستوديو.\nرقم الحجز: ${createdBooking.id}\nالسيارة: ${carText}\nالتاريخ: ${createdBooking.date} (${createdBooking.timeSlot})\nالفرع: ${branchText}\nالمبلغ المتوقع: ${createdBooking.totalAmount} ريال.\nأرجو التأكيد من فريق خدمة العملاء.`;
    return `https://wa.me/966504821990?text=${encodeURIComponent(msg)}`;
  };

  const availableDates = [
    { date: "2026-09-29", labelAr: "غداً (الثلاثاء)", labelEn: "Tomorrow (Tue)" },
    { date: "2026-09-30", labelAr: "الأربعاء 30 سبتمبر", labelEn: "Wed 30 Sep" },
    { date: "2026-10-01", labelAr: "الخميس 1 أكتوبر", labelEn: "Thu 1 Oct" },
    { date: "2026-10-03", labelAr: "السبت 3 أكتوبر", labelEn: "Sat 3 Oct" },
    { date: "2026-10-04", labelAr: "الأحد 4 أكتوبر", labelEn: "Sun 4 Oct" },
  ];

  const availableTimeSlots = [
    "09:30 AM",
    "10:30 AM",
    "12:00 PM",
    "02:30 PM",
    "04:30 PM",
    "07:00 PM",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-carbon-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 bg-carbon-950 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-glow/15 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {t.booking.modalTitle}
              </h2>
              <p className="text-[11px] text-gray-400">
                {createdBooking
                  ? (language === "ar" ? "اكتمل الحجز" : "Booking Completed")
                  : (language === "ar"
                    ? `الخطوة ${currentStep} من 8`
                    : `Step ${currentStep} of 8`)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-carbon-800 text-gray-400 hover:text-white hover:bg-carbon-700 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar (Only shown before completion) */}
        {!createdBooking && (
          <div className="w-full bg-carbon-850 px-4 py-2 border-b border-white/5 overflow-x-auto shrink-0">
            <div className="flex items-center justify-between min-w-[500px] text-[11px] font-semibold text-gray-400">
              {[
                { s: 1, label: t.booking.step1 },
                { s: 2, label: t.booking.step2 },
                { s: 3, label: t.booking.step3 },
                { s: 4, label: t.booking.step4 },
                { s: 5, label: t.booking.step5 },
                { s: 6, label: t.booking.step6 },
                { s: 7, label: t.booking.step7 },
                { s: 8, label: t.booking.step8 },
              ].map((step) => (
                <div
                  key={step.s}
                  className={`flex items-center gap-1.5 ${
                    currentStep === step.s
                      ? "text-cyan-glow font-bold"
                      : currentStep > step.s
                      ? "text-gray-200"
                      : "text-gray-400"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      currentStep === step.s
                        ? "bg-cyan-glow text-black font-black"
                        : currentStep > step.s
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-carbon-800 text-gray-300"
                    }`}
                  >
                    {step.s}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-sm flex-1">
          {/* ================= SUCCESS CONFIRMATION SCREEN ================= */}
          {createdBooking ? (
            <div className="text-center py-6 space-y-6 animate-fade-in max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-cyan-glow uppercase tracking-wider block mb-1">
                  APEX VIP RESERVATION
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {t.booking.successTitle}
                </h3>
                <div className="mt-4 p-4 rounded-2xl bg-carbon-800/90 border border-white/10 inline-block">
                  <div className="text-xs text-gray-400">{t.booking.successSub}</div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-glow font-sans mt-0.5 tracking-wider">
                    {createdBooking.id}
                  </div>
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-carbon-850 border border-white/10 text-start space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">{language === "ar" ? "السيارة:" : "Vehicle:"}</span>
                  <span className="font-bold text-white">
                    {createdBooking.car.make} {createdBooking.car.model} ({createdBooking.car.year})
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">{language === "ar" ? "الموعد:" : "Appointment:"}</span>
                  <span className="font-bold text-white">
                    {createdBooking.date} - {createdBooking.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">{language === "ar" ? "الفرع:" : "Branch:"}</span>
                  <span className="font-bold text-white">
                    {createdBooking.branchId === "jeddah-malik"
                      ? "طريق الملك عبدالعزيز - حي الشاطئ"
                      : "حي الروضة - شارع الأمير سلطان"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300 border-t border-white/5 pt-2">
                  <span className="text-gray-400">{language === "ar" ? "المبلغ الإجمالي:" : "Total Amount:"}</span>
                  <span className="font-black text-white font-sans text-cyan-glow">
                    {createdBooking.totalAmount.toLocaleString()} {t.services.sar}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* 1. WhatsApp Instant Confirmation */}
                <a
                  href={getWhatsAppBookingLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{t.booking.openWhatsapp}</span>
                </a>

                {/* 2. Add to Calendar */}
                <button
                  onClick={handleDownloadCalendar}
                  className="w-full py-3 px-4 rounded-xl bg-carbon-800 hover:bg-carbon-750 text-white font-bold border border-white/10 flex items-center justify-center gap-2 transition-colors"
                >
                  <CalendarIcon className="w-4 h-4 text-cyan-glow" />
                  <span>{t.booking.addToCalendar}</span>
                </button>

                {/* 3. Live Tracking */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenTrackerWithId(createdBooking.id);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-carbon-850 hover:bg-carbon-800 text-cyan-glow font-bold border border-cyan-glow/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>{t.booking.trackLive}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ================= STEP 1: CAR ================= */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-cyan-glow" />
                    <span>{t.booking.step1}</span>
                  </h3>

                  {/* Toggle Garage vs New Car */}
                  {activeCustomer?.cars && activeCustomer.cars.length > 0 && (
                    <div className="flex rounded-xl bg-carbon-850 p-1 border border-white/10">
                      <button
                        onClick={() => setSelectedCarSource("garage")}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          selectedCarSource === "garage"
                            ? "bg-cyan-glow text-black shadow-glow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {language === "ar" ? "اختر من كراجي المحفوظ" : "Select from My Garage"}
                      </button>
                      <button
                        onClick={() => setSelectedCarSource("new")}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          selectedCarSource === "new"
                            ? "bg-cyan-glow text-black shadow-glow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {t.booking.addNewCar}
                      </button>
                    </div>
                  )}

                  {selectedCarSource === "garage" && activeCustomer?.cars ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeCustomer.cars.map((car) => (
                        <div
                          key={car.id}
                          onClick={() => setSelectedGarageCarId(car.id)}
                          className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                            selectedGarageCarId === car.id
                              ? "bg-cyan-950/40 border-cyan-glow shadow-glow"
                              : "bg-carbon-800 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="text-base font-bold text-white">
                            {car.make} {car.model}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {car.year} • {car.plate}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">
                          {t.builder.make}
                        </label>
                        <select
                          value={carMake}
                          onChange={(e) => {
                            setCarMake(e.target.value);
                            const found = carBrandsList.find((b) => b.make === e.target.value);
                            if (found) setCarModel(found.models[0]);
                          }}
                          className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-cyan-glow focus:outline-none"
                        >
                          {carBrandsList.map((b) => (
                            <option key={b.make} value={b.make}>
                              {b.make}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">
                          {t.builder.model}
                        </label>
                        <input
                          type="text"
                          value={carModel}
                          onChange={(e) => setCarModel(e.target.value)}
                          placeholder="911 GT3 / G63 / Patrol"
                          className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-cyan-glow focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">
                          {t.builder.year}
                        </label>
                        <select
                          value={carYear}
                          onChange={(e) => setCarYear(Number(e.target.value))}
                          className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-cyan-glow focus:outline-none font-sans"
                        >
                          {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">
                          {language === "ar" ? "رقم اللوحة" : "Plate Number"}
                        </label>
                        <input
                          type="text"
                          value={carPlate}
                          onChange={(e) => setCarPlate(e.target.value)}
                          placeholder="أ ب ج 123"
                          className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-cyan-glow focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">
                          {t.builder.size}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {(
                            [
                              { id: "coupe", label: "كوبيه" },
                              { id: "sedan", label: "سيدان" },
                              { id: "midSuv", label: "كروس أوفر" },
                              { id: "largeSuv", label: "جيب عائلي" },
                              { id: "exotic", label: "سوبركار" },
                            ] as const
                          ).map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setCarSize(s.id)}
                              className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                                carSize === s.id
                                  ? "bg-cyan-glow text-black font-extrabold shadow-glow"
                                  : "bg-carbon-800 text-gray-300 hover:bg-carbon-700"
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= STEP 2: SERVICE / PACKAGE ================= */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-glow" />
                      <span>{t.booking.step2}</span>
                    </h3>

                    {/* Mode Toggle */}
                    <div className="flex rounded-lg bg-carbon-850 p-1 border border-white/10 text-xs">
                      <button
                        onClick={() => setBookingType("package")}
                        className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                          bookingType === "package"
                            ? "bg-cyan-glow text-black shadow-glow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {language === "ar" ? "باقة متكاملة" : "Complete Bundle"}
                      </button>
                      <button
                        onClick={() => setBookingType("services")}
                        className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                          bookingType === "services"
                            ? "bg-cyan-glow text-black shadow-glow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {language === "ar" ? "خدمات فردية" : "Individual Services"}
                      </button>
                    </div>
                  </div>

                  {bookingType === "package" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {initialPackages.map((pkg) => {
                        const price = Math.round(
                          pkg.basePrice * (pkg.priceMultipliers[currentVehicle.sizeCategory] || 1)
                        );
                        const isSelected = selectedPackageId === pkg.id;

                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackageId(pkg.id)}
                            className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                              isSelected
                                ? "bg-cyan-950/40 border-cyan-glow shadow-glow"
                                : "bg-carbon-800 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-white">
                                {language === "ar" ? pkg.nameAr : pkg.nameEn}
                              </span>
                              <span className="text-sm font-black text-cyan-glow font-sans">
                                {price.toLocaleString()} {t.services.sar}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {language === "ar" ? pkg.taglineAr : pkg.taglineEn}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {initialServices.map((serv) => {
                        const isChecked = selectedServiceIds.includes(serv.id);
                        const price = Math.round(
                          serv.basePrice * (serv.priceMultipliers[currentVehicle.sizeCategory] || 1)
                        );

                        return (
                          <div
                            key={serv.id}
                            onClick={() => {
                              setSelectedServiceIds((prev) =>
                                isChecked ? prev.filter((id) => id !== serv.id) : [...prev, serv.id]
                              );
                            }}
                            className={`p-3.5 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${
                              isChecked
                                ? "bg-cyan-950/40 border-cyan-glow shadow-glow text-white"
                                : "bg-carbon-800 border-white/10 text-gray-300"
                            }`}
                          >
                            <span className="text-xs font-bold truncate max-w-[200px]">
                              {language === "ar" ? serv.nameAr : serv.nameEn}
                            </span>
                            <span className="text-xs font-bold font-sans">
                              {price.toLocaleString()} {t.services.sar}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ================= STEP 3: UPSELLS ================= */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-glow" />
                      <span>{t.booking.step3}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {language === "ar"
                        ? "إضافات ذكية لتعزيز الحماية بسعر خاص مع حجزك اليوم (وفر حتى 30%)"
                        : "Smart add-ons to maximize protection with exclusive bundle rates"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {upsellCatalog.map((up) => {
                      const isSelected = selectedUpsellIds.includes(up.id);
                      return (
                        <div
                          key={up.id}
                          onClick={() => handleToggleUpsell(up.id)}
                          className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-start gap-3.5 ${
                            isSelected
                              ? "bg-cyan-950/40 border-cyan-glow shadow-glow"
                              : "bg-carbon-800/80 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-cyan-glow border-cyan-glow text-black"
                                : "border-white/30 bg-carbon-900"
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-black text-cyan-glow" />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs sm:text-sm font-bold text-white">
                                {language === "ar" ? up.nameAr : up.nameEn}
                              </h4>
                              <span className="text-xs font-black text-emerald-400 font-sans">
                                +{up.price} {t.services.sar}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">
                              {language === "ar" ? up.descAr : up.descEn}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= STEP 4: BRANCH ================= */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-glow" />
                    <span>{t.booking.branchLabel}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setSelectedBranch("jeddah-malik")}
                      className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                        selectedBranch === "jeddah-malik"
                          ? "bg-cyan-950/40 border-cyan-glow shadow-glow"
                          : "bg-carbon-800 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-glow/20 text-cyan-glow text-[10px] font-black uppercase">
                          Flagship
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {t.booking.branchMalik}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {language === "ar"
                          ? "مجهز بغرف عزل نظيفة Clean-Rooms وكبائن تلميع بتقنية الإضاءة الطيفية."
                          : "Equipped with positive pressure clean-rooms and specialized LED lighting bays."}
                      </p>
                    </div>

                    <div
                      onClick={() => setSelectedBranch("jeddah-rawdah")}
                      className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                        selectedBranch === "jeddah-rawdah"
                          ? "bg-cyan-950/40 border-cyan-glow shadow-glow"
                          : "bg-carbon-800 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase">
                          Studio 2
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {t.booking.branchRawdah}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {language === "ar"
                          ? "موقع حيوي وسهل الوصول مع صالة استراحة VIP لانتظار العميل."
                          : "Central location with an exclusive VIP executive lounge."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 5: DATE ================= */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-cyan-glow" />
                    <span>{t.booking.step5}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {availableDates.map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDate(d.date)}
                        className={`p-4 rounded-2xl text-center border transition-all ${
                          selectedDate === d.date
                            ? "bg-cyan-glow text-black font-extrabold shadow-glow"
                            : "bg-carbon-800 text-gray-300 hover:bg-carbon-750 border-white/10"
                        }`}
                      >
                        <div className="text-sm font-bold">
                          {language === "ar" ? d.labelAr : d.labelEn}
                        </div>
                        <div className="text-xs opacity-75 mt-0.5 font-sans">{d.date}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= STEP 6: TIME ================= */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-glow" />
                    <span>{t.booking.step6}</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`p-3.5 rounded-2xl text-center font-sans text-sm font-bold border transition-all ${
                          selectedTimeSlot === time
                            ? "bg-cyan-glow text-black font-extrabold shadow-glow"
                            : "bg-carbon-800 text-gray-300 hover:bg-carbon-750 border-white/10"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= STEP 7: CUSTOMER INFO ================= */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-glow" />
                    <span>{t.booking.step7}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">
                        {t.booking.nameLabel} *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="سعود بن فهد"
                        className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-cyan-glow focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">
                        {t.booking.phoneLabel} *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+966 50 123 4567"
                        className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-cyan-glow focus:outline-none font-sans"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">
                        {t.booking.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="saud@example.com"
                        className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-cyan-glow focus:outline-none font-sans"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">
                        {t.booking.notesLabel}
                      </label>
                      <textarea
                        rows={2}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder={
                          language === "ar"
                            ? "أرغب بنقل السيارة بالسطحة VIP / التركيز على خدوش الكبوت..."
                            : "Prefer flatbed transport / Focus on hood swirls..."
                        }
                        className="w-full bg-carbon-800 border border-white/10 text-white rounded-xl p-3 text-sm focus:border-cyan-glow focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 8: PAYMENT & CONFIRMATION ================= */}
              {currentStep === 8 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-cyan-glow" />
                    <span>{t.booking.step8}</span>
                  </h3>

                  {/* Summary Recap Box */}
                  <div className="p-4 rounded-2xl bg-carbon-850 border border-white/10 text-xs sm:text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === "ar" ? "السيارة:" : "Car:"}</span>
                      <span className="text-white font-bold">
                        {currentVehicle.make} {currentVehicle.model} ({currentVehicle.year})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === "ar" ? "الموعد:" : "Date:"}</span>
                      <span className="text-white font-bold">
                        {selectedDate} • {selectedTimeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === "ar" ? "مدة التنفيذ:" : "Duration:"}</span>
                      <span className="text-white font-bold">{executionTimeLabel}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 text-sm sm:text-base">
                      <span className="text-gray-300 font-bold">{language === "ar" ? "السعر الإجمالي:" : "Total Price:"}</span>
                      <span className="text-cyan-glow font-black font-sans">
                        {totalAmount.toLocaleString()} {t.services.sar}
                      </span>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    <div
                      onClick={() => setPaymentOption("deposit")}
                      className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                        paymentOption === "deposit"
                          ? "bg-cyan-950/40 border-cyan-glow shadow-glow text-white"
                          : "bg-carbon-800 border-white/10 text-gray-300"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{t.booking.payDeposit}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {language === "ar" ? "عبر مدى أو Apple Pay" : "Via Mada or Apple Pay"}
                        </div>
                      </div>
                      <span className="text-base font-black text-cyan-glow font-sans">300 SAR</span>
                    </div>

                    <div
                      onClick={() => setPaymentOption("full")}
                      className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                        paymentOption === "full"
                          ? "bg-cyan-950/40 border-cyan-glow shadow-glow text-white"
                          : "bg-carbon-800 border-white/10 text-gray-300"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{t.booking.payFull}</div>
                        <div className="text-xs text-emerald-400 mt-0.5">
                          {language === "ar" ? "وفرت 5% إضافية!" : "Saved extra 5%!"}
                        </div>
                      </div>
                      <span className="text-base font-black text-emerald-400 font-sans">
                        {totalAmount.toLocaleString()} SAR
                      </span>
                    </div>

                    <div
                      onClick={() => setPaymentOption("branch")}
                      className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                        paymentOption === "branch"
                          ? "bg-cyan-950/40 border-cyan-glow shadow-glow text-white"
                          : "bg-carbon-800 border-white/10 text-gray-300"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{t.booking.payAtBranch}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {language === "ar" ? "نقداً أو بالبطاقة عند تسليم السيارة" : "Pay in person upon check-in"}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400">0 SAR الآن</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Sticky Bottom Controls */}
        {!createdBooking && (
          <div className="p-4 sm:p-6 bg-carbon-950 border-t border-white/10 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl bg-carbon-800 hover:bg-carbon-700 text-gray-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <ArrowPrev className="w-4 h-4" />
                <span>{t.booking.prev}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-4">
              <div className="text-end hidden sm:block">
                <span className="text-[11px] text-gray-400 block">{language === "ar" ? "السعر المتوقع:" : "Expected Price:"}</span>
                <span className="text-base font-black text-white font-sans text-cyan-glow">
                  {totalAmount.toLocaleString()} {t.services.sar}
                </span>
              </div>

              {currentStep < 8 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-glow to-blue-600 text-black font-extrabold text-xs sm:text-sm shadow-glow hover:shadow-glow-lg flex items-center gap-1.5 transition-all"
                >
                  <span>{t.booking.next}</span>
                  <ArrowNext className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-glow text-black font-black text-xs sm:text-sm shadow-glow hover:shadow-glow-lg flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.booking.confirmBooking}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
