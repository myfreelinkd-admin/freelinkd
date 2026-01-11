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
          hasEndpoint,
          requiredVariables: [
            "ASTRA_DB_TOKEN_CHAT",
            "ASTRA_DB_ENDPOINT_CHAT"
          ]
        }
      }, { status: 500 });
    }

    // Try to get database instance
    let db;
    try {
      db = getChatHistoryDB();
      console.log("Database instance created");
    } catch (dbError: any) {
      return NextResponse.json({
        success: false,
        error: "Failed to create database instance",
        message: dbError.message
      }, { status: 500 });
    }

    // Try to check connection
    let isConnected = false;
    let collections: any[] = [];
    
    try {
      isConnected = await db.checkConnection();
      console.log("Connection check:", isConnected);
    } catch (connError: any) {
      console.error("Connection check failed:", connError.message);
      // Continue - we'll try other methods
    }

    // Try to list collections
    try {
      collections = await db.listCollections();
      console.log("Collections:", collections);
      isConnected = true; // If we can list collections, we're connected
    } catch (listError: any) {
      console.error("Failed to list collections:", listError.message);
      
      // Try to create the collection if it doesn't exist
      try {
        console.log("Attempting to create 'history' collection...");
        await db.createCollection("history");
        console.log("Collection 'history' created successfully");
        collections = [{ name: "history" }];
        isConnected = true;
      } catch (createError: any) {
        // Check if error is because collection already exists
        if (createError.message?.includes("already exists")) {
          console.log("Collection 'history' already exists");
          collections = [{ name: "history" }];
          isConnected = true;
        } else {
          return NextResponse.json({
            success: false,
            error: "Failed to connect to chat history database",
            message: createError.message,
            hint: "Make sure keyspace 'history' exists in your AstraDB database"
          }, { status: 500 });
        }
      }
    }

    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: "Failed to connect to chat history database"
      }, { status: 500 });
    }

    // Try to insert a test document
    let testResult = { inserted: false, retrieved: false };
    try {
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

      console.log("Inserting test document...");
      await collection.insertOne(testDoc);
      console.log("Test document inserted successfully");
      testResult.inserted = true;

      // Try to retrieve the test document
      const retrieved = await collection.findOne({ isTest: true });
      console.log("Retrieved test document:", !!retrieved);
      testResult.retrieved = !!retrieved;
    } catch (testError: any) {
      console.error("Test document operation failed:", testError.message);
    }

    return NextResponse.json({
      success: true,
      message: "Chat history database connection test passed",
      details: {
        environmentVariables: {
          hasToken,
          hasEndpoint
        },
        connection: isConnected,
        collections: collections.map((c: any) => c.name || c),
        testDocument: testResult
      }
    });

  } catch (error: any) {
    console.error("Chat history DB test error:", error);
    return NextResponse.json({
      success: false,
      error: "Test failed",
      message: error.message,
      hint: "Check server logs for more details"
    }, { status: 500 });
  }
}

