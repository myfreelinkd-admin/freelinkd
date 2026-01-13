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

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid Project ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { rating, review } = body;

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Invalid rating (1-5)" },
        { status: 400 }
      );
    }

    const db = getMongoDB();
    const jobCollection = await db.getCollection("job-freelancer");
    const ratingCollection = await db.getCollection("rating_job");

    const project = await jobCollection.findOne({ _id: new ObjectId(id) });
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    let freelancerId = project.freelancerId;
    if (!freelancerId && project.selectedFreelancer) {
      freelancerId =
        project.selectedFreelancer.freelancerId ||
        project.selectedFreelancer.id ||
        project.selectedFreelancer._id?.toString();
    }

    await ratingCollection.insertOne({
      projectId: new ObjectId(id),
      jobTitle: project.jobTitle || project.name,
      freelancerId:
        freelancerId && ObjectId.isValid(freelancerId)
          ? new ObjectId(freelancerId)
          : freelancerId,
      freelancerName:
        project.freelancerDisplay ||
        project.selectedFreelancer?.name ||
        project.freelancerName,
      umkmEmail: project.email || project.umkmEmail,
      rating: rating,
      review: review || "",
      createdAt: new Date(),
    });

    await jobCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          rating: rating,
          review: review || "",
          ratedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Rating submitted successfully to rating_job",
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
