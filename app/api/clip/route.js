import { connectDB } from "@/lib/config/db";
import ClipModel from "@/lib/models/ClipModel"; // ✅ Use your ClipModel
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

const { NextResponse } = require("next/server");

// ✅ Connect to DB once
const LoadDB = async () => {
  await connectDB();
  console.log("✅ MongoDB Connected");
};

LoadDB();

// ✅ GET API to create a new clipboard session
export async function GET() {
  try {
    console.log("🟢 API HIT: /api/clip");

    // 1. Generate unique sessionId
    const sessionId = uuidv4();
    console.log("📌 Generated session ID:", sessionId);

    // 2. Create a new clip document with empty text
    await ClipModel.create({
      sessionId,
      text: "Demo-text" // ✅ Required field - keep it empty for now
    });
    console.log("📝 Clip session saved to DB");

    // 3. Create a session URL
    const sessionURL = `http://192.168.1.6:3000/session/${sessionId}`;
    console.log("🌐 Session URL:", sessionURL);

    // 4. Generate QR code
    const qrImage = await QRCode.toDataURL(sessionURL);
    console.log("🎯 QR Code Generated");

    // 5. Return sessionId and QR code
    return NextResponse.json({
      success: true,
      sessionId,
      qrCode: qrImage,
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
