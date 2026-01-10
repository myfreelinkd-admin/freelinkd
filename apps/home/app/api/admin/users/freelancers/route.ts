import { NextResponse } from "next/server";
import { getAstraDB } from "../../../../lib/db/astradb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("freelancer", "data_freelancer") as any;

    // Fetch active freelancers
    const cursor = await collection.find({});
    const freelancers = await cursor.toArray();

    // Map data
    const mappedData = freelancers.map((user: any) => ({
      id: user._id.toString(),
      name: user.name || user.username || user.fullname || "Unknown",
      email: user.email,
      role: user.job_title || user.skills || user.role || "Freelancer",
      location: user.location || user.address || user.city || "Jakarta, ID",
      status: user.status || "Active",
      rank: user.rank || "Classic",
      joinedDate: user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
      phone: user.phone || "",
      bio: user.bio || user.professionalExperience || "",
      website: user.website || "",
      portfolioUrl: user.portfolioUrl || "",
      // Convert /uploads/resumes/xxx.pdf to /api/uploads/resumes/xxx.pdf for Admin access
      resumeFileName: user.resumeFileName
        ? user.resumeFileName.replace("/uploads/resumes/", "/api/uploads/resumes/")
        : "",
      professionalExperience: user.professionalExperience || "",
    }));

    return NextResponse.json({
      success: true,
      data: mappedData,
    });
  } catch (error) {
    console.error("Error fetching active freelancers:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
