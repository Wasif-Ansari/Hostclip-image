"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SessionPage() {
  const { sessionId } = useParams();
  const [clip, setClip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // To avoid repeated beep on re-renders, store beep played state
  const [hasBeeped, setHasBeeped] = useState(false);

  useEffect(() => {
    const fetchClip = async () => {
      try {
        const res = await fetch(`/api/clip/${sessionId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setClip(data.clip);

        if (!hasBeeped) {
          const beep = new Audio("/beep.mp3");
          beep.play().catch((err) =>
            console.warn("🔇 Beep autoplay blocked:", err.message)
          );
          setHasBeeped(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClip();
  }, [sessionId, hasBeeped]);

  const handleSave = async () => {
    if (!clip) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/clip/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: clip.text }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      alert("✅ Clipboard saved!");
    } catch (err) {
      alert("❌ Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Clipboard Session</h1>
      <textarea
        className="w-full h-60 p-4 border rounded-md text-black"
        value={clip?.text || ""}
        onChange={(e) => setClip({ ...clip, text: e.target.value })}
      />
      <button
        className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
