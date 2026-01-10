import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAstraDB } from "../../../lib/db/astradb";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    // Connect to specific keyspace and collection as requested
    const collection = db.getCollectionFromKeyspace("freelancer", "data_freelancer") as any;

    // Find user by email
    const user = await collection.findOne({ email: email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    // We assume passwords are securely hashed with bcrypt
    // If you are using plain text passwords for testing, you might need to adjust this logic
    let isPasswordValid = false;

    if (user.password) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Construct user data for response
    // Prioritize username, then name, then fullname
    const username = user.username || user.name || user.fullname || "Freelancer";
    
    const userData = {
      id: user._id.toString(),
      username: username,
      email: user.email,
      role: user.role || "Freelancer",
    };

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: userData,
    });

  } catch (error) {
    console.error("Freelancer login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
