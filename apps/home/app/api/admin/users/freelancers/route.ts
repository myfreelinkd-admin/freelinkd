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
      role: user.job_title || user.role || "Freelancer",
      location: user.location || user.city || "Jakarta, ID", // Default or fetched
      status: user.status || "Active",
      rank: user.rank || "Classic", // Default rank
      joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
      phone: user.phone || "",
      bio: user.bio || "",
      website: user.website || "",
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
