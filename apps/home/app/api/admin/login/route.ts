import { NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";

const ADMIN_COLLECTION = "admin_freelinkd";
const DB_NAME = "freelinkd_db";

interface AdminLoginRequest {
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

async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.compare(password, hashedPassword);
  } catch {
    console.warn("bcrypt import failed, using basic verification");
    const encoder = new TextEncoder();
    const data = encoder.encode(
      password + process.env.MONGODB_URI?.slice(-10)
    );
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hash === hashedPassword;
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
 * Admin Login API
 * POST /api/admin/login
 */
export async function POST(req: Request) {
  console.log("=== Admin Login API ===");

  let client: MongoClient | null = null;

  try {
    // Parse request body
    let body: AdminLoginRequest;
    try {
      body = await req.json();
      console.log("Login attempt for:", body.email);
    } catch {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid request",
          error: "Request body must be valid JSON",
        },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // ===== Validation =====
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Validation failed",
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Validation failed",
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // ===== Database Operations =====
    console.log("Connecting to MongoDB...");
    client = await getMongoClient();
    console.log("MongoDB connected");

    const db = client.db(DB_NAME);
    const collection = db.collection(ADMIN_COLLECTION);

    // Find admin by email
    const admin = await collection.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Authentication failed",
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check account status
    if (admin.status !== "active") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Authentication failed",
          error: "Your account is inactive. Please contact administrator.",
        },
        { status: 403 }
      );
    }

    // Verify password
    console.log("Verifying password...");
    const isValid = await verifyPassword(password, admin.password);

    if (!isValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Authentication failed",
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await collection.updateOne(
      { _id: admin._id },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    );

    console.log("Login successful for:", admin.email);

    // Success response
    const response: ApiResponse<AdminResponse> = {
      success: true,
      message: "Login successful",
      data: {
        id: admin._id.toString(),
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        createdAt: admin.createdAt?.toISOString() || new Date().toISOString(),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

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
