import { NextResponse } from "next/server";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../lib/db/astradb";

export const dynamic = "force-dynamic";

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const freelancerId = formData.get("freelancerId") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!freelancerId) {
      return NextResponse.json(
        { success: false, message: "Freelancer ID is required" },
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

    // Update the freelancer's photo in AstraDB
    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace(ASTRA_KEYSPACES.FREELANCER, "data_freelancer") as any;

    // Try to find user first
    let user = await collection.findOne({ _id: freelancerId });
    
    if (!user) {
      // Try with ObjectId
      try {
        const { ObjectId } = require("mongodb");
        if (ObjectId.isValid(freelancerId)) {
          user = await collection.findOne({ _id: new ObjectId(freelancerId) });
        }
      } catch (e) {
        // ignore
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Freelancer not found" },
        { status: 404 }
      );
    }

    // Update the profile image
    await collection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          profile_image: dataUrl,
          photo_url: dataUrl, // Also update alternate field name
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
    console.error("Freelancer photo upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
