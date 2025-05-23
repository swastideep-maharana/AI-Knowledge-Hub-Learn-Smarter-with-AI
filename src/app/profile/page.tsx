"use client";

import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import React from "react";

export default function ProfilePage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <p className="text-white p-8 text-center">Loading user info...</p>;
  }

  if (!isSignedIn || !user) {
    return (
      <main className="max-w-3xl mx-auto p-8 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Not signed in</h1>
        <p className="mb-6">Please sign in to view your profile.</p>
        <a
          href="/signin"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
        >
          Sign In
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">Your Profile</h1>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={user.imageUrl}
            alt="User avatar"
            className="w-24 h-24 rounded-full border border-gray-600"
          />
          <div>
            <h2 className="text-2xl font-semibold">
              {user.fullName || "Unnamed User"}
            </h2>
            <p className="text-gray-400">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">User Details</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-300">
            <li>User ID: {user.id}</li>
            <li>Username: {user.username || "N/A"}</li>
            <li>
              Created At:{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <SignOutButton>
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded text-white font-semibold">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </main>
  );
}
