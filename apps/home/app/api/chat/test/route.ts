import { NextResponse } from "next/server";
import { getChatHistoryDB } from "../../../lib/db/astradb-chat";

/**
 * Test route to verify chat history database connection
 * GET /api/chat/test
 */
export async function GET(req: Request) {
  try {
    console.log("=== Testing Chat History DB Connection ===");
    
    // Check environment variables
    const hasToken = !!process.env.ASTRA_DB_TOKEN_CHAT;
    const hasEndpoint = !!process.env.ASTRA_DB_ENDPOINT_CHAT;
    
    console.log("Environment variables:");
    console.log("- ASTRA_DB_TOKEN_CHAT:", hasToken ? "✓ Set" : "✗ Missing");
    console.log("- ASTRA_DB_ENDPOINT_CHAT:", hasEndpoint ? "✓ Set" : "✗ Missing");
    
    if (!hasToken || !hasEndpoint) {
      return NextResponse.json({
        success: false,
        error: "Environment variables not configured",
        details: {
          hasToken,
          hasEndpoint
        }
      }, { status: 500 });
    }

    // Try to get database instance
    const db = getChatHistoryDB();
    console.log("Database instance created");

    // Try to check connection
    const isConnected = await db.checkConnection();
    console.log("Connection check:", isConnected);

    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: "Failed to connect to chat history database"
      }, { status: 500 });
    }

    // Try to list collections
    const collections = await db.listCollections();
    console.log("Collections:", collections);

    // Try to insert a test document
    const collection = db.getCollection("history") as any;
    const testDoc = {
      roomId: "test-room",
      senderId: "test-user",
      senderName: "Test User",
      text: "Test message from debug route",
      timestamp: Date.now(),
      createdAt: new Date(),
      isTest: true
    };

    console.log("Inserting test document:", testDoc);
    await collection.insertOne(testDoc);
    console.log("Test document inserted successfully");

    // Try to retrieve the test document
    const retrieved = await collection.findOne({ isTest: true });
    console.log("Retrieved test document:", retrieved);

    return NextResponse.json({
      success: true,
      message: "Chat history database connection test passed",
      details: {
        environmentVariables: {
          hasToken,
          hasEndpoint
        },
        connection: isConnected,
        collections: collections.map((c: any) => c.name),
        testDocument: {
          inserted: true,
          retrieved: !!retrieved
        }
      }
    });

  } catch (error: any) {
    console.error("Chat history DB test error:", error);
    return NextResponse.json({
      success: false,
      error: "Test failed",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
