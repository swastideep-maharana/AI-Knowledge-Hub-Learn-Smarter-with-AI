import { useParams } from "next/navigation";

export default function RoadmapPage() {
  const params = useParams();
  const roadmapId = params.id;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Roadmap Details</h1>
      <p className="mt-4">Roadmap ID: {roadmapId}</p>
      <p>Here we will show the generated roadmap content.</p>
    </main>
  );
}
