import { NextResponse } from "next/server";
import { getAstraDB } from "@/app/lib/db/astradb";

export const dynamic = "force-dynamic";

const UMKM_COLLECTION = "umkm_account";

interface UpdateProfileRequest {
  email: string;
  nama_umkm: string;
  no_hp: string;
  industry: string;
  profile_image?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Helper: Verify password
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.compare(password, hashedPassword);
  } catch {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "umkm_salt_key_2024");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hash === hashedPassword;
  }
}

// Helper: Hash password
async function hashPassword(password: string): Promise<string> {
  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.hash(password, 12);
  } catch (error) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "umkm_salt_key_2024");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}

export async function PUT(req: Request) {
  try {
    const body: UpdateProfileRequest = await req.json();
    const { email, nama_umkm, no_hp, industry, profile_image, currentPassword, newPassword } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required to identify account" },
        { status: 400 }
      );
    }

    const astra = getAstraDB();
    const db = astra.getUmkmDB();
    const collection = db.collection(UMKM_COLLECTION);

    // Find user
    const user = await (collection as any).findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      nama_umkm,
      no_hp,
      industry,
      updated_at: new Date().toISOString(),
    };

    if (profile_image) {
      updateData.profile_image = profile_image;
    }

    // Handle password update
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: "Current password is required to set a new password" },
          { status: 400 }
        );
      }

      // Verify current password
      const isMatch = await verifyPassword(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Incorrect current password" },
          { status: 401 }
        );
      }

      // Hash new password
      updateData.password = await hashPassword(newPassword);
    }

    // Update in AstraDB
    await (collection as any).updateOne(
      { _id: user._id },
      { $set: updateData }
    );

    // Fetch updated user to return
    const updatedUser = await (collection as any).findOne({ _id: user._id });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.nama_umkm,
        role: "umkm",
        profile: {
          nama_umkm: updatedUser.nama_umkm,
          no_hp: updatedUser.no_hp,
          industry: updatedUser.industry,
          profile_image: updatedUser.profile_image,
        }
      }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET to fetch current profile by email (ensure fresh data)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    const astra = getAstraDB();
    const db = astra.getUmkmDB();
    const collection = db.collection(UMKM_COLLECTION);
    
    const user = await (collection as any).findOne({ email: email.toLowerCase() });

    if (!user) {
         return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        username: user.nama_umkm,
        profile: {
          nama_umkm: user.nama_umkm,
          no_hp: user.no_hp,
          industry: user.industry,
          profile_image: user.profile_image,
          email: user.email 
        }
      }
    });

  } catch (error) {
     console.error("Fetch profile error:", error);
     return NextResponse.json({ success: false, message: "Internal Error" }, { status: 500 });
  }
}
