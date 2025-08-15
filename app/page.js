"use client";
import Image from "next/image";
import { Toaster, toast } from "sonner";

import { useEffect, useState } from "react";

export default function Home() {
  const [selectedImages, setSelectedImages] = useState([]); // File objects
  const [previewImages, setPreviewImages] = useState([]); // base64 strings
  const [sessionURL, setSessionURL] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasBeeped, setHasBeeped] = useState(false);
  const [hasImageBeeped, setHasImageBeeped] = useState(false);

  // Preview selected images
  useEffect(() => {
    if (selectedImages.length === 0) {
      setPreviewImages([]);
      return;
    }
    Promise.all(
      selectedImages.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    ).then(setPreviewImages);
  }, [selectedImages]);

  // Paste support for images
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = Array.from(e.clipboardData.items);
        const imageItems = items.filter((item) => item.type.startsWith("image/"));
        if (imageItems.length > 0) {
          const files = imageItems.map((item) => item.getAsFile()).filter(Boolean);
          setSelectedImages((prev) => [...prev, ...files]);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // QR code fetch and session setup
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const res = await fetch("/api/clip");
        const data = await res.json();
        if (data.success) {
          setQrCode(data.qrCode);
          setSessionId(data.sessionId);
          setSessionURL(`http://localhost:3000/session/${data.sessionId}`);
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
          // Text beep
          if (data.clip.text && data.clip.text !== "Demo-text" && !hasBeeped) {
            new Audio("/beep.mp3").play();
            setHasBeeped(true);
            setText(data.clip.text);
          }
          // Images beep
          if (Array.isArray(data.clip.images)) {
            // Only beep if new images arrive
            if (data.clip.images.length > 0 && !hasImageBeeped) {
              new Audio("/beep.mp3").play();
              setHasImageBeeped(true);
            }
            setImages(data.clip.images);
          }
        }
      } catch (err) {
        // ignore fetch errors here
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [sessionId, hasBeeped, hasImageBeeped]);

  // Replace alert with toast in handleSave
  const handleSave = async () => {
    if (!sessionId) return;
    try {
      let res, data;
      if (selectedImages.length > 0) {
        // Use multipart/form-data for images
        const formData = new FormData();
        formData.append("text", text);
        selectedImages.forEach((img) => formData.append("images", img));
        res = await fetch(`/api/clip/${sessionId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Only text
        res = await fetch(`/api/clip/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }
      data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Clipboard updated!");
      setSelectedImages([]);
      setPreviewImages([]);
    } catch (error) {
      toast.error("Failed to update clipboard: " + error.message);
    }
  };

  // Replace alert with toast in handleRefresh
  const handleRefresh = async () => {
    try {
      const res = await fetch(`/api/clip/${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setText(data.clip.text);
        setImages(data.clip.images || []);
        toast.success("Clipboard refreshed!");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error("Error refreshing clipboard: " + err.message);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
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

        {/* Session URL and Copy Button */}
        {sessionURL && (
          <div className="flex flex-col items-center mt-2 mb-2">
            <span className="text-cyan-200 text-sm break-all">Session Link:</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-gray-800 text-cyan-100 px-2 py-1 rounded select-all text-xs break-all">
                {sessionURL}
              </span>
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 rounded text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(sessionURL);
                  toast.success("Session link copied!");
                }}
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <textarea
          className="mt-8 w-4/5 h-60 sm:h-60 md:h-80 rounded-xl border border-cyan-200 shadow-lg p-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-none bg-[#132c41] text-cyan-100"
          placeholder="Paste or type your clipboard text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Image Upload & Paste UI */}
        <div className="mt-6 w-4/5">
          <label className="block font-semibold mb-2 text-cyan-700">
            Upload or Paste Images (PNG/JPEG, ≤2MB each):
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="block w-full mb-2"
            onChange={(e) => {
              const files = Array.from(e.target.files).filter(
                (f) => f.size <= 2 * 1024 * 1024 && ["image/png", "image/jpeg"].includes(f.type)
              );
              setSelectedImages(files);
            }}
          />
          <div
            className="border-2 border-dashed border-cyan-400 rounded-lg p-4 flex flex-wrap gap-4 min-h-[80px] bg-cyan-50"
            tabIndex={0}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files).filter(
                (f) => f.size <= 2 * 1024 * 1024 && ["image/png", "image/jpeg"].includes(f.type)
              );
              setSelectedImages(files);
            }}
          >
            {previewImages.length > 0 ? (
              previewImages.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  width={100}
                  height={100}
                  className="object-contain rounded-lg border shadow"
                />
              ))
            ) : (
              <span className="text-cyan-400">Drag, select, or paste images here</span>
            )}
          </div>
          <span className="text-xs text-cyan-500 mt-2 block">
            Tip: Click inside the box and press Ctrl+V to paste images from your clipboard.
          </span>
        </div>

        {/* Images Gallery */}
        {images.length > 0 && (
          <div className="w-4/5 mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden shadow-lg bg-[#132c41] flex items-center justify-center"
              >
                <Image
                  src={img}
                  alt={`Clipboard Image ${idx + 1}`}
                  width={200}
                  height={200}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>
        )}

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
    </>
  );
}
