import { NextResponse } from "next/server";
import { getAstraDB } from "@/app/lib/db/astradb";

// Collection name
const UMKM_COLLECTION = "umkm_account";

// Request interface
interface LoginRequest {
  email: string;
  password: string;
}

// Response interface
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Verify password function
async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.compare(password, hashedPassword);
  } catch {
    // Fallback to SHA-256 comparison
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "umkm_salt_key_2024");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hash === hashedPassword;
  }
}

/**
 * UMKM Login API
 * POST /api/umkm/login
 *
 * Authenticates against AstraDB:
 * - Keyspace: umkm
 * - Collection: umkm_account
 */
export async function POST(req: Request) {
  console.log("=== UMKM Login API (AstraDB) ===");

  try {
    // Parse request body
    let body: LoginRequest;
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

    // ===== AstraDB Operations =====
    console.log("Connecting to AstraDB...");

    let astraClient;
    try {
      astraClient = getAstraDB();
    } catch (error) {
      console.error("AstraDB init error:", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Database configuration error",
          error: "Failed to connect to database",
        },
        { status: 500 }
      );
    }

    // Get UMKM collection
    const db = astraClient.getUmkmDB();
    const collection = db.collection(UMKM_COLLECTION);

    console.log("Connected to AstraDB UMKM collection");

    // Find user by email
    const user = await (collection as any).findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
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
    if (user.status !== "active") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Authentication failed",
          error: "Your account is inactive. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Verify password
    console.log("Verifying password...");
    const isValid = await verifyPassword(password, user.password);

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

    // Update last login
    try {
      await (collection as any).updateOne(
        { _id: user._id },
        { $set: { last_login: new Date().toISOString(), updated_at: new Date().toISOString() } }
      );
    } catch (updateError) {
      console.warn("Failed to update last login:", updateError);
      // Continue anyway - login still successful
    }

    console.log("UMKM Login successful:", user.email);

    // ===== Success Response =====
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          email: user.email,
          username: user.nama_umkm,
          role: "umkm",
          profile: {
            nama_umkm: user.nama_umkm,
            no_hp: user.no_hp,
            industry: user.industry,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UMKM Login Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
