import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/signin");
  }

  return (
    <main className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p>Manage your profile settings and preferences here.</p>
    </main>
  );
}
