// Updated NotesPage with Gemini-powered Chatbot integration

"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Chatbot from "../components/Chatbot"; // Import the chatbot component

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

export default function NotesPage() {
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      if (!Array.isArray(data.notes)) {
        throw new Error("Unexpected response format");
      }
      setNotes(data.notes);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) {
      setError("Note content cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save note");
      }
      setNewNote("");
      await fetchNotes();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setDeletingNoteId(id);
    setError(null);
    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete note");
      }
      await fetchNotes();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleEditNote = (id: string, content: string) => {
    setEditingNoteId(id);
    setEditingContent(content);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingContent.trim()) {
      setError("Edited note cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content: editingContent.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update note");
      }
      setEditingNoteId(null);
      setEditingContent("");
      await fetchNotes();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchNotes();
  }, []);

  if (!user) {
    return (
      <main className="p-8 max-w-2xl mx-auto text-center text-white">
        <h2 className="text-xl font-semibold">
          Please log in to see your notes.
        </h2>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto text-white relative">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-400">
        📝 Your Notes
      </h1>

      <input
        type="text"
        className="w-full p-3 mb-6 rounded border border-gray-500 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <form
        onSubmit={handleAddNote}
        className="mb-6 bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-md"
      >
        <textarea
          className="w-full p-4 text-white rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Write a new note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={4}
          disabled={loading}
        ></textarea>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded text-white font-semibold hover:opacity-90 disabled:opacity-50 transition duration-200"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Note"}
        </button>
      </form>

      {error && (
        <p className="text-red-500 mb-6 font-medium text-center">⚠️ {error}</p>
      )}

      <div className="space-y-5">
        {filteredNotes.length === 0 && !loading && (
          <p className="text-center text-gray-400">
            No notes found. Try a different search.
          </p>
        )}
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700"
          >
            {editingNoteId === note._id ? (
              <>
                <textarea
                  className="w-full p-3 rounded border border-gray-600 text-white bg-gray-700 mb-2"
                  rows={4}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                ></textarea>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="px-4 py-1 rounded bg-gray-600 hover:bg-gray-500 text-white text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(note._id)}
                    className="px-4 py-1 rounded bg-green-600 hover:bg-green-500 text-white text-sm"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-start">
                <div className="max-w-[85%]">
                  <p className="text-lg whitespace-pre-wrap text-white leading-relaxed">
                    {note.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <button
                    onClick={() => handleEditNote(note._id, note.content)}
                    className="text-xs text-yellow-400 hover:text-yellow-600 font-semibold"
                    title="Edit Note"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className={`text-xs text-red-400 hover:text-red-600 font-semibold transition duration-150 ${
                      deletingNoteId === note._id
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    disabled={deletingNoteId === note._id}
                    title="Delete Note"
                  >
                    {deletingNoteId === note._id ? "Deleting..." : "🗑 Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Chatbot />
    </main>
  );
}
