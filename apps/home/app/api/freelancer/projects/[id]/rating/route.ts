import { NextResponse } from "next/server";
import { getMongoDB } from "../../../../../lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }

    const db = getMongoDB();
    const collection = await db.getCollection("rating_job");
    
    // Find rating by projectId
    const rating = await collection.findOne({ projectId: id });

    if (!rating) {
        return NextResponse.json({ success: false, error: "Rating not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
         score: rating.score,
         review: rating.review,
         date: rating.createdAt ? new Date(rating.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
         // Include whatever else is needed
      },
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
