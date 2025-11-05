import "./globals.css";
import { Orbitron, Inter, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import ConditionalNavigation from "./components/ConditionalNavigation";
import ConditionalFooter from "./components/ConditionalFooter";
import { ViewModeProvider } from "./components/ViewModeContext";
import PageTransitionWrapper from "./components/PageTransitionWrapper";
import AnalyticsTracker from "./components/AnalyticsTracker";
// import PixyDust from "./components/PixyDust"; // DISABLED: Custom cursor removed

// Load fonts
const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "600"], variable: "--font-orbitron" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dm-sans" });

// Consolidated Metadata
export const metadata: Metadata = {
  title: {
    default: "SCOPE Club",
    template: "%s | SCOPE Club"
  },
  description: "Wired for Innovation, Powered by Passion. Learn more about SCOPE and our mission, what we do, and our teams.",
  icons: {
    icon: [
      {
        url: '/images/scope_logo.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/images/scope_logo.png',
        sizes: '16x16',
        type: 'image/png',
      }
    ],
    shortcut: '/images/scope_logo.png',
    apple: {
      url: '/images/scope_logo.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
};

// Root Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/scope_logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/scope_logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/scope_logo.png" />
        <link rel="shortcut icon" href="/images/scope_logo.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#040A28] text-white font-inter">
        <ViewModeProvider>
          {/* <PixyDust /> DISABLED: Custom blue ball cursor removed */}
          <AnalyticsTracker />
          <ConditionalNavigation />
          
          {/* Page Content with Transition Wrapper */}
          <main className="flex-grow relative z-10">
            <PageTransitionWrapper>
              {children}
            </PageTransitionWrapper>
          </main>

          <ConditionalFooter />
        </ViewModeProvider>
      </body>
    </html>
  );
}