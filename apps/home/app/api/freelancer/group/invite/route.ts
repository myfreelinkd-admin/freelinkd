import { NextResponse } from "next/server";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../../lib/db/astradb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/**
 * POST /api/freelancer/group/invite
 * Directly add freelancers to a group (owner inviting people)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { groupId, freelancerIds } = body;

    if (!groupId) {
      return NextResponse.json(
        { success: false, error: "Group ID is required" },
        { status: 400 }
      );
    }

    if (!freelancerIds || !Array.isArray(freelancerIds) || freelancerIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one freelancer ID is required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    const groupCollection = db.getCollectionFromKeyspace(
      ASTRA_KEYSPACES.FREELANCER,
      "group_freelancer"
    ) as any;

    // Find the group
    let group = await groupCollection.findOne({ _id: groupId });
    if (!group && ObjectId.isValid(groupId)) {
      group = await groupCollection.findOne({ _id: new ObjectId(groupId) });
    }

    if (!group) {
      return NextResponse.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }

    // Check capacity
    const currentMembers = group.members || [];
    const currentMemberCount = currentMembers.length + 1; // +1 for owner
    const maxMembers = group.maxMembers || 5;
    const availableSlots = maxMembers - currentMemberCount;

    if (availableSlots <= 0) {
      return NextResponse.json(
        { success: false, error: "Group is full" },
        { status: 400 }
      );
    }

    // Filter out freelancers who are already in a group
    const validFreelancerIds: string[] = [];
    const alreadyInGroup: string[] = [];
    const alreadyMember: string[] = [];

    for (const freelancerId of freelancerIds) {
      // Check if already a member of THIS group
      if (currentMembers.includes(freelancerId) || group.ownerId === freelancerId) {
        alreadyMember.push(freelancerId);
        continue;
      }

      // Check if already in ANY group
      const existingGroup = await groupCollection.findOne({
        $or: [
          { ownerId: freelancerId },
          { members: freelancerId }
        ]
      });

      if (existingGroup) {
        alreadyInGroup.push(freelancerId);
        continue;
      }

      validFreelancerIds.push(freelancerId);
    }

    // Limit to available slots
    const freelancersToAdd = validFreelancerIds.slice(0, availableSlots);

    if (freelancersToAdd.length === 0) {
      let errorMessage = "No freelancers could be added. ";
      if (alreadyMember.length > 0) {
        errorMessage += `${alreadyMember.length} are already members. `;
      }
      if (alreadyInGroup.length > 0) {
        errorMessage += `${alreadyInGroup.length} are already in other groups.`;
      }
      return NextResponse.json(
        { success: false, error: errorMessage.trim() },
        { status: 400 }
      );
    }

    // Add freelancers to the group
    await groupCollection.updateOne(
      { _id: group._id },
      { $addToSet: { members: { $each: freelancersToAdd } } }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully added ${freelancersToAdd.length} freelancer(s) to the group`,
      data: {
        added: freelancersToAdd.length,
        skippedAlreadyMember: alreadyMember.length,
        skippedInOtherGroup: alreadyInGroup.length,
      },
    });
  } catch (error) {
    console.error("Invite to group error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
