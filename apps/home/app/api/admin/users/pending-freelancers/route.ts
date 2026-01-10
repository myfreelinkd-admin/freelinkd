import { NextResponse } from "next/server";
import { getAstraDB } from "../../../../lib/db/astradb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("freelancer", "freelancer_form") as any;

    // Fetch pending freelancers
    // Note: Assuming 'find' returns a cursor, we convert to array
    const cursor = await collection.find({ status: "pending" });
    const pendingFreelancers = await cursor.toArray();

    // Map data to frontend structure using actual DB columns:
    // name, address, email, phone, skills, professionalExperience, portfolioUrl, resumeFileName, status
    const mappedData = pendingFreelancers.map((user: any) => ({
      id: user._id.toString(),
      name: user.name || "Unknown",
      email: user.email || "",
      phone: user.phone || "",
      role: user.skills || "Freelancer", // Using skills as role/expertise
      location: user.address || "Unknown",
      appliedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
      status: user.status || "pending",
      portfolioUrl: user.portfolioUrl || "",
      // Convert /uploads/resumes/xxx.pdf to /api/uploads/resumes/xxx.pdf for Admin access
      resumeFileName: user.resumeFileName 
        ? user.resumeFileName.replace("/uploads/resumes/", "/api/uploads/resumes/") 
        : "",
      professionalExperience: user.professionalExperience || "",
      bio: user.professionalExperience || "", // Map experience as bio for modal
    }));

    return NextResponse.json({
      success: true,
      data: mappedData,
    });
  } catch (error) {
    console.error("Error fetching pending freelancers:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
