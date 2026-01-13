import { NextResponse } from "next/server";
import { getMongoDB } from "../../../../lib/db/mongodb";
import { getAstraDB } from "../../../../lib/db/astradb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const userId = searchParams.get("userId");

    const skip = (page - 1) * limit;

    const db = getMongoDB();
    const collection = await db.getCollection("job-freelancer");

    const query: any = {
      $or: [
        { selectedFreelancer: null },
        { selectedFreelancer: { $exists: false } },
        { selectedFreelancer: "" },
      ],
    };

    if (userId) {
      try {
        const astraDb = getAstraDB();
        const freelancerCollection = astraDb.getCollectionFromKeyspace(
          "freelancer",
          "data_freelancer"
        ) as any;

        let user = await freelancerCollection.findOne({ _id: userId });

        if (!user) {
          try {
            if (ObjectId.isValid(userId)) {
              user = await freelancerCollection.findOne({
                _id: new ObjectId(userId),
              });
            }
          } catch (e) {}
        }

        if (user && user.skills) {
          const userSkills = Array.isArray(user.skills)
            ? user.skills
            : typeof user.skills === "string"
              ? user.skills.split(",").map((s: string) => s.trim())
              : [];

          if (userSkills.length > 0) {
            const skillRegexes = userSkills.map(
              (skill: string) => new RegExp(`^${skill}$`, "i")
            );

            query.skills = { $in: skillRegexes };
          }
        }
      } catch (err) {
        console.error("Error fetching user skills for filtering:", err);
      }
    }

    const totalCount = await collection.countDocuments(query);

    const projects = await collection
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    const formattedProjects = projects.map((project: any) => {
      let budgetVal = 0;
      if (project.budgetTo) budgetVal = Number(project.budgetTo);
      else if (project.budget) budgetVal = Number(project.budget);
      else if (project.budgetFrom) budgetVal = Number(project.budgetFrom);
      else if (project.amount) budgetVal = Number(project.amount);

      if (isNaN(budgetVal)) budgetVal = 0;

      let skillsArray: string[] = [];
      if (Array.isArray(project.skills)) {
        skillsArray = project.skills;
      } else if (typeof project.skills === "string") {
        skillsArray = project.skills
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }

      return {
        id: project._id.toString(),
        name: project.jobTitle || "Untitled Project",
        description: project.projectDescription || "",
        client: project.name || "Unknown Client",
        clientEmail: project.email || "",
        budget: budgetVal,
        budgetFrom: project.budgetFrom ? Number(project.budgetFrom) : 0,
        budgetTo: project.budgetTo ? Number(project.budgetTo) : 0,
        deadline: project.deadlineDate || "N/A",
        duration: project.dueTime || "N/A",
        skills: skillsArray,
        category: project.category || "",
        status: project.status,
        createdAt: project.createdAt
          ? new Date(project.createdAt).toISOString()
          : null,
        updatedAt: project.updatedAt
          ? new Date(project.updatedAt).toISOString()
          : null,
      };
    });

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
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
