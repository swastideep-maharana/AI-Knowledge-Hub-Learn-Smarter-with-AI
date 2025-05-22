import type { NextApiRequest, NextApiResponse } from "next";

// Dummy AI response for now
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message, history } = req.body;

  // For now, just echo back the message reversed (replace with real AI call)
  // Example: integrate OpenAI or other LLM here

  // Simulate AI thinking delay
  await new Promise((r) => setTimeout(r, 1000));

  res.status(200).json({
    reply: `You said: "${message}" (AI reply placeholder)`,
  });
}
