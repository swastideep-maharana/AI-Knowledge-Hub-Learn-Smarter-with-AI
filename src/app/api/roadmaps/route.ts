import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Roadmap {
  _id?: ObjectId;
  title: string;
  description?: string;
  features: string[];
  createdAt?: Date;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myapp");
    const roadmaps = db.collection<Roadmap>("roadmaps");

    const allRoadmaps = await roadmaps
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert _id and createdAt to strings for JSON serialization
    const roadmapsForResponse = allRoadmaps.map((r) => ({
      _id: r._id!.toString(),
      title: r.title,
      description: r.description || "",
      features: r.features,
      createdAt: r.createdAt
        ? r.createdAt.toISOString()
        : new Date().toISOString(),
    }));

    return NextResponse.json({ roadmaps: roadmapsForResponse });
  } catch (error) {
    console.error("GET /api/roadmaps error:", error);
    return NextResponse.json(
      { message: "Failed to fetch roadmaps" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.features)) {
      return NextResponse.json(
        { message: "Features must be an array" },
        { status: 400 }
      );
    }

    const newRoadmap: Roadmap = {
      title: body.title.trim(),
      description:
        typeof body.description === "string" ? body.description.trim() : "",
      features: body.features.filter(
        (f: string) => typeof f === "string" && f.trim() !== ""
      ),
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db("myapp");
    const roadmaps = db.collection<Roadmap>("roadmaps");

    const result = await roadmaps.insertOne(newRoadmap);

    return NextResponse.json({
      message: "Roadmap created",
      roadmapId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("POST /api/roadmaps error:", error);
    return NextResponse.json(
      { message: "Failed to create roadmap" },
      { status: 500 }
    );
  }
}
