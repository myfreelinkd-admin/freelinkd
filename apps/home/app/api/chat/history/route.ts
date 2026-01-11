import { NextResponse } from "next/server";
import { getChatHistoryDB } from "../../../lib/db/astradb-chat";

/**
 * POST /api/chat/history
 * Save a chat message to history
 * 
 * Request body:
 * {
 *   roomId: string (e.g., "project-123" or "group-456"),
 *   senderId: string,
 *   senderName: string,
 *   text: string,
 *   timestamp: number
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roomId, senderId, senderName, text, timestamp } = body;

    if (!roomId || !senderId || !text) {
      return NextResponse.json(
        { success: false, error: "roomId, senderId, and text are required" },
        { status: 400 }
      );
    }

    // Check environment variables first
    if (!process.env.ASTRA_DB_TOKEN_CHAT || !process.env.ASTRA_DB_ENDPOINT_CHAT) {
      console.error("Chat history DB credentials missing");
      return NextResponse.json(
        { success: false, error: "Chat history database not configured" },
        { status: 500 }
      );
    }

    let db;
    try {
      db = getChatHistoryDB();
    } catch (dbError: any) {
      console.error("Failed to get chat history DB:", dbError.message);
      return NextResponse.json(
        { success: false, error: "Database connection failed" },
        { status: 500 }
      );
    }

    const collection = db.getCollection("history") as any;

    const message = {
      roomId,
      senderId,
      senderName: senderName || "Unknown",
      text,
      timestamp: timestamp || Date.now(),
      createdAt: new Date(),
    };

    console.log(`Saving chat message to room ${roomId} from ${senderId}`);
    await collection.insertOne(message);
    console.log("Chat message saved successfully");

    return NextResponse.json({
      success: true,
      message: "Chat message saved successfully",
      data: message,
    });

  } catch (error: any) {
    console.error("Save chat history error:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat/history?roomId=xxx&limit=50
 * Retrieve chat history for a specific room
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: "roomId is required" },
        { status: 400 }
      );
    }

    const db = getChatHistoryDB();
    const collection = db.getCollection("history") as any;

    // Find all messages for this room, sorted by timestamp
    const cursor = collection.find(
      { roomId },
      { 
        sort: { timestamp: 1 }, // Oldest first
        limit 
      }
    );

    const messages = await cursor.toArray();

    return NextResponse.json({
      success: true,
      data: messages,
      count: messages.length,
    });

  } catch (error) {
    console.error("Fetch chat history error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chat/history
 * Delete chat history for a specific room (admin/cleanup)
 * 
 * Request body:
 * {
 *   roomId: string
 * }
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { roomId } = body;

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: "roomId is required" },
        { status: 400 }
      );
    }

    const db = getChatHistoryDB();
    const collection = db.getCollection("history") as any;

    const result = await collection.deleteMany({ roomId });

    return NextResponse.json({
      success: true,
      message: `Deleted chat history for room ${roomId}`,
      deletedCount: result.deletedCount || 0,
    });

  } catch (error) {
    console.error("Delete chat history error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
