"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  // Sync dark mode state with localStorage & html class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setIsDark(true);
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-lg sticky top-0 z-50 border-b border-gray-700 bg-gray-900 dark:bg-black">
      <nav className="flex gap-6 text-gray-300 font-medium">
        {[
          { href: "/", label: "Home" },
          { href: "/topic", label: "Topic" },
          { href: "/notes", label: "Notes" },
          { href: "/roadmaps", label: "Roadmaps" },
          { href: "/profile", label: "Profile" },
          { href: "/about", label: "About" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="relative group px-2 py-1 rounded-md hover:text-blue-400"
          >
            {label}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle Dark Mode"
          className="bg-gray-700 dark:bg-gray-300 text-white dark:text-black rounded px-3 py-1 font-semibold hover:bg-gray-600 dark:hover:bg-gray-400 transition"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-10 h-10 rounded-full border border-gray-600",
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <Link
            href="/signin"
            className="text-blue-400 font-semibold hover:text-blue-600 transition"
          >
            Sign In
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}
