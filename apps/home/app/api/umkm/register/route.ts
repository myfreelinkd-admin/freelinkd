import { getSupabase } from "@/app/lib/db";
import { NextResponse } from "next/server";

interface RegisterRequest {
  username: string;
  email: string;
  businessType: string;
  password: string;
  phone?: string;
}

export async function POST(req: Request) {
  console.log("=== UMKM Registration API ===");

  try {
    const body: RegisterRequest = await req.json();
    const { username, email, businessType, password, phone } = body;

    // Validate required fields
    if (!username || !email || !businessType || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Get Supabase client
    let supabase;
    try {
      supabase = getSupabase();
    } catch (configError) {
      console.error("Supabase Configuration Error:", configError);
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    // Step 1: Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
      options: {
        data: {
          username: username,
          role: "umkm",
        },
      },
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      
      // Handle specific auth errors
      if (authError.message.includes("already registered")) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: authError.message || "Registration failed" },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    const userId = authData.user.id;
    console.log("Auth user created:", userId);

    // Step 2: Insert UMKM profile data into umkm_freelinkd table
    const { data: profileData, error: profileError } = await supabase
      .table("umkm_freelinkd")
      .insert({
        user_id: userId,
        umkm_name: username,
        email: email.toLowerCase(),
        phone: phone || null,
        industry: businessType,
        agreed: true, // User has agreed to terms
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile Insert Error:", profileError);
      // Note: User is created in Auth but profile failed
      // You may want to handle this case (e.g., delete auth user or retry)
      return NextResponse.json(
        { error: "Account created but profile setup failed. Please contact support." },
        { status: 500 }
      );
    }

    console.log("UMKM Registration successful:", profileData?.id);

    return NextResponse.json({
      success: true,
      message: "Registration successful! Please check your email for verification.",
      user: {
        id: userId,
        profileId: profileData?.id,
        username: username,
        email: email.toLowerCase(),
      },
    });
  } catch (error) {
    console.error("UMKM Registration Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

