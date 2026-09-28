"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ServicesSection } from "@/components/ServicesSection";
import { PackagesSection } from "@/components/PackagesSection";
import { PackageBuilder } from "@/components/PackageBuilder";
import { WhyUsSection } from "@/components/WhyUsSection";
import { LiveVehicleTracker } from "@/components/LiveVehicleTracker";
import { OffersSection } from "@/components/OffersSection";
import { GallerySection } from "@/components/GallerySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { BookingFlowModal } from "@/components/BookingFlowModal";
import { AICarAdvisorModal } from "@/components/AICarAdvisorModal";
import { CustomerPortalModal } from "@/components/CustomerPortalModal";
import { AdminDashboardModal } from "@/components/AdminDashboardModal";
import { CustomerCar } from "@/lib/types";

export default function Home() {
  // Modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<{
    serviceId?: string;
    packageId?: string;
    car?: CustomerCar;
    totalAmount?: number;
  }>({});

  const [advisorModalOpen, setAdvisorModalOpen] = useState(false);
  const [portalModalOpen, setPortalModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [trackerTargetId, setTrackerTargetId] = useState<string>("APX-8941");

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenBooking = (prefill?: {
    serviceId?: string;
    packageId?: string;
    car?: CustomerCar;
    totalAmount?: number;
  }) => {
    setBookingPrefill(prefill || {});
    setBookingModalOpen(true);
  };

  const handleOpenTracker = (bookingId?: string) => {
    if (bookingId) {
      setTrackerTargetId(bookingId);
    }
    scrollToSection("tracker-section");
  };

  return (
    <main className="min-h-screen bg-carbon-950 text-foreground relative selection:bg-cyan-glow selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdvisor={() => setAdvisorModalOpen(true)}
        onOpenTracker={() => handleOpenTracker()}
        onOpenPortal={() => setPortalModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onScrollTo={scrollToSection}
      />

      {/* 1. Hero Section & Social Proof */}
      <HeroSection
        onOpenBooking={() => handleOpenBooking()}
        onScrollTo={scrollToSection}
      />

      {/* 2. Before / After Interactive Comparison Slider */}
      <BeforeAfterSlider onBookService={(slug) => handleOpenBooking()} />

      {/* 3. Comprehensive Services Grid */}
      <ServicesSection
        onBookService={(serviceId) => handleOpenBooking({ serviceId })}
      />

      {/* 4. Complete Packages Section */}
      <PackagesSection
        onBookPackage={(packageId) => handleOpenBooking({ packageId })}
      />

      {/* 5. Interactive "Build Your Package" (صمم باقتك) */}
      <PackageBuilder
        onProceedToBooking={(data) =>
          handleOpenBooking({
            car: data.car,
            totalAmount: data.totalAmount,
          })
        }
      />

      {/* 6. Why Us / The APEX Standard */}
      <WhyUsSection />

      {/* 7. Live Vehicle Workshop Tracker */}
      <LiveVehicleTracker
        initialBookingId={trackerTargetId}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* 8. Exclusive Seasonal Offers with Countdown */}
      <OffersSection
        onClaimOffer={(packageId) => handleOpenBooking({ packageId })}
      />

      {/* 9. Showcase & Portfolio Gallery */}
      <GallerySection />

      {/* 10. Client Testimonials */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer
        onScrollTo={scrollToSection}
        onOpenBooking={() => handleOpenBooking()}
        onOpenTracker={() => handleOpenTracker()}
        onOpenAdvisor={() => setAdvisorModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Smart Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Modals */}
      <BookingFlowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        prefill={bookingPrefill}
        onOpenTrackerWithId={(id) => {
          handleOpenTracker(id);
        }}
      />

      <AICarAdvisorModal
        isOpen={advisorModalOpen}
        onClose={() => setAdvisorModalOpen(false)}
        onBookRecommendation={(rec) => {
          handleOpenBooking(rec);
        }}
      />

      <CustomerPortalModal
        isOpen={portalModalOpen}
        onClose={() => setPortalModalOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
        onTrackBooking={(id) => {
          handleOpenTracker(id);
        }}
      />

      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onViewBookingInTracker={(id) => {
          handleOpenTracker(id);
        }}
      />
    </main>
  );
}
