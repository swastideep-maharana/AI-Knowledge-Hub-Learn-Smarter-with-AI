import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myapp");
    const notes = db.collection("notes");

    const result = await notes.insertOne({
      userId,
      content: content.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Note saved",
      noteId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("myapp");
    const notes = db.collection("notes");

    const userNotes = await notes
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ notes: userNotes });
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Note id is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myapp");
    const notes = db.collection("notes");

    // Delete note only if it belongs to the user
    const deleteResult = await notes.deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    console.error("DELETE /api/notes error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
