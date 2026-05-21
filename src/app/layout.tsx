import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Dancing_Script,
  Montserrat,
  Playfair_Display,
} from "next/font/google";
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
      className={`${montserrat.variable} ${playfair.variable} ${dancingScript.variable} ${verietta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
