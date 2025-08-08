import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

// Setup the Inter font for the body text
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

// Setup the Orbitron font for headings
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: "FAQ - SCOPE",
  description: "Frequently Asked Questions and contact form for SCOPE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} font-sans`}>{children}</body>
    </html>
  );
}
