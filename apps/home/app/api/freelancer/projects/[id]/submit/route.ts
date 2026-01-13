import { NextResponse } from "next/server";
import { getMongoDB } from "../../../../../lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const { link, file, fileName, note } = body;

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid Project ID" },
        { status: 400 }
      );
    }

    const db = getMongoDB();
    const collection = await db.getCollection("job-freelancer");

    const updateData: any = {
      updatedAt: new Date(),
      status: "Completed",
      progress: 100,
      submission: {
        link: link || "",
        file: file ? `/api/freelancer/projects/${id}/file` : "",
        fileData: file || "",
        fileName: fileName || "",
        note: note || "",
        submittedAt: new Date(),
      },
    };

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
      message: "Assignment submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
