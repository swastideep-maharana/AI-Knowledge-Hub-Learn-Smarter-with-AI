import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId)
    return (
      <main className="p-8 text-center text-red-600 font-semibold">
        You must be signed in.
      </main>
    );

  return (
    <main className="p-12 max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Welcome to your AI Knowledge Hub 👋
      </h1>
      <p className="text-lg text-gray-700">
        Get started by entering a topic to generate your personalized learning
        roadmap.
      </p>
    </main>
  );
}
