import { connectDB } from "@/lib/config/db";
import ClipModel from "@/lib/models/ClipModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const awaitedParams = await params;
    const clip = await ClipModel.findOne({ sessionId: awaitedParams.sessionId });
    if (!clip) throw new Error("Clip not found");
    // Always return text and images
    return NextResponse.json({ success: true, clip: { text: clip.text, images: clip.images || [], sessionId: clip.sessionId } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const awaitedParams = await params;
    let text, images;
    let update = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      text = body.text;
      images = body.images;
    } else if (contentType.includes('multipart/form-data')) {
      // Parse multipart form data
      const formData = await req.formData();
      text = formData.get('text');
      images = formData.getAll('images'); // array of File objects
      // Convert images to base64 strings
      images = await Promise.all(images.map(async (file) => {
        if (!file) return null;
        const buffer = Buffer.from(await file.arrayBuffer());
        // Only allow PNG/JPEG ≤ 2MB
        if (buffer.length > 2 * 1024 * 1024) throw new Error('Image too large');
        const mime = file.type;
        if (!['image/png', 'image/jpeg'].includes(mime)) throw new Error('Invalid image format');
        return `data:${mime};base64,${buffer.toString('base64')}`;
      }));
      images = images.filter(Boolean);
    }

    if (typeof text !== 'undefined') update.text = text;
    if (typeof images !== 'undefined') {
      // If images is an array, replace; if single, append
      if (Array.isArray(images)) {
        update.images = images;
      } else if (images) {
        update.$push = { images };
      }
    }

    const updated = await ClipModel.findOneAndUpdate(
      { sessionId: awaitedParams.sessionId },
      update,
      { new: true }
    );
    if (!updated) throw new Error("Clip not found or not updated");
    return NextResponse.json({ success: true, clip: { text: updated.text, images: updated.images, sessionId: updated.sessionId } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
