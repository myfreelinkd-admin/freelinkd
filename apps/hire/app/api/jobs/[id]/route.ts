import { NextRequest, NextResponse } from "next/server";
import { MongoDBClientManager } from "@/app/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { JobFreelancerData } from "../route";

// GET: Get specific job by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid job ID format",
        },
        { status: 400 }
      );
    }

    // Get MongoDB instance
    const mongoManager = MongoDBClientManager.getInstance();
    const db = await mongoManager.getDatabase();
    const collection = db.collection<JobFreelancerData>("job-freelancer");

    // Find job
    const job = await collection.findOne({ _id: new ObjectId(id) });

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: job,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving job:", error);

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

// PATCH: Update job
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid job ID format",
        },
        { status: 400 }
      );
    }

    // Get MongoDB instance
    const mongoManager = MongoDBClientManager.getInstance();
    const db = await mongoManager.getDatabase();
    const collection = db.collection<JobFreelancerData>("job-freelancer");

    // Prepare update data (only include fields that are provided)
    const updateData: Partial<JobFreelancerData> = {
      updatedAt: new Date(),
    };

    // Only update fields that are provided
    if (body.status) updateData.status = body.status;
    if (body.selectedFreelancer)
      updateData.selectedFreelancer = body.selectedFreelancer;
    if (body.jobTitle) updateData.jobTitle = body.jobTitle;
    if (body.skills) updateData.skills = body.skills;
    if (body.projectDescription)
      updateData.projectDescription = body.projectDescription;
    if (body.additionalRequirements)
      updateData.additionalRequirements = body.additionalRequirements;
    if (body.dueTime) updateData.dueTime = body.dueTime;
    if (body.deadlineDate) updateData.deadlineDate = body.deadlineDate;
    if (body.budgetFrom) updateData.budgetFrom = body.budgetFrom;
    if (body.budgetTo) updateData.budgetTo = body.budgetTo;

    // Update job
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found",
        },
        { status: 404 }
      );
    }

    // Get updated job
    const updatedJob = await collection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      {
        success: true,
        message: "Job updated successfully",
        data: updatedJob,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job:", error);

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

// DELETE: Delete job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid job ID format",
        },
        { status: 400 }
      );
    }

    // Get MongoDB instance
    const mongoManager = MongoDBClientManager.getInstance();
    const db = await mongoManager.getDatabase();
    const collection = db.collection<JobFreelancerData>("job-freelancer");

    // Delete job
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Job not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting job:", error);

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
