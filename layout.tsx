import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";

export const viewport: Viewport = {
  themeColor: "#080B10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "APEX Auto Studio Jeddah | المركز الأول لحماية وعناية السيارات الفاخرة بجدة",
  description:
    "مركز العناية الفائقة وحماية السيارات بجدة. أفلام حماية PPF ذاتية المعالجة، نانو سيراميك ألماني 10H، وتصحيح طلاء احترافي بأعلى المعايير العالمية. حجز فوري وتتبع مباشر.",
  keywords: [
    "PPF جدة",
    "نانو سيراميك جدة",
    "تلميع سيارات جدة",
    "عازل حراري جدة",
    "حماية سيارات فاخرة جدة",
    "أفضل مركز عناية سيارات جدة",
    "XPEL Jeddah",
    "Gyeon Ceramic Jeddah",
  ],
  authors: [{ name: "APEX Auto Studio" }],
  openGraph: {
    title: "APEX Auto Studio Jeddah | فخامة تدوم مع حماية لا تُضاهى",
    description: "احمِ سيارتك. وخليها ترجع كأنها جديدة في أفخم استوديو عناية سيارات بجدة.",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-carbon-950 text-foreground antialiased min-h-screen selection:bg-cyan-glow selection:text-black">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
