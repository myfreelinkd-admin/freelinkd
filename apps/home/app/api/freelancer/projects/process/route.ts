import { NextResponse } from "next/server";
import { getMongoDB } from "../../../../lib/db/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const freelancerId = searchParams.get("freelancerId");
    // If freelancerId is needed for filtering, we can use it.
    // For now, adhering to user request "status = process"
    
    // Construct query
    const query: any = { status: "process" };
    
    // If we want to be safe and only show for specific freelancer (recommended)
    if (freelancerId) {
       // Assuming field name is freelancerId or similar. 
       // If usage is vague, we might omit it or try multiple keys.
       query.freelancerId = freelancerId;
    }

    // const { getMongoDB } = await import("../../../../../lib/db/mongodb"); // Redundant
    const db = getMongoDB();
    const collection = await db.getCollection("job-freelancer");

    // Fetch projects
    const projects = await collection.find(query).toArray();

    // Map to frontend format
    const formattedProjects = projects.map((p: any) => ({
        id: p._id.toString(),
        name: p.name || p.title || "Untitled Project",
        client: p.client || p.client_name || "Unknown Client",
        deadline: p.deadline || p.end_date ? new Date(p.deadline || p.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "No Deadline",
        progress: p.progress || 0,
        status: "In Progress" // Normalized for UI
    }));

    return NextResponse.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    console.error("Error fetching process projects:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
