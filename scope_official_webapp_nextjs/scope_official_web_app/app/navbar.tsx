"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/eventss", label: "Events" }, // ✅ fixed spelling
  { href: "/aboutus", label: "About Us" },
  { href: "/teams", label: "Team" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-[#040A28] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Logo" className="h-16 w-16" />
        </div>
        <nav className="space-x-8 text-gray-200 font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative pb-1 transition-colors duration-200 ${
                  isActive ? "text-white" : "hover:text-gray-300"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
