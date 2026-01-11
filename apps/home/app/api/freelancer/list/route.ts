import { NextResponse } from "next/server";
import { getAstraDB } from "../../../lib/db/astradb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("freelancer", "data_freelancer") as any;

    // Fetching all and filtering in memory for simplicity
    const users = await collection.find({}).toArray();

    const filteredUsers = users.filter((u: any) => {
        const name = u.username || u.name || u.fullname || "";
        const email = u.email || "";
        const role = Array.isArray(u.skills) ? u.skills.join(" ") : (u.skills || "");
        
        if (!query) return true;
        const lowerQuery = query.toLowerCase();
        return (
          name.toLowerCase().includes(lowerQuery) ||
          email.toLowerCase().includes(lowerQuery) ||
          role.toLowerCase().includes(lowerQuery)
        );
    }).map((u: any) => ({
        id: u._id.toString(),
        name: u.username || u.name || u.fullname || "Freelancer",
        email: u.email || "",
        role: Array.isArray(u.skills) ? u.skills[0] : (u.skills ? u.skills.split(",")[0] : "Freelancer"),
        skills: Array.isArray(u.skills) ? u.skills : (u.skills ? u.skills.split(",").map((s: string) => s.trim()) : []),
        avatar: u.profile_image || u.photo_url || null
    }));
    
    // Limit results
    const limitedUsers = filteredUsers.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedUsers,
    });

  } catch (error) {
    console.error("Freelancer list fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
