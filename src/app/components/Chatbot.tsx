// components/Chatbot.tsx
import React, { useState } from "react";

interface ChatbotProps {}

export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: chatMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50"
        aria-label="Toggle Chatbot"
      >
        💬
      </button>

      {chatOpen && (
        <div className="fixed bottom-20 right-8 w-80 max-h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-lg flex flex-col z-50">
          <div className="flex justify-between items-center p-3 border-b border-gray-700">
            <h2 className="text-white font-semibold">AI Chatbot</h2>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close Chatbot"
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.length === 0 && (
              <p className="text-gray-400 text-sm">
                Ask me anything about your notes...
              </p>
            )}
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`rounded p-2 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-700 text-gray-200 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="flex border-t border-gray-700"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-2 bg-gray-800 text-white focus:outline-none"
              placeholder="Type a message..."
              disabled={chatLoading}
            />
            <button
              type="submit"
              className="px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
              disabled={chatLoading}
            >
              {chatLoading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
