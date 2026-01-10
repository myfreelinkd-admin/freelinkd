import { NextResponse } from "next/server";
import { getAstraDB } from "../../../lib/db/astradb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    // const limit = parseInt(searchParams.get("limit") || "10");

    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("freelancer", "data_freelancer") as any;

    let filter = {};
    if (query) {
        // Simple regex-like search if supported, otherwise fetch all and filter in memory (not ideal for large datasets but ok for now)
        // AstraDB data API might support $regex or similar depending on gateway.
        // For safety/simplicity with standard JSON API, we might fetch a chunk and filter.
        // Or if we can use $or.
        // Let's assume we fetch all for now or a larger limit and filter in memory since we don't have huge data yet.
    }

    // Fetching fields only if projection is supported.
    const users = await collection.find({}).toArray();

    const filteredUsers = users.filter((u: any) => {
        const name = u.username || u.name || u.fullname || "";
        const role = Array.isArray(u.skills) ? u.skills.join(" ") : (u.skills || "");
        
        if (!query) return true;
        const lowerQuery = query.toLowerCase();
        return name.toLowerCase().includes(lowerQuery) || role.toLowerCase().includes(lowerQuery);
    }).map((u: any) => ({
        id: u._id.toString(),
        name: u.username || u.name || u.fullname || "Freelancer",
        role: Array.isArray(u.skills) ? u.skills[0] : (u.skills ? u.skills.split(",")[0] : "Freelancer"),
        avatar: u.profile_image || u.photo_url || null
    }));
    
    // Limit results
    const limitedUsers = filteredUsers.slice(0, 20);

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
