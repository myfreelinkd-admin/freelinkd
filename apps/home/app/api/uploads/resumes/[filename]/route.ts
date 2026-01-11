import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { getAstraDB, ASTRA_KEYSPACES } from "../../../../lib/db/astradb";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // First, try to find the resume in AstraDB by filename
    try {
      const db = getAstraDB();
      
      // Search in both collections for the resume with this filename
      const collectionNames = ["data_freelancer", "freelancer_form"];

      for (const colName of collectionNames) {
        const collection = db.getCollectionFromKeyspace(ASTRA_KEYSPACES.FREELANCER, colName) as any;
        
        // Find by resumeFileName containing the filename
        const cursor = await collection.find({
          resumeFileName: { $regex: filename }
        });
        const results = await cursor.toArray();
        
        if (results.length > 0) {
          const freelancer = results[0];
          
          // Check if we have base64 data
          if (freelancer.resumeData) {
            const resumeData = freelancer.resumeData as string;
            const matches = resumeData.match(/^data:([^;]+);base64,(.+)$/);
            
            if (matches) {
              const contentType = matches[1];
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, "base64");

              return new NextResponse(buffer, {
                headers: {
                  "Content-Type": contentType,
                  "Content-Disposition": `inline; filename="${filename}"`,
                  "Cache-Control": "public, max-age=3600",
                },
              });
            }
          }
        }
      }
    } catch (dbError) {
      console.warn("Could not fetch from AstraDB, falling back to filesystem:", dbError);
    }

    // Fallback: Try to read from filesystem (for local development or old uploads)
    const filePath = path.join(
      process.cwd(),
      "../join/public/uploads/resumes",
      filename
    );

    if (!existsSync(filePath)) {
      // Also try from home app's public folder
      const homeFilePath = path.join(
        process.cwd(),
        "public/uploads/resumes",
        filename
      );
      
      if (existsSync(homeFilePath)) {
        const fileBuffer = await readFile(homeFilePath);
        const contentType = filename.endsWith(".pdf")
          ? "application/pdf"
          : "application/octet-stream";

        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename="${filename}"`,
          },
        });
      }

      return NextResponse.json(
        { success: false, message: "Resume not found. The file may need to be re-uploaded." },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);

    // Determine content type (default to PDF as it's for resumes)
    const contentType = filename.endsWith(".pdf")
      ? "application/pdf"
      : "application/octet-stream";

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { success: false, message: "Error serving file" },
      { status: 500 }
    );
  }
}

