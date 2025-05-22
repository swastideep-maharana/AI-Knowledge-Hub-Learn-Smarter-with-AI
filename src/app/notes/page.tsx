// src/app/notes/page.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientNotesPage from "./ClientNotesPage";

export default async function NotesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/signin");
  }

  return <ClientNotesPage />;
}
