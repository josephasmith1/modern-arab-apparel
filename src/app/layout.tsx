import type { Metadata } from "next";
import { Geist, Geist_Mono, My_Soul, WindSong, Playfair_Display, Barlow_Condensed, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { bodoni } from "./fonts/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mySoul = My_Soul({
  variable: "--font-my-soul",
  subsets: ["latin"],
  weight: "400",
});

const windSong = WindSong({
  variable: "--font-wind-song",
  subsets: ["latin"],
  weight: "400",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Modern Arab Apparel",
  description: "High-quality, modern apparel with cultural heritage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mySoul.variable} ${windSong.variable} ${playfairDisplay.variable} ${barlowCondensed.variable} ${notoNaskhArabic.variable} ${bodoni.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
