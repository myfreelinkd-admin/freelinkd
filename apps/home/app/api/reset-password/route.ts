import { getAstraDB, getSupabase } from "@/app/lib/db";
import { NextResponse } from "next/server";

// Define simplified interfaces for the DB interactions to avoid 'any'
interface MongoLikeCollection {
  updateOne(filter: unknown, update: unknown): Promise<unknown>;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, newPassword, userType } = body;

    if (!email || !newPassword || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (userType === "freelancer") {
      const dbClient = getAstraDB();
      // Use the 'freelancer' keyspace
      const db = dbClient.getDatabase("freelancer");
      const collection = db.collection(
        "data_freelancer"
      ) as unknown as MongoLikeCollection;

      // In a real app, hash the password here.
      // For this demo, we'll store it directly or imagine it's hashed.
      await collection.updateOne(
        { email: email },
        { $set: { password: newPassword } }
      );
    } else if (userType === "umkm") {
      const supabaseManager = getSupabase();
      const supabase = supabaseManager.getClient();

      const { error } = await supabase
        .from("umkm")
        .update({ password: newPassword })
        .eq("email", email);

      if (error) {
        console.error("Supabase Error:", error);
        throw new Error(error.message);
      }
    } else {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: unknown) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
