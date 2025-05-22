// src/app/components/Header.tsx
"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <nav className="flex gap-6 text-gray-300 font-medium">
        {[
          { href: "/", label: "Home" },
          { href: "/topic", label: "Topic" },
          { href: "/notes", label: "Notes" },
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
