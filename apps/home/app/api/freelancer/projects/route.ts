import { NextResponse } from "next/server";
import { getMongoDB } from "../../../lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const freelancerId = searchParams.get("freelancerId");
    const status = searchParams.get("status");

    const query: any = {};
    if (freelancerId) {
      query.freelancerId = freelancerId;
    }

    if (status) {
      if (status === "Process")
        query.status = { $in: ["Process", "process", "In Progress"] };
      else if (status === "Complete")
        query.status = {
          $in: ["Complete", "complete", "Completed", "Completed"],
        };
      else if (status === "Canceled")
        query.status = { $in: ["Canceled", "canceled", "Cancelled"] };
      else query.status = status;
    }

    const db = getMongoDB();
    const collection = await db.getCollection("job-freelancer");

    const projects = await collection.find(query).toArray();

    const projectIds = projects.map((p) => p._id);
    let ratingsMap: Record<string, any> = {};

    if (projects.length > 0) {
      const ratingCollection = await db.getCollection("rating_job");

      const ratings = await ratingCollection
        .find({ projectId: { $in: projectIds.map((id) => id.toString()) } })
        .toArray();
      ratings.forEach((r) => {
        if (r.projectId) ratingsMap[r.projectId] = r;
      });
    }

    const formattedProjects = projects.map((p: any) => {
      const ratingDoc = ratingsMap[p._id.toString()];
      // Format budget with range
      const budgetFrom = p.budgetFrom || null;
      const budgetTo = p.budgetTo || null;
      let amountStr = "N/A";
      if (budgetFrom && budgetTo) {
        amountStr = `Rp ${Number(budgetFrom).toLocaleString("id-ID")} - Rp ${Number(budgetTo).toLocaleString("id-ID")}`;
      } else if (budgetTo) {
        amountStr = `Rp ${Number(budgetTo).toLocaleString("id-ID")}`;
      } else if (budgetFrom) {
        amountStr = `Rp ${Number(budgetFrom).toLocaleString("id-ID")}`;
      }

      return {
        id: p._id.toString(),
        // Project Name -> jobTitle
        name: p.jobTitle || "Untitled Project",
        // Client Name -> name
        client: p.name || "Unknown Client",
        // Budget range
        budgetFrom: budgetFrom,
        budgetTo: budgetTo,
        // Date -> deadlineDate
        date: p.deadlineDate || "N/A",
        canceledDate: p.canceledDate
          ? new Date(p.canceledDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : null,
        amount: amountStr,
        status: p.status,
        progress: p.progress || 0,
        reason: p.reason || "",
        rating: ratingDoc ? ratingDoc.score : p.rating || 0,
        review: ratingDoc ? ratingDoc.review : p.review || "",
        // Description -> projectDescription
        description: p.projectDescription || "",
        // Client Email -> email
        clientEmail: p.email || "",
        assignedDate: p.assignedDate
          ? new Date(p.assignedDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "N/A",
        // Time/Duration -> dueTime
        deadlineDuration: p.dueTime || "N/A",
        // Group assignment info
        groupAssignee: p.groupAssignee || null,
        freelancerDisplay: p.freelancerDisplay || null,
        isGroupProject: !!p.groupAssignee,
        uploadDocument: p.uploadDocument || null,
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
