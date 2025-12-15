import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import OfflineBanner from "@/components/offline-banner";
import Navigation from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AquaGuard - Somaliland Water Intelligence",
  description:
    "Community-driven water source monitoring and drought early warning system.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OfflineBanner />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
