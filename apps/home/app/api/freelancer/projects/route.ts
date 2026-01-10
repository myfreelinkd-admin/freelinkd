import { NextResponse } from "next/server";
import { getMongoDB } from "../../../lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const freelancerId = searchParams.get("freelancerId");
    const status = searchParams.get("status");

    // Construct query
    const query: any = {};
    if (freelancerId) {
        // Assuming freelancerId field exists or mapped
        query.freelancerId = freelancerId;
    }
    
    // Status mapping: frontend "Process", "Complete", "Canceled" to DB values if they differ
    // Assuming DB values are lowercase or match. Let's make it case-insensitive regex or specific
    if (status) {
        if (status === "Process") query.status = { $in: ["Process", "process", "In Progress"] };
        else if (status === "Complete") query.status = { $in: ["Complete", "complete", "Completed"] };
        else if (status === "Canceled") query.status = { $in: ["Canceled", "canceled", "Cancelled"] };
        else query.status = status;
    }

    const db = getMongoDB();
    const collection = await db.getCollection("job-freelancer");

    // Fetch projects
    const projects = await collection.find(query).toArray();

    // Fetch ratings for completed projects if needed, or do it on demand?
    // User asked for ratings in modal, so maybe just fetching basic info here is fine.
    // However, for "Complete" projects list, we show rating score.
    // Let's modify the response to include rating lookup if possible, or assume it's in the job document.
    // If rating is in separate `rating_job` collection, we might need to join/lookup.
    
    // Quick lookup for ratings
    const projectIds = projects.map(p => p._id);
    let ratingsMap: Record<string, any> = {};
    
    if (projects.length > 0) {
        const ratingCollection = await db.getCollection("rating_job");
        // Assuming rating_job has projectId field
        // Note: _id in mongo is objectId usually.
        const ratings = await ratingCollection.find({ projectId: { $in: projectIds.map(id => id.toString()) } }).toArray();
        ratings.forEach(r => {
            if (r.projectId) ratingsMap[r.projectId] = r;
        });
    }

    // Map to frontend format
    const formattedProjects = projects.map((p: any) => {
        const ratingDoc = ratingsMap[p._id.toString()];
        return {
            id: p._id.toString(),
            name: p.name || p.title || "Untitled Project",
            client: p.client || p.client_name || "Unknown Client",
            // Use different date fields based on status preference or available data
            date: p.date || p.deadline || p.end_date ? new Date(p.date || p.deadline || p.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A",
            // For canceled: canceledDate... logic can be handled in frontend mapping or here
            canceledDate: p.canceledDate ? new Date(p.canceledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
            amount: p.amount || p.budget || "Rp 0",
            status: p.status, // Keep original or normalize
            progress: p.progress || 0,
            reason: p.reason || "", // For canceled
            rating: ratingDoc ? ratingDoc.score : (p.rating || 0),
            review: ratingDoc ? ratingDoc.review : (p.review || ""),
            // Detail fields
            description: p.description || "",
            clientEmail: p.client_email || "",
            assignedDate: p.assignedDate ? new Date(p.assignedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A",
            deadlineDuration: p.duration || "N/A"
        };
    });

    return NextResponse.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
