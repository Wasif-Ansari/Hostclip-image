"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [qrCode, setQrCode] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasBeeped, setHasBeeped] = useState(false);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const res = await fetch("/api/clip");
        const data = await res.json();
        if (data.success) {
          setQrCode(data.qrCode);
          setSessionId(data.sessionId);
        } else {
          console.error("Failed to get QR code:", data.message);
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, []);

  // Poll clip text every 3 seconds and beep once on first change
  useEffect(() => {
    if (!sessionId || hasBeeped) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/clip/${sessionId}`);
        const data = await res.json();
        if (data.success) {
          if (data.clip.text && data.clip.text !== "Demo-text" && !hasBeeped) {
            new Audio("/beep.mp3").play();
            setHasBeeped(true);
            setText(data.clip.text);  // Also update textarea on first beep
          }
        }
      } catch (err) {
        // ignore fetch errors here
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [sessionId, hasBeeped]);

  const handleSave = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/clip/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      alert("Clipboard updated!");
    } catch (error) {
      alert("Failed to update clipboard: " + error.message);
    }
  };

  const handleRefresh = async () => {
    try {
      const res = await fetch(`/api/clip/${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setText(data.clip.text);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      alert("Error refreshing clipboard: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-2 w-full h-auto bg-[#0f2027]">
      <div className="flex flex-col sm:flex-row items-center justify-center mt-4 gap-6 p-4 w-full rounded-2xl">
        <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-cyan-300 text-center sm:text-left mb-4 sm:mb-0">
          Scan to open your Clipboard
        </h1>
        {qrCode ? (
          <img
            className="bg-white rounded-xl p-2 shadow-lg"
            src={qrCode}
            width={140}
            height={140}
            alt="QR"
          />
        ) : (
          <Image
            className="bg-white rounded-xl p-2 shadow-lg"
            src="/QR.svg"
            width={140}
            height={140}
            alt="QR Placeholder"
            priority
          />
        )}
      </div>

      <textarea
        className="mt-8 w-4/5 h-60 sm:h-60 md:h-80 rounded-xl border border-cyan-200 shadow-lg p-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-none bg-[#132c41] text-cyan-100"
        placeholder="Paste or type your clipboard text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex gap-4 mt-4 mb-20">
        <button
          onClick={handleSave}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md"
        >
          Save
        </button>
        <button
          onClick={handleRefresh}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
