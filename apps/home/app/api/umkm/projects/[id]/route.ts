import { NextResponse } from "next/server";
import { getMongoDB } from "../../../../lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid Project ID" },
        { status: 400 }
      );
    }
    const db = getMongoDB();
    const collection = await db.getCollection("job-freelancer");
    const project = await collection.findOne({ _id: new ObjectId(id) });
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }
    // Compose response for UMKM dashboard
    return NextResponse.json({
      success: true,
      data: {
        id: project._id.toString(),
        name: project.jobTitle || "Untitled Project",
        client:
          project.name ||
          project.umkmName ||
          project.client ||
          "Unknown Client",
        clientEmail:
          project.email || project.umkmEmail || project.clientEmail || "",
        freelancer:
          project.freelancerDisplay ||
          project.selectedFreelancer?.name ||
          project.selectedFreelancer?.freelancerName ||
          project.freelancerName ||
          "Not assigned",
        freelancerId:
          project.selectedFreelancer?._id?.toString() ||
          project.selectedFreelancer?.id ||
          project.selectedFreelancer?.freelancerId ||
          project.freelancerId ||
          "",
        status: project.status,
        budgetFrom: project.budgetFrom || null,
        budgetTo: project.budgetTo || null,
        amount:
          project.budgetFrom && project.budgetTo
            ? `Rp ${Number(project.budgetFrom).toLocaleString("id-ID")} - Rp ${Number(project.budgetTo).toLocaleString("id-ID")}`
            : project.amount || project.budget || "0",
        date: project.deadlineDate || project.deadline || project.date || "",
        dueTime: project.dueTime || "",
        description: project.projectDescription || project.description || "",
        skills: project.skills || "",
        additionalRequirements: project.additionalRequirements || "",
        assignedDate: project.assignedDate || project.createdAt || "",
        deadlineDuration: project.deadlineDuration || project.dueTime || "",
        progress: project.progress || 0,
        rating: project.rating || null,
        review: project.review || "",
        completedAt:
          project.completedAt || project.submission?.submittedAt || null,
        submission: project.submission
          ? {
              link: project.submission.link || "",
              file: project.submission.file || "",
              fileName: project.submission.fileName || "",
              note: project.submission.note || "",
              submittedAt: project.submission.submittedAt || null,
            }
          : null,
        uploadDocument: project.uploadDocument || null,
        isGroupProject: !!project.groupAssignee,
        groupName: project.groupAssignee?.groupName || null,
      },
    });
  } catch (error) {
    console.error("Error fetching project detail for UMKM:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
