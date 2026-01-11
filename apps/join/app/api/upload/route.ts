import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

// Configure max file size (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type (PDF only for resumes)
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 2MB limit" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `resume-${timestamp}-${sanitizedName}`;

    // Try to save to filesystem for local development/backup
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      console.log("✅ Resume saved to filesystem:", filePath);
    } catch (fsError) {
      // Log but don't fail - filesystem save is optional for deployment
      console.warn("⚠️ Could not save to filesystem (expected in serverless):", fsError);
    }

    // Always generate base64 data URL for database storage
    const base64 = buffer.toString("base64");
    const resumeDataUrl = `data:${file.type};base64,${base64}`;

    // Return the URL path (for display) and base64 data (for database storage)
    const fileUrl = `/uploads/resumes/${fileName}`;

    console.log("✅ Resume uploaded successfully:", fileUrl);

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: fileUrl,
        fileName: file.name,
        size: file.size,
        // Include base64 data URL for database storage
        // This ensures resume is accessible after deployment
        resumeData: resumeDataUrl,
      },
    });

  } catch (error) {
    console.error("❌ Error uploading file:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload file" },
      { status: 500 }
    );
  }
}

