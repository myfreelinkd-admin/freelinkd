import { NextResponse } from "next/server";
import { getMongoDB } from "@/app/lib/db/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

interface JobFreelancerData {
  _id?: ObjectId | string;
  jobTitle: string;
  email: string;
  selectedFreelancer?: {
    name: string;
  };
  status: string;
  createdAt: string | Date;
  budgetFrom: string;
  budgetTo: string;
  // Group assignment fields
  groupAssignee?: {
    freelancerId: string;
    freelancerName: string;
    groupId: string;
    groupName: string;
    isGroupProject: boolean;
  };
  freelancerDisplay?: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const mongo = getMongoDB();
    const db = await mongo.getDatabase();
    const collection = db.collection<JobFreelancerData>("job-freelancer");

    // Fetch jobs for this email
    const jobs = await collection
      .find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .toArray();

    // Map to project format
    const projects = jobs.map((job) => {
      let statusMap = "Pending";
      const lowerStatus = (job.status || "").toLowerCase();

      if (
        lowerStatus === "completed" ||
        lowerStatus === "complete" ||
        lowerStatus === "done"
      ) {
        statusMap = "Completed";
      } else if (
        [
          "in-progress",
          "process",
          "progress",
          "in progress",
          "active",
        ].includes(lowerStatus)
      ) {
        statusMap = "In Progress";
      } else if (["cancelled", "canceled", "cancel"].includes(lowerStatus)) {
        statusMap = "Cancelled";
      } else if (lowerStatus === "pending") {
        statusMap = "Pending";
      } else {
        statusMap = job.status || "Pending";
      }

      const date = new Date(job.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      // Handle _id safely
      const idString = job._id ? job._id.toString() : Math.random().toString();

      // Determine freelancer display name
      // If freelancerDisplay exists (from transfer), use it
      // Otherwise use selectedFreelancer name
      const freelancerName =
        job.freelancerDisplay || job.selectedFreelancer?.name || "Not assigned";

      return {
        id: idString,
        name: job.jobTitle || "Untitled Project",
        freelancer: freelancerName,
        date: date,
        status: statusMap,
        amount:
          job.budgetFrom && job.budgetTo
            ? `Rp ${parseInt(job.budgetFrom).toLocaleString(
                "id-ID"
              )} - Rp ${parseInt(job.budgetTo).toLocaleString("id-ID")}`
            : `Rp ${parseInt(
                job.budgetTo || job.budgetFrom || "0"
              ).toLocaleString("id-ID")}`,
        // Additional group info for UI
        isGroupProject: !!job.groupAssignee,
        groupName: job.groupAssignee?.groupName || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
