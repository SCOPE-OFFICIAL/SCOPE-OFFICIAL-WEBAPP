import "./globals.css"; // Import global styles

// Metadata for the page (important for SEO in Next.js)
export const metadata = {
  title: "SCOPE - About Us",
  description:
    "Learn more about SCOPE and our mission, what we do, and our teams.",
};

// RootLayout component wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children} {/* This is where your page.tsx content will be rendered */}
      </body>
    </html>
  );
}
