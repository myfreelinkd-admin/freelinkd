import { NextResponse } from "next/server";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../../lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/freelancer/reject
 * Reject a pending freelancer application
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { freelancerId, reason } = body;

    if (!freelancerId) {
      return NextResponse.json(
        { success: false, message: "Freelancer ID is required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    
    // Get freelancer form collection
    const formCollection = db.getCollectionFromKeyspace(
      ASTRA_KEYSPACES.FREELANCER,
      "freelancer_form"
    ) as any;

    const freelancerData = await formCollection.findOne({ _id: freelancerId });

    if (!freelancerData) {
      return NextResponse.json(
        { success: false, message: "Freelancer not found" },
        { status: 404 }
      );
    }

    // Update status to rejected
    await formCollection.updateOne(
      { _id: freelancerId },
      { 
        $set: { 
          status: "rejected",
          rejectionReason: reason || "",
          rejectedAt: new Date().toISOString()
        } 
      }
    );

    console.log(`❌ Freelancer ${freelancerData.email} has been rejected`);

    return NextResponse.json({
      success: true,
      message: "Freelancer rejected successfully",
      data: {
        freelancerId,
        email: freelancerData.email,
        name: freelancerData.name,
      },
    });

  } catch (error) {
    console.error("❌ Error rejecting freelancer:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
