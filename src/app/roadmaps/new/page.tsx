"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRoadmapPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addFeature = () => {
    setFeatures((prev) => [...prev, ""]);
  };

  const updateFeature = (index: number, value: string) => {
    setFeatures((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          features: features.filter((f) => f.trim() !== ""),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create roadmap");
      }

      router.push("/roadmaps");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">Create New Roadmap</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-semibold mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Features</label>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-grow px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder={`Feature ${index + 1}`}
              />
              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-500 font-bold px-2 hover:text-red-700"
                  aria-label={`Remove feature ${index + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="mt-1 text-blue-400 hover:text-blue-600 font-semibold"
          >
            + Add Feature
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Roadmap"}
        </button>
      </form>
    </main>
  );
}
