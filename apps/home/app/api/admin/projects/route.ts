import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "freelinkd_db";
const COLLECTION_NAME = "job-freelancer";

async function getMongoClient(): Promise<MongoClient> {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client;
}

export async function GET() {
  let client: MongoClient | null = null;

  try {
    client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Fetch all jobs
    const jobs = await collection.find({}).toArray();

    // Map data to frontend structure matching the mockup
    // MongoDB columns: name, email, phone, jobTitle, skills, projectDescription, 
    // additionalRequirements, dueTime, deadlineDate, budgetFrom, budgetTo, 
    // uploadDocument, selectedFreelancer (object), status, createdAt
    const mappedData = jobs.map((job: any) => ({
      id: job._id.toString(),
      name: job.jobTitle || job.name || "Untitled Project", // Use jobTitle as project name
      client: {
        name: job.name || "Unknown Client", // Client name from 'name' field
        avatar: (job.name || "U").charAt(0).toUpperCase(),
        email: job.email || "",
        phone: job.phone || "",
      },
      freelancer: {
        name: job.selectedFreelancer?.name || "Unassigned",
        avatar: (job.selectedFreelancer?.name || "U").charAt(0).toUpperCase(),
        email: "", // Not in selected freelancer object
        skills: job.selectedFreelancer?.skills || "",
        matchPercentage: job.selectedFreelancer?.matchPercentage || 0,
        id: job.selectedFreelancer?.id || "",
      },
      date: job.createdAt 
        ? new Date(job.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "N/A",
      deadlineDate: job.deadlineDate || "",
      dueTime: job.dueTime || "",
      amount: formatBudget(job.budgetFrom, job.budgetTo),
      budgetFrom: job.budgetFrom || 0,
      budgetTo: job.budgetTo || 0,
      status: mapStatus(job.status),
      progress: job.progress || calculateProgress(job.status) || 0,
      description: job.projectDescription || "",
      skills: job.skills || "",
      additionalRequirements: job.additionalRequirements || "",
      uploadDocument: job.uploadDocument || "",
    }));

    return NextResponse.json({
      success: true,
      data: mappedData,
      total: mappedData.length,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Helper function to format budget range
function formatBudget(budgetFrom: number | string, budgetTo: number | string): string {
  const from = typeof budgetFrom === 'number' ? budgetFrom : parseInt(budgetFrom) || 0;
  const to = typeof budgetTo === 'number' ? budgetTo : parseInt(budgetTo) || 0;
  
  if (from === 0 && to === 0) {
    return "Rp 0";
  }
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };
  
  if (from === to || to === 0) {
    return `Rp ${formatNumber(from)}`;
  }
  
  return `Rp ${formatNumber(from)} - ${formatNumber(to)}`;
}

// Helper function to map various status values to expected format
function mapStatus(status: string): string {
  if (!status) return "Process";
  
  const statusLower = status.toLowerCase();
  if (statusLower === "completed" || statusLower === "complete" || statusLower === "done") {
    return "Complete";
  }
  if (statusLower === "canceled" || statusLower === "cancelled") {
    return "Canceled";
  }
  if (statusLower === "in progress" || statusLower === "ongoing" || statusLower === "process" || statusLower === "active") {
    return "Process";
  }
  if (statusLower === "pending") {
    return "Process";
  }
  return "Process";
}

// Helper function to calculate progress based on status
function calculateProgress(status: string): number {
  if (!status) return 0;
  
  const statusLower = status.toLowerCase();
  if (statusLower === "completed" || statusLower === "complete" || statusLower === "done") {
    return 100;
  }
  if (statusLower === "canceled" || statusLower === "cancelled") {
    return 15;
  }
  // Default progress for ongoing
  return 50;
}
