"use client";

import { useState } from "react";

interface Video {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    channelTitle: string;
  };
}

export default function TopicPage() {
  const [topic, setTopic] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setVideos([]);

    try {
      const res = await fetch(
        `/api/youtube/videos?q=${encodeURIComponent(topic)}`
      );
      if (!res.ok) throw new Error("Failed to fetch videos");

      const data = await res.json();
      setVideos(data.items);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative max-w-6xl mx-auto p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-xl min-h-[80vh]">
      {/* Background Doodles */}
      <div
        className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 opacity-20"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M40 10 Q60 40 80 10 T120 10 T160 10" strokeLinecap="round" />
          <circle cx="50" cy="50" r="30" strokeLinecap="round" />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 right-0 w-48 h-48 opacity-15"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full text-purple-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="40" />
          <line x1="10" y1="10" x2="90" y2="90" />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold mb-8 text-white text-center drop-shadow-lg">
        Enter your learning topic
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 mb-12 justify-center"
      >
        <input
          type="text"
          placeholder="e.g. Machine Learning, React, Rust"
          className="flex-grow border-2 border-blue-600 focus:ring-4 focus:ring-blue-400 focus:border-blue-400 rounded-lg px-4 py-3 text-white font-semibold placeholder-gray-500 shadow-md transition"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg px-6 py-3 shadow-lg transition disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search Videos"}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-center font-semibold mb-8">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {videos.map(({ id, snippet }) => (
          <a
            key={id.videoId}
            href={`https://www.youtube.com/watch?v=${id.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
            title={snippet.title}
          >
            <img
              src={snippet.thumbnails.medium.url}
              alt={snippet.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-white font-bold text-lg line-clamp-2">
                {snippet.title}
              </h2>
              <p className="text-blue-400 font-semibold mt-1">
                {snippet.channelTitle}
              </p>
              <p className="text-gray-300 mt-3 text-sm line-clamp-3 flex-grow">
                {snippet.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
