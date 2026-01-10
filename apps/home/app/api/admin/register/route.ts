import { NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";

// Collection name constant
const ADMIN_COLLECTION = "admin_freelinkd";
const DB_NAME = "freelinkd_db";

interface AdminRegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AdminResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Simple hash function for password (temporary - for testing)
// In production, use bcrypt after Turbopack issue is resolved
async function hashPassword(password: string): Promise<string> {
  // Dynamic import bcrypt to avoid Turbopack issues
  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.hash(password, 12);
  } catch {
    // Fallback: Use basic encoding (NOT SECURE - for testing only)
    console.warn("bcrypt import failed, using basic encoding");
    const encoder = new TextEncoder();
    const data = encoder.encode(password + process.env.MONGODB_URI?.slice(-10));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}

// Get MongoDB client with direct connection
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

/**
 * Admin Registration API
 * POST /api/admin/register
 */
export async function POST(req: Request) {
  console.log("=== Admin Registration API ===");
  
  let client: MongoClient | null = null;

  try {
    // Parse request body
    let body: AdminRegisterRequest;
    try {
      body = await req.json();
      console.log("Received:", { username: body.username, email: body.email });
    } catch {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid request", error: "Request body must be valid JSON" },
        { status: 400 }
      );
    }

    const { username, email, password } = body;

    // ===== Validation =====
    if (!username || !email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Validation failed", error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Validation failed", error: "Username must be 3-30 alphanumeric characters or underscores" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Validation failed", error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Validation failed", error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // ===== Database Operations =====
    console.log("Connecting to MongoDB...");
    client = await getMongoClient();
    console.log("MongoDB connected");

    const db = client.db(DB_NAME);
    const collection = db.collection(ADMIN_COLLECTION);

    // Check existing email
    const existingEmail = await collection.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Registration failed", error: "Email is already registered" },
        { status: 409 }
      );
    }

    // Check existing username
    const existingUsername = await collection.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Registration failed", error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await hashPassword(password);

    // Create admin document
    const now = new Date();
    const adminDoc = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    // Insert
    console.log("Inserting admin...");
    const result = await collection.insertOne(adminDoc);

    if (!result.insertedId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Registration failed", error: "Failed to create admin account" },
        { status: 500 }
      );
    }

    console.log("Admin registered:", result.insertedId.toString());

    // Success response
    const response: ApiResponse<AdminResponse> = {
      success: true,
      message: "Admin registered successfully",
      data: {
        id: result.insertedId.toString(),
        username: adminDoc.username,
        email: adminDoc.email,
        role: adminDoc.role,
        status: adminDoc.status,
        createdAt: adminDoc.createdAt.toISOString(),
      },
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  } finally {
    // Always close the connection
    if (client) {
      try {
        await client.close();
        console.log("MongoDB connection closed");
      } catch (closeError) {
        console.error("Error closing MongoDB:", closeError);
      }
    }
  }
}
