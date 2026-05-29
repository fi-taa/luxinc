import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Dancing_Script,
  Encode_Sans_Semi_Expanded,
  Montserrat,
  Playfair_Display,
  Diphylleia,
  Edu_AU_VIC_WA_NT_Guides,
  Homemade_Apple
} from "next/font/google";
import { Suspense } from "react";
import { AuthQueryHandler } from "@/components/auth/auth-query-handler";
import { AuthModalProvider } from "@/components/auth/auth-modal-provider";
import { AppProviders } from "./providers";
import "./globals.css";

const verietta = localFont({
  src: [
    {
      path: "../../public/fonts/verietta/VERIETTA-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/verietta/VERIETTA.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/verietta/VERIETTA-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-verietta-src",
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const encodeSansSemiExpanded = Encode_Sans_Semi_Expanded({
  variable: "--font-encode-sans-semi-expanded",
  subsets: ["latin"],
  weight: ["400"],
});

const diphylleia = Diphylleia({
  variable: "--font-diphylleia",
  subsets: ["latin"],
  weight: ["400"],
});

const eduGuides = Edu_AU_VIC_WA_NT_Guides({
  variable: "--font-edu-guides",
  subsets: ["latin"],
  weight: ["400"],
});

const homemadeApple = Homemade_Apple({
  variable: "--font-homemade-apple",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "LUXINC. | Luxury Travel Architects",
  description:
    "Time is the ultimate luxury. Luxinc architects bespoke travel memories across East Africa and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${montserrat.variable} ${playfair.variable} ${dancingScript.variable} ${verietta.variable} ${encodeSansSemiExpanded.variable} ${diphylleia.variable} ${eduGuides.variable} ${homemadeApple.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
      >
        <AppProviders>
          <AuthModalProvider>
            <Suspense fallback={null}>
              <AuthQueryHandler />
            </Suspense>
            {children}
          </AuthModalProvider>
        </AppProviders>
      </body>
    </html>
  );
}
