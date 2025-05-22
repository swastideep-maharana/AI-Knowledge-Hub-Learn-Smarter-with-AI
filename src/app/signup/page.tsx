"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
        <SignUp path="/signup" routing="path" />
      </div>
    </div>
  );
}
