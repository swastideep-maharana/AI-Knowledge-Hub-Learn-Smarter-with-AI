"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Roadmap {
  _id: string;
  title: string;
  description?: string;
  features: string[];
  createdAt: string;
}

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/roadmaps");
      if (!res.ok) {
        throw new Error("Failed to fetch roadmaps");
      }
      const data = await res.json();
      if (!Array.isArray(data.roadmaps)) {
        throw new Error("Unexpected response format");
      }
      setRoadmaps(data.roadmaps);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  if (loading) {
    return <p className="text-white p-8 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-8 text-center">Error: {error}</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Your Roadmaps</h1>
        <Link
          href="/roadmaps/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
        >
          + New Roadmap
        </Link>
      </div>

      {roadmaps.length === 0 ? (
        <p className="text-gray-400">No roadmaps found. Create one!</p>
      ) : (
        <ul className="space-y-4">
          {roadmaps.map((roadmap) => (
            <li
              key={roadmap._id}
              className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition cursor-pointer"
            >
              <Link href={`/roadmaps/${roadmap._id}`}>
                <h2 className="text-2xl font-semibold text-blue-400">
                  {roadmap.title}
                </h2>
                {roadmap.description && (
                  <p className="mt-1 text-gray-300">{roadmap.description}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Created on{" "}
                  {new Date(roadmap.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
