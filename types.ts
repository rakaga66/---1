export type VehicleSize = "coupe" | "sedan" | "midSuv" | "largeSuv" | "exotic";

export type WorkshopStage =
  | "Waiting"
  | "Received"
  | "Inspection"
  | "InDecontamination"
  | "Polishing"
  | "ProtectionApplication"
  | "QualityControl"
  | "Ready"
  | "Delivered";

export interface ServiceItem {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  shortDescAr: string;
  shortDescEn: string;
  fullDescAr: string;
  fullDescEn: string;
  category: "ppf" | "ceramic" | "polishing" | "tint" | "interior" | "wheels" | "glass" | "headlight";
  basePrice: number; // for coupe/compact
  priceMultipliers: Record<VehicleSize, number>;
  durationAr: string;
  durationEn: string;
  warrantyYears: number;
  problemAr: string;
  problemEn: string;
  benefitsAr: string[];
  benefitsEn: string[];
  faqs: { qAr: string; qEn: string; aAr: string; aEn: string }[];
  image: string;
  badge?: string;
}

export interface PackageItem {
  id: string;
  tier: "basic" | "silver" | "gold" | "platinum" | "ultimate";
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  basePrice: number;
  priceMultipliers: Record<VehicleSize, number>;
  durationAr: string;
  durationEn: string;
  warrantyYears: number;
  isPopular?: boolean;
  isBestValue?: boolean;
  idealForAr: string;
  idealForEn: string;
  servicesIncludedAr: string[];
  servicesIncludedEn: string[];
  featuresAr: string[];
  featuresEn: string[];
  highlightColor: string;
}

export interface UpsellItem {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  descAr: string;
  descEn: string;
  iconName: string;
}

export interface CustomerCar {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  sizeCategory: VehicleSize;
  paintCondition?: string;
}

export interface WorkshopPhoto {
  id: string;
  stage: WorkshopStage;
  url: string;
  captionAr: string;
  captionEn: string;
  timestamp: string;
}

export interface BookingRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  car: CustomerCar;
  branchId: "jeddah-malik" | "jeddah-rawdah";
  packageId?: string;
  serviceIds: string[];
  upsellIds: string[];
  date: string;
  timeSlot: string;
  totalAmount: number;
  depositPaid: number;
  paymentMethod: "Mada" | "ApplePay" | "VisaMastercard" | "PayAtBranch";
  paymentStatus: "Pending" | "DepositPaid" | "FullyPaid" | "PaidAtBranch";
  bookingStatus: "Confirmed" | "InWorkshop" | "Completed" | "Cancelled";
  workshopStage: WorkshopStage;
  technicianName: string;
  technicianNotes: string;
  estimatedCompletion: string;
  photos: WorkshopPhoto[];
  createdAt: string;
  warrantyCertificateId?: string;
}

export interface WarrantyCertificate {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  carDescription: string;
  serviceNameAr: string;
  serviceNameEn: string;
  warrantyYears: number;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "ExpiringSoon" | "Expired";
  termsAr: string[];
  termsEn: string[];
  verifiedCode: string;
}

export interface LoyaltyReward {
  id: string;
  titleAr: string;
  titleEn: string;
  pointsCost: number;
  discountSar: number;
  rewardType: "discount" | "wash" | "upgrade" | "interior";
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: "Silver" | "Gold" | "VIP Apex";
  points: number;
  cars: CustomerCar[];
  lifetimeSpend: number;
  totalVisits: number;
  staffNotes?: string;
}
