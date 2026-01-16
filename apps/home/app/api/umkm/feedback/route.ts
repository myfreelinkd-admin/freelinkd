import { NextResponse } from "next/server";
import { getMongoDB } from "../../../lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, ratings, suggestion, freelancerId, umkmEmail } = body;

    if (!projectId || !ratings) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = getMongoDB();
    const feedbackCollection = await db.getCollection("feedback");

    const existingFeedback = await feedbackCollection.findOne({
      projectId: projectId,
    });

    if (existingFeedback) {
      return NextResponse.json(
        {
          success: false,
          error: "Feedback already submitted for this project",
        },
        { status: 400 }
      );
    }

    const feedbackData = {
      projectId,
      freelancerId: freelancerId
        ? ObjectId.isValid(freelancerId)
          ? new ObjectId(freelancerId)
          : freelancerId
        : null,
      umkmEmail,
      ratings: {
        deliverables: ratings[0],
        communication: ratings[1],
        timeliness: ratings[2],
        professionalism: ratings[3],
        matchQuality: ratings[4],
        hireAgain: ratings[5],
      },
      suggestion,
      createdAt: new Date(),
    };

    await feedbackCollection.insertOne(feedbackData);

    const projectCollection = await db.getCollection("job-freelancer");
    if (ObjectId.isValid(projectId)) {
      await projectCollection.updateOne(
        { _id: new ObjectId(projectId) },
        {
          $set: {
            isRated: true,
            rating: ratings[0],
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Missing projectId" },
        { status: 400 }
      );
    }

    const db = getMongoDB();
    const feedbackCollection = await db.getCollection("feedback");
    const feedback = await feedbackCollection.findOne({ projectId: projectId });

    if (!feedback) {
      return NextResponse.json({
        success: false,
        message: "No feedback found",
      });
    }

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
