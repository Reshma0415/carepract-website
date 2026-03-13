import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import favIcon from "./assets/fav.ico";
import favPng from "./assets/fav.png";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CarePract | Coming Soon",
  description:
    "CarePract is preparing a refreshed experience for medical travel support. Subscribe to stay updated.",
  icons: {
    icon: [
      { url: favIcon.src, type: "image/x-icon" },
      { url: favPng.src, type: "image/png" },
    ],
    shortcut: favIcon.src,
    apple: favPng.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
