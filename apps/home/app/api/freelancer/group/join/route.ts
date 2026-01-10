import { NextResponse } from "next/server";
import { getAstraDB } from "../../../../lib/db/astradb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { groupId, freelancerId } = body;

    if (!groupId || !freelancerId) {
      return NextResponse.json(
        { success: false, error: "Group ID and Freelancer ID are required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("freelancer", "group_freelancer") as any;

    // 1. Check if user is already in a group (owner or member)
    const existingGroup = await collection.findOne({
      $or: [
        { ownerId: freelancerId },
        { members: freelancerId }
      ]
    });

    if (existingGroup) {
      return NextResponse.json(
        { success: false, error: "You are already in a group. You must leave your current group to join a new one." },
        { status: 400 }
      );
    }

    // 2. Find the target group
    let targetGroup = await collection.findOne({ _id: groupId });
    if (!targetGroup) {
        // Try with ObjectId
         if (ObjectId.isValid(groupId)) {
            targetGroup = await collection.findOne({ _id: new ObjectId(groupId) });
         }
    }

    if (!targetGroup) {
      return NextResponse.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }

    // 3. Check if group is full
    const currentMemberCount = (targetGroup.members || []).length + 1; // +1 for owner
    if (currentMemberCount >= (targetGroup.maxMembers || 5)) {
       return NextResponse.json(
        { success: false, error: "Group is full" },
        { status: 400 }
      );
    }

    // 4. Add user to group
    await collection.updateOne(
      { _id: targetGroup._id },
      { $addToSet: { members: freelancerId } } // Use $addToSet to prevent duplicates just in case
    );

    return NextResponse.json({
      success: true,
      message: "Joined group successfully",
    });

  } catch (error) {
    console.error("Join group error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
