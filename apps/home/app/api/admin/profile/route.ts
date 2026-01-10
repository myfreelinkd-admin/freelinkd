import { NextResponse } from "next/server";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const ADMIN_COLLECTION = "admin_freelinkd";
const DB_NAME = "freelinkd_db";

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

export async function GET(req: Request) {
  let client: MongoClient | null = null;
  
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
       return NextResponse.json(
        { success: false, message: "Admin ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid Admin ID format" },
          { status: 400 }
        );
    }

    client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(ADMIN_COLLECTION);

    const admin = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } } // Exclude password
    );

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id.toString(),
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        photo: admin.photo || admin.avatar || null, // Handle different potential field names
        createdAt: admin.createdAt,
      },
    });

  } catch (error) {
    console.error("Profile Fetch Error:", error);
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

export async function PUT(req: Request) {
  let client: MongoClient | null = null;
  
  try {
    const body = await req.json();
    const { id, username, email, password, photo } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing Admin ID" },
        { status: 400 }
      );
    }

    client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(ADMIN_COLLECTION);

    const updateData: any = {
      updatedAt: new Date()
    };

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (photo) updateData.photo = photo;

    // Handle password update if provided
    if (password) {
      // Basic hashing logic matching login route (in real prod use bcrypt)
      // If the login route used bcrypt, we should use it here too. 
      // The login route had a fallback to web crypto if bcrypt failed to import.
      // For consistency with the provided login route snippet:
      try {
        const bcrypt = await import("bcryptjs");
        updateData.password = await bcrypt.hash(password, 10);
      } catch {
         // Fallback similar to login route
        const encoder = new TextEncoder();
        const data = encoder.encode(
            password + process.env.MONGODB_URI?.slice(-10)
        );
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        updateData.password = hash;
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
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
