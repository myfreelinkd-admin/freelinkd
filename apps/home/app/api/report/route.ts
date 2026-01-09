import { getAstraDB } from "@/app/lib/db";
import { NextResponse } from "next/server";

interface MongoLikeCollection {
  insertOne(doc: unknown): Promise<unknown>;
}

export async function POST(req: Request) {
  // Debug: Log environment check
  console.log("=== Report API Debug ===");
  console.log("ASTRA_DB_APPLICATION_TOKEN exists:", !!process.env.ASTRA_DB_APPLICATION_TOKEN);
  console.log("ASTRA_DB_API_ENDPOINT exists:", !!process.env.ASTRA_DB_API_ENDPOINT);
  
  try {
    const body = await req.json();
    const { fullName, email, description } = body;
    console.log("Request body received:", { fullName, email, descriptionLength: description?.length });

    // Basic server-side validation
    if (!fullName || !email || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get AstraDB client with proper error handling
    let dbClient;
    try {
      console.log("Getting AstraDB client...");
      dbClient = getAstraDB();
      console.log("AstraDB client obtained successfully");
    } catch (configError) {
      console.error("AstraDB Configuration Error:", configError);
      const errorMsg = configError instanceof Error ? configError.message : "Unknown config error";
      return NextResponse.json(
        { error: `Database configuration error: ${errorMsg}` },
        { status: 500 }
      );
    }

    // Use the 'report' keyspace and 'report' collection
    console.log("Getting report database and collection...");
    const reportDB = dbClient.getReportDB();
    const collection = reportDB.collection("report") as unknown as MongoLikeCollection;
    console.log("Collection obtained successfully");

    try {
      console.log("Inserting document...");
      const result = await collection.insertOne({
        fullName,
        email,
        description,
        createdAt: new Date(),
        status: "new",
      });
      console.log("Insert result:", result);
    } catch (dbError) {
      console.error("Database Insert Error:", dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : "Unknown database error";
      return NextResponse.json(
        { error: `Failed to save report: ${errorMessage}` },
        { status: 500 }
      );
    }

    console.log("Report saved successfully!");
    return NextResponse.json({
      success: true,
      message: "Report saved successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

