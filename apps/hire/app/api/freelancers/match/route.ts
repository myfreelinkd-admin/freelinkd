import { NextResponse } from "next/server";
import { getAstraDB } from "../../../lib/db/astradb";
import { filterAndRankFreelancers, Freelancer } from "../../../components/form/logic/freelancer-skills";

/**
 * GET /api/freelancers/match
 * Fetch freelancers from AstraDB and match them based on skills
 * 
 * Query Parameters:
 * - skills: Comma-separated list of skills to match
 * - page: Page number for pagination (default: 1)
 * - limit: Number of items per page (default: 10)
 * - minMatch: Minimum match percentage (default: 0)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const skillsParam = searchParams.get("skills") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const minMatch = parseInt(searchParams.get("minMatch") || "0");
    
    // Parse skills from comma-separated string
    const requiredSkills = skillsParam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Get AstraDB client
    const db = getAstraDB();
    
    // Get collection from freelancer keyspace
    const collection = db.getCollectionFromKeyspace("freelancer", "data_freelancer") as any;
    
    // Fetch all freelancers from database
    // Note: AstraDB doesn't support complex queries like $or with regex
    // So we fetch all and filter in application layer
    const cursor = await collection.find({});
    const allFreelancers: Freelancer[] = [];
    
    // Iterate through cursor to get all documents
    for await (const doc of cursor) {
      allFreelancers.push({
        id: doc._id?.toString() || doc.id,
        name: doc.name || doc.fullName || "Unknown",
        email: doc.email || "",
        skills: doc.skills || [],
        experience: doc.experience || "",
        portfolio: doc.portfolio || doc.portfolioUrl || "",
        profileImage: doc.profileImage || doc.avatar || "",
        rating: doc.rating || 0,
        completedProjects: doc.completedProjects || 0,
        hourlyRate: doc.hourlyRate || doc.rate || 0,
        availability: doc.availability || "Available",
        location: doc.location || doc.city || "",
        bio: doc.bio || doc.description || "",
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      });
    }

    // Filter and rank freelancers based on skills
    const matchedFreelancers = filterAndRankFreelancers(
      allFreelancers,
      requiredSkills,
      minMatch
    );

    // Calculate pagination
    const totalItems = matchedFreelancers.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get paginated results
    const paginatedResults = matchedFreelancers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      meta: {
        requiredSkills,
        minMatchPercentage: minMatch,
      },
    });
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
