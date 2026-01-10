import { NextResponse } from "next/server";
import { getAstraDB } from "@/app/lib/db/astradb";

const UMKM_COLLECTION = "umkm_account";
interface RegisterRequest {
  username: string;       
  email: string;
  phone: string;         
  businessType: string;   
  password: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

async function hashPassword(password: string): Promise<string> {
  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.hash(password, 12);
  } catch (error) {
    console.error("bcrypt import failed:", error);
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "umkm_salt_key_2024");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}

export async function POST(req: Request) {
  console.log("=== UMKM Registration API (AstraDB) ===");

  try {
    // Parse request body
    let body: RegisterRequest;
    try {
      body = await req.json();
      console.log("Register attempt for:", body.email);
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

    const { username, email, phone, businessType, password } = body;

    if (!username || !email || !businessType || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Validation failed",
          error: "All required fields must be filled",
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

    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Validation failed",
          error: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

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

    const db = astraClient.getUmkmDB();
    const collection = db.collection(UMKM_COLLECTION);

    console.log("Connected to AstraDB UMKM collection");

    const existingUser = await (collection as any).findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Registration failed",
          error: "Email already registered",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const now = new Date().toISOString();
    const umkmDoc = {
      nama_umkm: username,
      email: email.toLowerCase(),
      no_hp: phone || "",
      industry: businessType,
      password: hashedPassword,
      agreement: true,
      status: "active",
      created_at: now,
      updated_at: now,
    };

    console.log("Inserting UMKM document...");
    const result = await (collection as any).insertOne(umkmDoc);

    if (!result.insertedId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Registration failed",
          error: "Failed to create account",
        },
        { status: 500 }
      );
    }

    console.log("UMKM registered:", result.insertedId);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Registration successful! You can now login.",
        data: {
          id: result.insertedId,
          email: email.toLowerCase(),
          username: username,
          businessType: businessType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("UMKM Registration Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
