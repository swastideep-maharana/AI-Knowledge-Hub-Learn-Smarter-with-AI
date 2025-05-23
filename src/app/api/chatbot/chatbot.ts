import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
console.log("GOOGLE_API_KEY:", !!process.env.GOOGLE_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message" });
  }

  try {
    console.log("Received message:", message);
    console.log("Received history:", history);

    // Use free Gemini model here:
    const model = genAI.getGenerativeModel({ model: "gemini-1" });

    const chat = model.startChat({
      history: (Array.isArray(history) ? history : []).map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response:", text);

    res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Gemini API call failed." });
  }
}
