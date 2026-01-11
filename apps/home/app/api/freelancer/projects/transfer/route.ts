import { NextResponse } from "next/server";
import { getMongoDB } from "../../../../lib/db/mongodb";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../../lib/db/astradb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/**
 * POST /api/freelancer/projects/transfer
 * Transfer a project to a group
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, freelancerId, groupId } = body;

    if (!projectId || !freelancerId) {
      return NextResponse.json(
        { success: false, error: "Project ID and Freelancer ID are required" },
        { status: 400 }
      );
    }

    // Get MongoDB connection for job-freelancer
    const mongoDB = getMongoDB();
    const projectCollection = await mongoDB.getCollection("job-freelancer");

    // Find the project
    let project;
    try {
      project = await projectCollection.findOne({ 
        _id: new ObjectId(projectId),
        freelancerId: freelancerId 
      });
    } catch (e) {
      // Try with string ID
      project = await projectCollection.findOne({ 
        _id: projectId,
        freelancerId: freelancerId 
      });
    }

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found or you don't own this project" },
        { status: 404 }
      );
    }

    // Check project status - only "Process" or "In Progress" can be transferred
    const status = (project.status || "").toLowerCase();
    if (status !== "process" && status !== "in progress") {
      return NextResponse.json(
        { success: false, error: "Only in-progress projects can be transferred" },
        { status: 400 }
      );
    }

    // Get AstraDB for group data
    const astraDB = getAstraDB();
    const groupCollection = astraDB.getCollectionFromKeyspace(
      ASTRA_KEYSPACES.FREELANCER,
      "group_freelancer"
    ) as any;

    // If groupId is provided, use it. Otherwise find the user's group
    let group;
    if (groupId) {
      group = await groupCollection.findOne({ _id: groupId });
      if (!group) {
        try {
          group = await groupCollection.findOne({ _id: new ObjectId(groupId) });
        } catch (e) {}
      }
    } else {
      // Find user's group (as owner or member)
      group = await groupCollection.findOne({ ownerId: freelancerId });
      if (!group) {
        group = await groupCollection.findOne({ members: freelancerId });
      }
    }

    if (!group) {
      return NextResponse.json(
        { success: false, error: "You are not part of any group. Please create or join a group first." },
        { status: 400 }
      );
    }

    // Get freelancer details from AstraDB
    const freelancerCollection = astraDB.getCollectionFromKeyspace(
      ASTRA_KEYSPACES.FREELANCER,
      "data_freelancer"
    ) as any;

    let freelancer = await freelancerCollection.findOne({ _id: freelancerId });
    if (!freelancer) {
      try {
        freelancer = await freelancerCollection.findOne({ _id: new ObjectId(freelancerId) });
      } catch (e) {}
    }

    const freelancerName = freelancer?.username || freelancer?.name || freelancer?.fullname || "Freelancer";

    // Build the new assignee info
    const groupAssignee = {
      freelancerId: freelancerId,
      freelancerName: freelancerName,
      groupId: group._id.toString(),
      groupName: group.name,
      isGroupProject: true,
      transferredAt: new Date().toISOString(),
      // Include all group member IDs for access control
      groupMembers: [group.ownerId, ...(group.members || [])],
    };

    // Update the project
    const updateResult = await projectCollection.updateOne(
      { _id: project._id },
      {
        $set: {
          groupAssignee: groupAssignee,
          // Update the display name that will show in UMKM dashboard
          freelancerDisplay: `${freelancerName} + ${group.name}`,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to transfer project" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Project successfully transferred to ${group.name}`,
      data: {
        projectId: project._id.toString(),
        groupId: group._id.toString(),
        groupName: group.name,
        freelancerDisplay: `${freelancerName} + ${group.name}`,
      },
    });
  } catch (error) {
    console.error("Transfer project error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/freelancer/projects/transfer
 * Revoke group transfer and return project to individual freelancer
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { projectId, freelancerId } = body;

    if (!projectId || !freelancerId) {
      return NextResponse.json(
        { success: false, error: "Project ID and Freelancer ID are required" },
        { status: 400 }
      );
    }

    const mongoDB = getMongoDB();
    const projectCollection = await mongoDB.getCollection("job-freelancer");

    // Find the project
    let project;
    try {
      project = await projectCollection.findOne({
        _id: new ObjectId(projectId),
        freelancerId: freelancerId,
      });
    } catch (e) {
      project = await projectCollection.findOne({
        _id: projectId,
        freelancerId: freelancerId,
      });
    }

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found or you don't own this project" },
        { status: 404 }
      );
    }

    if (!project.groupAssignee) {
      return NextResponse.json(
        { success: false, error: "This project is not assigned to a group" },
        { status: 400 }
      );
    }

    // Get freelancer name for display
    const astraDB = getAstraDB();
    const freelancerCollection = astraDB.getCollectionFromKeyspace(
      ASTRA_KEYSPACES.FREELANCER,
      "data_freelancer"
    ) as any;

    let freelancer = await freelancerCollection.findOne({ _id: freelancerId });
    if (!freelancer) {
      try {
        freelancer = await freelancerCollection.findOne({ _id: new ObjectId(freelancerId) });
      } catch (e) {}
    }

    const freelancerName = freelancer?.username || freelancer?.name || freelancer?.fullname || "Freelancer";

    // Remove group assignment
    await projectCollection.updateOne(
      { _id: project._id },
      {
        $unset: { groupAssignee: "" },
        $set: { freelancerDisplay: freelancerName },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Project transferred back to individual",
      data: {
        projectId: project._id.toString(),
        freelancerDisplay: freelancerName,
      },
    });
  } catch (error) {
    console.error("Revoke transfer error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
