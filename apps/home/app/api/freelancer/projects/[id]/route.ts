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

    return NextResponse.json({
      success: true,
      data: {
        id: project._id.toString(),
        name: project.jobTitle || "Untitled Project",
        status: project.status,
        client:
          project.name ||
          project.umkmName ||
          project.client ||
          "Unknown Client",
        clientEmail:
          project.email || project.umkmEmail || project.clientEmail || "",
        clientPhone: project.phone || "",
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
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    // Determine user intention from body
    // Although for now we just want to accept -> status: process
    let body;
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const { status, progress } = body;

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid Project ID" },
        { status: 400 }
      );
    }

    const db = getMongoDB();
    const collection = await db.getCollection("job-freelancer");

    // Construct update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;
    }
    if (progress !== undefined) {
      updateData.progress = Number(progress);
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id, ...updateData },
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
