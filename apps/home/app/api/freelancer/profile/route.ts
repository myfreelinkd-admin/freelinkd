import { NextResponse } from "next/server";
import { getAstraDB } from "../../../lib/db/astradb";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("freelancer", "data_freelancer") as any;

    let user = await collection.findOne({ _id: id });
    
    if (!user) {
       try {
         const { ObjectId } = require("mongodb");
         if (ObjectId.isValid(id)) {
            user = await collection.findOne({ _id: new ObjectId(id) });
         }
       } catch (e) {
         // ignore
       }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check for freelancer_id (Custom ID) and ensure it exists
    let freelancerId = user.freelancer_id;
    let needsUpdate = false;
    const updateFields: any = {};

    if (!freelancerId) {
       const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
       freelancerId = `FL-${randomSuffix}`;
       updateFields.freelancer_id = freelancerId;
       needsUpdate = true;
    }

    let rank = user.rank;
    if (!rank) {
       rank = "Bronze";
       updateFields.rank = rank;
       needsUpdate = true;
    }

    if (needsUpdate) {
        await collection.updateOne(
            { _id: user._id },
            { $set: updateFields }
        );
        user = { ...user, ...updateFields };
    }

    const formatDate = (dateString: string | Date) => {
      if (!dateString) return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return NextResponse.json({
      success: true,
      data: {
        name: user.username || user.name || user.fullname || "Freelancer",
        email: user.email || "",
        phone: user.phone || user.phoneNumber || "",
        photoUrl: user.profile_image || user.photo_url || user.avatar || null,
        freelancerId: freelancerId,
        id: user._id.toString(),
        joinedDate: formatDate(user.joinedDate || user.createdAt),
        rank: user.rank || "Bronze",
        skills: Array.isArray(user.skills) ? user.skills : (user.skills ? user.skills.split(",").map((s: string) => s.trim()) : []),
        portfolioUrl: user.portfolioUrl || user.portfolio_url || user.website || "",
      },
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, freelancerId, email, phone, portfolioUrl, skills, password, photoUrl } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const db = getAstraDB();
        const collection = db.getCollectionFromKeyspace("freelancer", "data_freelancer") as any;
        
        // Find existing user
        let existingUser = await collection.findOne({ _id: id });
         if (!existingUser) {
           try {
             const { ObjectId } = require("mongodb");
             if (ObjectId.isValid(id)) {
                existingUser = await collection.findOne({ _id: new ObjectId(id) });
             }
           } catch (e) {
             // ignore
           }
        }

        if (!existingUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const updateData: any = {
            username: name, // Using username as primary name field based on GET logic
            name: name,     // Update both to be safe
            fullname: name,
            // email: email, // Email should not be modifiable by user
            phone: phone,
            portfolioUrl: portfolioUrl,
            skills: skills, // Array
            freelancer_id: freelancerId, // Update custom ID if changed
            profile_image: photoUrl // Update photo if provided
        };

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        await collection.updateOne(
            { _id: existingUser._id },
            { $set: updateData }
        );

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            data: { ...updateData, id }
        });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
