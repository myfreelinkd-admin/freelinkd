import { NextResponse } from "next/server";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../../lib/db";
import { sendFreelancerAcceptanceEmail } from "../../../../utils/email";
import { FreelancerAcceptanceEmailData } from "../../../../types/type-email";

export const dynamic = "force-dynamic";

// Default password for approved freelancers (plain text - will be hashed before storage)
const DEFAULT_PASSWORD = "FreelinkdTalent";

/**
 * Hash password using bcrypt
 * Falls back to Web Crypto API if bcrypt is not available
 */
async function hashPassword(password: string): Promise<string> {
  try {
    // Try using bcryptjs first
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log("bcryptjs not available, using Web Crypto API fallback");
    // Fallback to Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(password + process.env.PASSWORD_SALT || "freelinkd-salt");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }
}

/**
 * POST /api/admin/freelancer/approve
 * Approve a pending freelancer - creates account and sends email
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { freelancerId } = body;

    if (!freelancerId) {
      return NextResponse.json(
        { success: false, message: "Freelancer ID is required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    
    // Get freelancer form data
    const formCollection = db.getCollectionFromKeyspace(
      ASTRA_KEYSPACES.FREELANCER,
      "freelancer_form"
    ) as any;

    const freelancerData = await formCollection.findOne({ _id: freelancerId });

    if (!freelancerData) {
      return NextResponse.json(
        { success: false, message: "Freelancer not found" },
        { status: 404 }
      );
    }

    // Get data_freelancer collection for saving approved freelancer
    const dataCollection = db.getCollectionFromKeyspace(
      ASTRA_KEYSPACES.FREELANCER,
      "data_freelancer"
    ) as any;

    // Hash the password before storing
    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
    console.log("✅ Password hashed successfully");

    // Create freelancer account with specified columns
    const accountData = {
      name: freelancerData.name || "",
      address: freelancerData.address || "",
      email: freelancerData.email || "",
      password: hashedPassword, // Store hashed password
      phone: freelancerData.phone || "",
      skills: freelancerData.skills || "",
      professionalExperience: freelancerData.professionalExperience || "",
      portfolioUrl: freelancerData.portfolioUrl || "",
      resumeFileName: freelancerData.resumeFileName || "",
      profilePicture: freelancerData.profilePicture || "",
      status: "active",
      joinedDate: new Date().toISOString(),
      rank: "Classic",
      formId: freelancerId,
    };

    // Insert into data_freelancer collection
    await dataCollection.insertOne(accountData);
    console.log("✅ Freelancer account created for:", freelancerData.email);

    // Update status in freelancer_form to approved
    await formCollection.updateOne(
      { _id: freelancerId },
      { 
        $set: { 
          status: "approved",
          approvedAt: new Date().toISOString()
        } 
      }
    );
    console.log("✅ Freelancer form status updated to approved");

    // Send acceptance email
    const emailData: FreelancerAcceptanceEmailData = {
      freelancerName: freelancerData.name || "Freelancer",
      freelancerEmail: freelancerData.email,
      companyName: "Freelinkd Team",
    };

    try {
      await sendFreelancerAcceptanceEmail(emailData);
      console.log("✅ Acceptance email sent to:", freelancerData.email);
    } catch (emailError) {
      console.error("⚠️ Failed to send email, but account was created:", emailError);
      // Don't fail the entire operation if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Freelancer approved successfully",
      data: {
        freelancerId,
        email: freelancerData.email,
        name: freelancerData.name,
      },
    });

  } catch (error) {
    console.error("❌ Error approving freelancer:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
