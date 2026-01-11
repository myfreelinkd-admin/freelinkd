import { NextResponse } from "next/server";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../lib/db/astradb";

export const dynamic = "force-dynamic";

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const email = formData.get("email") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size too large. Maximum 2MB allowed" },
        { status: 400 }
      );
    }

    // Convert file to base64 data URL
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update the UMKM's profile image in AstraDB
    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace(ASTRA_KEYSPACES.UMKM, "umkm_account") as any;

    // Find user by email
    const user = await collection.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "UMKM user not found" },
        { status: 404 }
      );
    }

    // Update the profile image
    await collection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          "profile.profile_image": dataUrl,
          updatedAt: new Date().toISOString()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: "Photo uploaded successfully",
      url: dataUrl,
    });

  } catch (error) {
    console.error("UMKM photo upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
