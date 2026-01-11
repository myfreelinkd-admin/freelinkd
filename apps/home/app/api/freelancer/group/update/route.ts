import { NextResponse } from "next/server";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../../lib/db/astradb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/**
 * PUT /api/freelancer/group/update
 * Update group details (name, maxMembers, skills, icon)
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { groupId, name, maxMembers, skills, icon } = body;

    if (!groupId) {
      return NextResponse.json(
        { success: false, error: "Group ID is required" },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Group name is required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace(
      ASTRA_KEYSPACES.FREELANCER,
      "group_freelancer"
    ) as any;

    // Find the group
    let group = await collection.findOne({ _id: groupId });
    if (!group && ObjectId.isValid(groupId)) {
      group = await collection.findOne({ _id: new ObjectId(groupId) });
    }

    if (!group) {
      return NextResponse.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }

    // Validate maxMembers
    const currentMemberCount = (group.members || []).length + 1;
    const newMaxMembers = maxMembers || group.maxMembers || 5;

    if (newMaxMembers < currentMemberCount) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot set max members to ${newMaxMembers}. Group currently has ${currentMemberCount} members.`,
        },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {
      name: name.trim(),
      maxMembers: newMaxMembers,
      updatedAt: new Date().toISOString(),
    };

    if (skills && Array.isArray(skills)) {
      updateData.skills = skills.slice(0, 10); // Max 10 skills
    }

    if (icon) {
      updateData.icon = icon;
    }

    // Update the group
    await collection.updateOne({ _id: group._id }, { $set: updateData });

    return NextResponse.json({
      success: true,
      message: "Group updated successfully",
      data: {
        id: group._id.toString(),
        ...updateData,
      },
    });
  } catch (error) {
    console.error("Update group error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
