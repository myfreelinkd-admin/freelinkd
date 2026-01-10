import { NextResponse } from "next/server";
import { getAstraDB } from "../../../lib/db/astradb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const freelancerId = searchParams.get("freelancerId");

    if (!freelancerId) {
      return NextResponse.json(
        { success: false, error: "Freelancer ID is required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("freelancer", "group_freelancer") as any;

    // Find group where freelancer is owner OR member
    // Note: AstraDB data API filtering capabilities might be limited compared to MongoDB.
    // We try to find where ownerId is freelancerId OR members array contains freelancerId.
    // If complex OR queries are not supported, we might need to do two queries or rely on app logic.
    // For now, let's try a strict find.
    
    // Check if owner
    let group = await collection.findOne({ ownerId: freelancerId });
    
    if (!group) {
        // Check if member
        group = await collection.findOne({ members: freelancerId });
    }

    if (!group) {
      return NextResponse.json({ success: true, data: null });
    }

    // Map _id
    group.id = group._id.toString();

    // Enrich with member details
    const memberIds = [group.ownerId, ...(group.members || [])];
    const uniqueIds = [...new Set(memberIds)];

    const userDetails: any[] = [];
    
    // Fetch user details for each ID
    // Note: ideally use $in query if supported
    const freelancerCollection = db.getCollectionFromKeyspace("freelancer", "data_freelancer") as any;
    
    for (const uid of uniqueIds) {
         try {
             let user = await freelancerCollection.findOne({ _id: uid });
             if (!user) {
                  // try objectId
                  const { ObjectId } = require("mongodb");
                  if (ObjectId.isValid(uid)) {
                       user = await freelancerCollection.findOne({ _id: new ObjectId(uid) });
                  }
             }
             
             if (user) {
                 userDetails.push({
                     id: uid,
                     name: user.username || user.name || user.fullname || "Unknown",
                     role: Array.isArray(user.skills) ? user.skills[0] : (user.skills ? user.skills.split(",")[0] : "Freelancer"),
                     avatar: user.profile_image || user.photo_url || null
                 });
             }
         } catch (e) {
             console.error(`Failed to fetch details for user ${uid}`, e);
         }
    }

    // Attach details to group object
    group.ownerDetails = userDetails.find((u: any) => u.id === group.ownerId) || { id: group.ownerId, name: "Unknown" };
    group.memberDetails = (group.members || []).map((mid: string) => userDetails.find((u: any) => u.id === mid) || { id: mid, name: "Unknown" });
    
    // Also include self in member details for UI convenience if needed, or keep separate
    // The UI likely iterates over all participants.

    return NextResponse.json({
      success: true,
      data: group,
    });

  } catch (error) {
    console.error("Group fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, ownerId, members, maxMembers, icon } = body;

    if (!name || !ownerId) {
      return NextResponse.json(
        { success: false, error: "Name and Owner ID are required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("freelancer", "group_freelancer") as any;

    // Check if user already has a group
    let existingGroup = await collection.findOne({ ownerId: ownerId });
    if (!existingGroup) {
        existingGroup = await collection.findOne({ members: ownerId });
    }

    if (existingGroup) {
      return NextResponse.json(
        { success: false, error: "Freelancer is already in a group" },
        { status: 400 }
      );
    }

    const newGroup = {
      name,
      ownerId,
      members: members || [], // Array of freelancer IDs
      maxMembers: maxMembers || 5,
      icon: icon || null,
      createdAt: new Date(),
    };

// ... existing code

    await collection.insertOne(newGroup);

    return NextResponse.json({
      success: true,
      message: "Group created successfully",
      data: newGroup,
    });

  } catch (error) {
    console.error("Group creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { freelancerId } = body;

    if (!freelancerId) {
      return NextResponse.json(
        { success: false, error: "Freelancer ID is required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("freelancer", "group_freelancer") as any;

    // Find group
    let group = await collection.findOne({ ownerId: freelancerId });
    if (group) {
        // User is owner, delete group
        await collection.deleteOne({ _id: group._id });
        return NextResponse.json({ success: true, message: "Group deleted successfully" });
    }

    group = await collection.findOne({ members: freelancerId });
    if (group) {
        // User is member, remove from members
        const newMembers = (group.members || []).filter((id: string) => id !== freelancerId);
        await collection.updateOne(
            { _id: group._id },
            { $set: { members: newMembers } }
        );
        return NextResponse.json({ success: true, message: "Left group successfully" });
    }

    return NextResponse.json(
      { success: false, error: "Group not found or user not in group" },
      { status: 404 }
    );

  } catch (error) {
     console.error("Leave group error:", error);
     return NextResponse.json(
       { success: false, error: "Internal server error" },
       { status: 500 }
     );
  }
}
