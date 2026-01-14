import { NextRequest, NextResponse } from "next/server";
import { getMongoDB } from "@/app/lib/db";
import { ObjectId } from "mongodb";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;
    const body = await req.json();
    const { freelancerId, name, skills } = body;

    if (!freelancerId || !name) {
      return NextResponse.json(
        { success: false, message: "Missing freelancer information" },
        { status: 400 }
      );
    }

    const db = getMongoDB();
    const collection = await db.getCollection("job-freelancer");

    // Check if job exists and doesn't have a freelancer yet
    const query = {
      _id: new ObjectId(id),
      $or: [
        { selectedFreelancer: null },
        { selectedFreelancer: { $exists: false } },
      ],
    };

    const job = await collection.findOne(query);

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found or already assigned to a freelancer",
        },
        { status: 404 }
      );
    }

    // Update the job
    const update = {
      $set: {
        selectedFreelancer: {
          id: freelancerId,
          name: name,
          skills: skills || "",
          matchPercentage: 100, // Default to 100 or calculate if logic exists
        },
        freelancerId: freelancerId,
        status: "assigned", // Update status to assigned
        updatedAt: new Date(),
      },
    };

    const result = await collection.updateOne(query, update);

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to update job" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project accepted successfully",
    });
  } catch (error) {
    console.error("Error accepting project:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
