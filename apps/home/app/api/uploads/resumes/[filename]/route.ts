import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Path to the file in apps/join/public/uploads/resumes
    // process.cwd() in apps/home usually points to apps/home root
    // So we step out to apps/ and then into join/
    const filePath = path.join(
      process.cwd(),
      "../join/public/uploads/resumes",
      filename
    );

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "File not found" },
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
