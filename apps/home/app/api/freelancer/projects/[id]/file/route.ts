import { NextResponse } from "next/server";
import { getMongoDB } from "../../../../../lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return new NextResponse("Invalid Project ID", { status: 400 });
    }

    const db = getMongoDB();
    const collection = await db.getCollection("job-freelancer");
    const project = await collection.findOne({ _id: new ObjectId(id) });

    if (!project || !project.submission || !project.submission.fileData) {
      return new NextResponse("File not found", { status: 404 });
    }

    const base64Data = project.submission.fileData;
    // Format usually: data:image/png;base64,.....
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return new NextResponse("Invalid file data", { status: 500 });
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const fileName = project.submission.fileName || "download";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
