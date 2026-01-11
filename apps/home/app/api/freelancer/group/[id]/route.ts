import { NextResponse } from "next/server";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../../lib/db/astradb";

export const dynamic = "force-dynamic";

/**
 * GET /api/freelancer/group/[id]
 * Get group details by ID for invitation page
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;

    if (!groupId) {
      return NextResponse.json(
        { success: false, error: "Group ID is required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace(ASTRA_KEYSPACES.FREELANCER, "group_freelancer") as any;

    // Find group by ID
    let group = await collection.findOne({ _id: groupId });
    
    if (!group) {
      // Try with ObjectId format
      try {
        const { ObjectId } = require("mongodb");
        if (ObjectId.isValid(groupId)) {
          group = await collection.findOne({ _id: new ObjectId(groupId) });
        }
      } catch (e) {
        // ignore
      }
    }

    if (!group) {
      return NextResponse.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }

    // Get owner details
    const freelancerCollection = db.getCollectionFromKeyspace(ASTRA_KEYSPACES.FREELANCER, "data_freelancer") as any;
    
    let ownerDetails = null;
    try {
      let owner = await freelancerCollection.findOne({ _id: group.ownerId });
      if (!owner) {
        const { ObjectId } = require("mongodb");
        if (ObjectId.isValid(group.ownerId)) {
          owner = await freelancerCollection.findOne({ _id: new ObjectId(group.ownerId) });
        }
      }
      
      if (owner) {
        ownerDetails = {
          id: group.ownerId,
          name: owner.username || owner.name || owner.fullname || "Unknown",
          avatar: owner.profile_image || owner.photo_url || null,
        };
      }
    } catch (e) {
      console.error("Failed to fetch owner details", e);
    }

    // Calculate member count
    const memberCount = (group.members || []).length + 1; // +1 for owner

    return NextResponse.json({
      success: true,
      data: {
        id: group._id.toString(),
        name: group.name,
        icon: group.icon || null,
        ownerId: group.ownerId,
        ownerName: ownerDetails?.name || "Unknown",
        ownerAvatar: ownerDetails?.avatar || null,
        memberCount,
        maxMembers: group.maxMembers || 5,
        createdAt: group.createdAt,
      },
    });

  } catch (error) {
    console.error("Get group error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
