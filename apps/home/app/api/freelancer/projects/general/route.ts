import { NextResponse } from "next/server";
import { getMongoDB } from "../../../../lib/db/mongodb";

/**
 * GET /api/freelancer/projects/general
 * Fetch all projects with status = "general" from job_freelancer collection
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Optional query parameters for pagination and filtering
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const db = getMongoDB();
    const collection = await db.getCollection("job_freelancer");

    // Query for projects with status = "general" (case-insensitive)
    const query = {
      status: { $regex: /^general$/i }
    };

    // Get total count for pagination info
    const totalCount = await collection.countDocuments(query);

    // Fetch projects with pagination and sorting
    const projects = await collection
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Map to frontend format
    const formattedProjects = projects.map((project: any) => ({
      id: project._id.toString(),
      name: project.name || project.title || "Untitled Project",
      description: project.description || "",
      client: project.client || project.client_name || "Unknown Client",
      clientEmail: project.client_email || "",
      budget: project.budget || project.amount || 0,
      deadline: project.deadline 
        ? new Date(project.deadline).toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }) 
        : "N/A",
      duration: project.duration || "N/A",
      skills: project.skills || [],
      category: project.category || "",
      status: project.status,
      createdAt: project.createdAt 
        ? new Date(project.createdAt).toISOString() 
        : null,
      updatedAt: project.updatedAt 
        ? new Date(project.updatedAt).toISOString() 
        : null,
    }));

    // Pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: formattedProjects,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching general projects:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
