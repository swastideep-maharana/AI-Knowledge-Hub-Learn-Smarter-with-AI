import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

interface Roadmap {
  _id: ObjectId;
  title: string;
  description?: string;
  features: string[];
  createdAt: Date;
}

interface Props {
  params: { id: string };
}

export default async function RoadmapDetailPage({ params }: Props) {
  const client = await clientPromise;
  const db = client.db("myapp");
  const roadmaps = db.collection<Roadmap>("roadmaps");

  if (!ObjectId.isValid(params.id)) {
    notFound();
  }

  const roadmap = await roadmaps.findOne({
    _id: new ObjectId(params.id),
  });

  if (!roadmap) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-4">{roadmap.title}</h1>
      {roadmap.description && (
        <p className="mb-6 text-gray-300">{roadmap.description}</p>
      )}
      <h2 className="text-2xl font-semibold mb-3">Features</h2>
      <ul className="list-disc pl-6 space-y-2">
        {roadmap.features.map((feature, i) => (
          <li key={i} className="text-gray-300">
            {feature}
          </li>
        ))}
      </ul>
    </main>
  );
}
