// src/app/about/page.tsx
import { FiMap, FiUser, FiBookOpen } from "react-icons/fi";

export default function AboutPage() {
  return (
    <main className="p-8 max-w-5xl mx-auto text-gray-200">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-blue-400 mb-8">
          About <span className="text-white">AI Knowledge Hub</span>
        </h1>
        <p className="mb-6 leading-relaxed text-gray-300 max-w-3xl">
          The{" "}
          <span className="text-blue-300 font-medium">AI Knowledge Hub</span> is
          your personalized learning assistant for diving into the world of
          Artificial Intelligence. Whether you're a beginner or looking to
          deepen your knowledge, this platform generates AI-curated roadmaps to
          guide your learning journey.
        </p>
        <p className="mb-6 leading-relaxed text-gray-300 max-w-3xl">
          Built with <span className="text-white font-semibold">Next.js</span>,{" "}
          <span className="text-white font-semibold">Clerk</span> for
          authentication, and{" "}
          <span className="text-white font-semibold">Tailwind CSS</span> for
          design, the app helps you learn AI in a structured and engaging way.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700 hover:shadow-xl transition-shadow cursor-default flex flex-col items-start gap-4">
          <FiMap className="text-blue-400 w-10 h-10" />
          <h2 className="text-xl font-semibold text-blue-400">
            Personalized Roadmaps
          </h2>
          <p className="text-gray-300 leading-relaxed">
            AI-curated learning paths tailored to your interests and skill
            level, helping you progress efficiently.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700 hover:shadow-xl transition-shadow cursor-default flex flex-col items-start gap-4">
          <FiUser className="text-blue-400 w-10 h-10" />
          <h2 className="text-xl font-semibold text-blue-400">
            Authentication & Profiles
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Secure login and personalized user profiles with Clerk integration
            for a smooth user experience.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700 hover:shadow-xl transition-shadow cursor-default flex flex-col items-start gap-4">
          <FiBookOpen className="text-blue-400 w-10 h-10" />
          <h2 className="text-xl font-semibold text-blue-400">
            Interactive Learning
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Explore notes, topics, and curated video suggestions all in one
            place to deepen your AI knowledge.
          </p>
        </div>
      </section>

      <section className="mt-12 text-gray-400 italic text-center">
        Stay curious, explore more, and let AI guide your way to expertise. 🚀
      </section>
    </main>
  );
}
