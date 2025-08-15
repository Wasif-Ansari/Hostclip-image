"use client";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function SessionPage() {
  const { sessionId } = useParams();
  const [clip, setClip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasBeeped, setHasBeeped] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // File objects
  const [previewImages, setPreviewImages] = useState([]); // base64 strings

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

  const handleSave = async () => {
    if (!clip) return;
    setSaving(true);
    try {
      let res, data;
      if (selectedImages.length > 0) {
        // Use multipart/form-data for images
        const formData = new FormData();
        formData.append("text", clip.text);
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
          body: JSON.stringify({ text: clip.text }),
        });
      }
      data = await res.json();
      if (!data.success) throw new Error(data.message);
      setClip(data.clip);
      setSelectedImages([]);
      setPreviewImages([]);
      toast.success("✅ Clipboard saved!");
    } catch (err) {
      toast.error("❌ Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Clipboard Session</h1>
        <textarea
          className="w-full h-60 p-4 border rounded-md text-black"
          value={clip?.text || ""}
          onChange={(e) => setClip({ ...clip, text: e.target.value })}
        />

        {/* Image Upload UI */}
        <div className="mt-6">
          <label className="block font-semibold mb-2 text-cyan-700">
            Upload Images (PNG/JPEG, ≤2MB each):
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
              <span className="text-cyan-400">
                Drag & drop or select images to upload
              </span>
            )}
          </div>
        </div>

        {/* Images Gallery */}
        {clip?.images?.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {clip.images.map((img, idx) => (
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

        <button
          className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
