import { NextResponse } from "next/server";
import { getAstraDB } from "../../../../lib/db/astradb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAstraDB();
    const collection = db.getCollectionFromKeyspace("umkm", "umkm_account") as any;

    // Fetch UMKM users
    const cursor = await collection.find({});
    const umkms = await cursor.toArray();

    // Map data
    const mappedData = umkms.map((umkm: any) => ({
      id: umkm._id.toString(),
      companyName: umkm.nama_umkm || umkm.companyName || umkm.company_name || umkm.username || "Unknown Company",
      owner: umkm.ownerName || umkm.owner || umkm.username || "Unknown Owner",
      email: umkm.email,
      industry: umkm.industry || "General",
      location: umkm.location || umkm.city || "Jakarta, ID",
      status: umkm.status || "Verified",
      joinedDate: umkm.created_at ? new Date(umkm.created_at).toLocaleDateString() : (umkm.createdAt ? new Date(umkm.createdAt).toLocaleDateString() : "N/A"),
      phone: umkm.phone || "",
      website: umkm.website || "",
      bio: umkm.description || umkm.bio || "",
    }));

    return NextResponse.json({
      success: true,
      data: mappedData,
    });
  } catch (error) {
    console.error("Error fetching UMKM users:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
