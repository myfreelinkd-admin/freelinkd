import { NextResponse } from "next/server";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const ADMIN_COLLECTION = "admin_freelinkd";
const DB_NAME = "freelinkd_db";

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;

async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  return client;
}

export async function POST(req: Request) {
  let client: MongoClient | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const adminId = formData.get("adminId") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!adminId || !ObjectId.isValid(adminId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing Admin ID" },
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

    // Update the admin's photo in MongoDB
    client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(ADMIN_COLLECTION);

    const result = await collection.updateOne(
      { _id: new ObjectId(adminId) },
      { 
        $set: { 
          photo: dataUrl,
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Photo uploaded successfully",
      url: dataUrl,
    });

  } catch (error) {
    console.error("Admin photo upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
