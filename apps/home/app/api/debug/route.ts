import { getAstraDB } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const debug = {
    envCheck: {
      ASTRA_DB_APPLICATION_TOKEN: !!process.env.ASTRA_DB_APPLICATION_TOKEN,
      ASTRA_DB_API_ENDPOINT: !!process.env.ASTRA_DB_API_ENDPOINT,
      tokenLength: process.env.ASTRA_DB_APPLICATION_TOKEN?.length || 0,
      endpointValue: process.env.ASTRA_DB_API_ENDPOINT?.substring(0, 50) || "not set",
    },
    connectionTest: {
      success: false,
      error: null as string | null,
    },
  };

  try {
    const dbClient = getAstraDB();
    const reportDB = dbClient.getReportDB();
    const collections = await reportDB.listCollections();
    debug.connectionTest.success = true;
    return NextResponse.json({
      ...debug,
      collections: collections.map((c: { name: string }) => c.name),
    });
  } catch (error) {
    debug.connectionTest.error = error instanceof Error ? error.message : String(error);
    return NextResponse.json(debug, { status: 500 });
  }
}
