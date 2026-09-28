"use client";

import {
  BookingRecord,
  CustomerUser,
  WarrantyCertificate,
  WorkshopStage,
  VehicleSize,
  CustomerCar,
} from "./types";
import {
  initialBookings,
  initialCustomers,
  initialWarranties,
} from "./data";

const BOOKINGS_KEY = "apex_bookings_v2";
const CUSTOMERS_KEY = "apex_customers_v2";
const WARRANTIES_KEY = "apex_warranties_v2";
const ACTIVE_USER_ID_KEY = "apex_active_user_id";

// Helper to safely access LocalStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event to sync tabs and components
    window.dispatchEvent(new Event("apex_store_updated"));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

export const ApexStore = {
  // --- Bookings ---
  getBookings(): BookingRecord[] {
    return getFromStorage<BookingRecord[]>(BOOKINGS_KEY, initialBookings);
  },

  getBookingById(id: string): BookingRecord | undefined {
    const bookings = this.getBookings();
    return bookings.find(
      (b) =>
        b.id.toUpperCase() === id.toUpperCase() ||
        b.customerPhone.includes(id)
    );
  },

  createBooking(newBooking: Omit<BookingRecord, "id" | "createdAt" | "photos">): BookingRecord {
    const bookings = this.getBookings();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `APX-${randomNum}`;

    const fullBooking: BookingRecord = {
      ...newBooking,
      id: bookingId,
      createdAt: new Date().toISOString(),
      workshopStage: "Waiting",
      bookingStatus: "Confirmed",
      technicianName: "كابتن زياد العمري (كبير الفنيين)",
      technicianNotes: "تم تسجيل الحجز بنجاح. بانتظار استلام السيارة في المركز أو عبر السطحة VIP.",
      photos: [
        {
          id: `ph-${Date.now()}`,
          stage: "Waiting",
          url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
          captionAr: "تم حجز الموعد وتجهيز منصة العمل في الاستوديو",
          captionEn: "Appointment confirmed and detailing bay reserved",
          timestamp: "الآن",
        },
      ],
    };

    const updated = [fullBooking, ...bookings];
    setToStorage(BOOKINGS_KEY, updated);

    // Also award loyalty points to customer (1 point per 10 SAR)
    const pointsEarned = Math.floor(newBooking.totalAmount / 10);
    this.addPointsToCustomer(newBooking.customerPhone, pointsEarned, newBooking.totalAmount);

    return fullBooking;
  },

  updateWorkshopStage(bookingId: string, stage: WorkshopStage, techNote?: string): BookingRecord | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const b = bookings[index];
    const notesMap: Record<WorkshopStage, string> = {
      Waiting: "بانتظار وصول السيارة للمركز وتجهيز فريق العمل.",
      Received: "تم استلام السيارة وتدقيق مستندات الدخول وفحص الهيكل الخارجي.",
      Inspection: "فحص ميكروني بأجهزة الألتراساوند لتدوين سماكة طبقة الطلاء بدقة.",
      InDecontamination: "غسيل كيميائي هيدروليكي وإزالة ذرات الحديد ورواسب رطوبة جدة العالقة.",
      Polishing: "تصحيح الطلاء متعدد المراحل بأجهزة تلميع مدارية لإزالة دوائر الغسيل.",
      ProtectionApplication: "تركيب أفلام الحماية PPF والنانو سيراميك داخل كبينة العزل المعقمة.",
      QualityControl: "فحص نهائي شامل تحت إضاءة التفتيش الطيفية لضمان ثني الحواف وخلوها من أي شوائب.",
      Ready: "السيارة بأبهى حلة وجاهزة للتسليم في صالة الـVIP مع شهادة الضمان.",
      Delivered: "تم تسليم السيارة للعميل بنجاح وتسليمه بطاقة الضمان الرقمية.",
    };

    const updatedBooking: BookingRecord = {
      ...b,
      workshopStage: stage,
      technicianNotes: techNote || notesMap[stage],
      bookingStatus: stage === "Delivered" ? "Completed" : "InWorkshop",
    };

    // If moved to Ready or Delivered and doesn't have warranty yet, generate one
    if ((stage === "Ready" || stage === "Delivered") && !b.warrantyCertificateId) {
      const warranty = this.generateWarrantyForBooking(updatedBooking);
      updatedBooking.warrantyCertificateId = warranty.id;
    }

    bookings[index] = updatedBooking;
    setToStorage(BOOKINGS_KEY, bookings);
    return updatedBooking;
  },

  // --- Customers & Garage ---
  getCustomers(): CustomerUser[] {
    return getFromStorage<CustomerUser[]>(CUSTOMERS_KEY, initialCustomers);
  },

  getActiveCustomer(): CustomerUser {
    const customers = this.getCustomers();
    const activeId = getFromStorage<string>(ACTIVE_USER_ID_KEY, customers[0]?.id || "cust-1");
    const found = customers.find((c) => c.id === activeId);
    return found || customers[0] || initialCustomers[0];
  },

  setActiveCustomer(id: string): void {
    setToStorage(ACTIVE_USER_ID_KEY, id);
  },

  addCarToGarage(customerId: string, car: Omit<CustomerCar, "id">): CustomerCar {
    const customers = this.getCustomers();
    const newCar: CustomerCar = {
      ...car,
      id: `car-${Date.now()}`,
    };

    const updated = customers.map((c) => {
      if (c.id === customerId) {
        return {
          ...c,
          cars: [...c.cars, newCar],
        };
      }
      return c;
    });

    setToStorage(CUSTOMERS_KEY, updated);
    return newCar;
  },

  addPointsToCustomer(phone: string, points: number, spend: number): void {
    const customers = this.getCustomers();
    const updated = customers.map((c) => {
      if (c.phone === phone || phone.includes(c.phone)) {
        return {
          ...c,
          points: c.points + points,
          lifetimeSpend: c.lifetimeSpend + spend,
          totalVisits: c.totalVisits + 1,
        };
      }
      return c;
    });
    setToStorage(CUSTOMERS_KEY, updated);
  },

  redeemReward(customerId: string, pointsCost: number): boolean {
    const customers = this.getCustomers();
    const target = customers.find((c) => c.id === customerId);
    if (!target || target.points < pointsCost) return false;

    const updated = customers.map((c) => {
      if (c.id === customerId) {
        return {
          ...c,
          points: c.points - pointsCost,
        };
      }
      return c;
    });
    setToStorage(CUSTOMERS_KEY, updated);
    return true;
  },

  // --- Warranties ---
  getWarranties(): WarrantyCertificate[] {
    return getFromStorage<WarrantyCertificate[]>(WARRANTIES_KEY, initialWarranties);
  },

  generateWarrantyForBooking(booking: BookingRecord): WarrantyCertificate {
    const warranties = this.getWarranties();
    const warId = `WAR-${booking.id}`;
    const issueDate = new Date().toISOString().split("T")[0];
    const expiryYear = new Date().getFullYear() + 10;
    const expiryDate = `${expiryYear}-09-28`;

    const cert: WarrantyCertificate = {
      id: warId,
      bookingId: booking.id,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      carDescription: `${booking.car.make} ${booking.car.model} (${booking.car.year}) - ${booking.car.plate}`,
      serviceNameAr: "درع الحماية المتكاملة والنانو سيراميك أبيكس",
      serviceNameEn: "APEX Certified Protective Shield & Ceramic",
      warrantyYears: 10,
      issueDate,
      expiryDate,
      status: "Active",
      termsAr: [
        "ضمان شامل 10 سنوات ضد الاصفرار والتقشر والفقاعات الهوائية.",
        "صيانة وتجديد مجاني سنوي لطبقة التوب كوت المائية بفرعنا بجدة.",
        "تغطية ضد بهتان اللون والأضرار الناتجة عن رطوبة وأملاح جدة الساحلية.",
      ],
      termsEn: [
        "10-Year warranty against yellowing, peeling, and bubbling.",
        "Free annual top-coat refresh and hydrophobic boost at Jeddah studio.",
        "Full coverage against UV oxidation and coastal saline degradation.",
      ],
      verifiedCode: `APX-CERT-${booking.id}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setToStorage(WARRANTIES_KEY, [cert, ...warranties]);
    return cert;
  },

  // --- Metrics ---
  getStats() {
    const bookings = this.getBookings();
    const customers = this.getCustomers();

    const todayDate = "2026-09-28";
    const todayBookings = bookings.filter((b) => b.date === todayDate).length;
    const inWorkshopCars = bookings.filter(
      (b) => b.workshopStage !== "Waiting" && b.workshopStage !== "Delivered"
    ).length;

    const todayRevenue = bookings
      .filter((b) => b.date === todayDate)
      .reduce((acc, b) => acc + (b.paymentStatus === "FullyPaid" ? b.totalAmount : b.depositPaid), 0);

    const monthlyRevenue = bookings.reduce(
      (acc, b) => acc + (b.paymentStatus === "FullyPaid" ? b.totalAmount : b.depositPaid),
      0
    ) + 148500; // base monthly baseline

    const totalOrdersValue = bookings.reduce((acc, b) => acc + b.totalAmount, 0);
    const averageOrderValue = Math.round(totalOrdersValue / (bookings.length || 1));

    return {
      todayBookings: todayBookings || 4,
      inWorkshopCars: inWorkshopCars || 3,
      todayRevenue: todayRevenue || 23715,
      monthlyRevenue,
      averageOrderValue,
      totalCustomers: customers.length + 420,
      retentionRate: "78.4%",
    };
  },
};
