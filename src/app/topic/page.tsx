"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopicPage() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    // TODO: Replace with real roadmap creation logic & ID
    const fakeRoadmapId = "12345";
    router.push(`/roadmap/${fakeRoadmapId}`);
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enter your learning topic</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="e.g. Machine Learning, React, Rust"
          className="border p-2 rounded"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Generate Roadmap
        </button>
      </form>
    </main>
  );
}
