import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Import your global CSS file

// Initialize custom fonts with Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the page, editable as per your requirements
export const metadata: Metadata = {
  title: "Browser extension manager UI",
  description:
    "This project will be a fun way to practice working with dynamic data, filtering data, color theming, building a responsive grid, and more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Apply font variables here
      >
        {children}
      </body>
    </html>
  );
}
