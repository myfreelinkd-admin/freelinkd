import { NextResponse } from "next/server";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../../lib/db/astradb";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Freelancer ID is required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    
    // Try to find in data_freelancer (approved) first
    let collection = db.getCollectionFromKeyspace(ASTRA_KEYSPACES.FREELANCER, "data_freelancer") as any;
    let freelancer = await collection.findOne({ _id: id });
    
    // If not found, try freelancer_form (pending)
    if (!freelancer) {
      collection = db.getCollectionFromKeyspace(ASTRA_KEYSPACES.FREELANCER, "freelancer_form") as any;
      freelancer = await collection.findOne({ _id: id });
    }

    if (!freelancer) {
      return NextResponse.json(
        { success: false, message: "Freelancer not found" },
        { status: 404 }
      );
    }

    // Check if resume data exists (base64)
    if (!freelancer.resumeData) {
      // Fallback: Check if there's a resumeFileName path (old format)
      if (freelancer.resumeFileName) {
        // Return redirect info for old format - will need manual migration
        return NextResponse.json(
          { 
            success: false, 
            message: "Resume stored in old format. Please re-upload.",
            legacyPath: freelancer.resumeFileName
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: "No resume found for this freelancer" },
        { status: 404 }
      );
    }

    // Parse the base64 data URL
    const resumeData = freelancer.resumeData as string;
    const matches = resumeData.match(/^data:([^;]+);base64,(.+)$/);
    
    if (!matches) {
      return NextResponse.json(
        { success: false, message: "Invalid resume data format" },
        { status: 500 }
      );
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Get filename from resumeFileName or generate one
    const fileName = freelancer.resumeFileName 
      ? freelancer.resumeFileName.split('/').pop() 
      : `resume-${freelancer.name || 'freelancer'}.pdf`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });

  } catch (error) {
    console.error("Error serving resume:", error);
    return NextResponse.json(
      { success: false, message: "Error serving resume" },
      { status: 500 }
    );
  }
}
