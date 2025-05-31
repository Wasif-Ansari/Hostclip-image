import { connectDB } from "@/lib/config/db";
import ClipModel from "@/lib/models/ClipModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const clip = await ClipModel.findOne({ sessionId: params.sessionId });
    if (!clip) throw new Error("Clip not found");
    return NextResponse.json({ success: true, clip });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { text } = await req.json();
    const updated = await ClipModel.findOneAndUpdate(
      { sessionId: params.sessionId },
      { text },
      { new: true }
    );
    if (!updated) throw new Error("Clip not found or not updated");
    return NextResponse.json({ success: true, clip: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
