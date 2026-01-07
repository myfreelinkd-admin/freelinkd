import { NextRequest, NextResponse } from "next/server";
import { MongoDBClientManager } from "@/app/lib/db/mongodb";
import { ObjectId } from "mongodb";

// Types
export interface JobFreelancerData {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  skills: string;
  projectDescription: string;
  additionalRequirements: string;
  dueTime: string;
  deadlineDate: string;
  budgetFrom: string;
  budgetTo: string;
  uploadDocument?: string; // URL or file reference
  selectedFreelancer?: {
    id: string;
    name: string;
    skills: string;
    matchPercentage: number;
  };
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// Input validation interface
interface JobInputData {
  name?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  skills?: string;
  projectDescription?: string;
  additionalRequirements?: string;
  dueTime?: string;
  deadlineDate?: string;
  budgetFrom?: string;
  budgetTo?: string;
  uploadDocument?: string;
  selectedFreelancer?: {
    id: string;
    name: string;
    skills: string;
    matchPercentage: number;
  };
}

// Validation helper
function validateJobData(data: JobInputData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Relaxed validation - only check essential fields
  if (!data.name || data.name.trim().length < 1) {
    errors.push("Name is required");
  }

  if (!data.email || data.email.trim().length < 1) {
    errors.push("Email is required");
  }

  // All other fields are optional for now
  // if (!data.phone || data.phone.trim().length < 8) {
  //   errors.push("Valid phone number is required");
  // }

  // if (!data.jobTitle || data.jobTitle.trim().length < 3) {
  //   errors.push("Job title must be at least 3 characters");
  // }

  // if (!data.skills || data.skills.trim().length < 2) {
  //   errors.push("Skills are required");
  // }

  // if (!data.projectDescription || data.projectDescription.trim().length < 5) {
  //   errors.push("Project description is required");
  // }

  // Make deadline optional
  // if (!data.deadlineDate) {
  //   errors.push("Deadline date is required");
  // }

  // Make budget optional or accept empty strings
  if (data.budgetFrom && isNaN(Number(data.budgetFrom))) {
    errors.push("Valid budget from amount is required");
  }

  if (data.budgetTo && isNaN(Number(data.budgetTo))) {
    errors.push("Valid budget to amount is required");
  }

  if (
    data.budgetFrom &&
    data.budgetTo &&
    Number(data.budgetFrom) > Number(data.budgetTo)
  ) {
    errors.push("Budget from cannot be greater than budget to");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// POST: Create new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Debug: Log received data
    console.log("Received job data:", JSON.stringify(body, null, 2));

    // Validate data
    const validation = validateJobData(body);
    if (!validation.valid) {
      console.error("Validation failed:", validation.errors);
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Get MongoDB instance
    const mongoManager = MongoDBClientManager.getInstance();
    const db = await mongoManager.getDatabase();
    const collection = db.collection<JobFreelancerData>("job-freelancer");

    // Prepare job data
    const jobData: Omit<JobFreelancerData, "_id"> = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      jobTitle: body.jobTitle.trim(),
      skills: body.skills.trim(),
      projectDescription: body.projectDescription.trim(),
      additionalRequirements: body.additionalRequirements?.trim() || "",
      dueTime: body.dueTime || "",
      deadlineDate: body.deadlineDate,
      budgetFrom: body.budgetFrom,
      budgetTo: body.budgetTo,
      uploadDocument: body.uploadDocument || "",
      selectedFreelancer: body.selectedFreelancer || undefined,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await collection.insertOne(
      jobData as JobFreelancerData & Document
    );

    if (!result.acknowledged) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create job",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job created successfully",
        data: {
          id: result.insertedId.toString(),
          ...jobData,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET: Retrieve jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const email = searchParams.get("email");

    // Get MongoDB instance
    const mongoManager = MongoDBClientManager.getInstance();
    const db = await mongoManager.getDatabase();
    const collection = db.collection<JobFreelancerData>("job-freelancer");

    // Build filter
    const filter: Record<string, string> = {};
    if (status) {
      filter.status = status;
    }
    if (email) {
      filter.email = email.toLowerCase();
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get total count
    const total = await collection.countDocuments(filter);

    // Get jobs with pagination
    const jobs = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: jobs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving jobs:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
