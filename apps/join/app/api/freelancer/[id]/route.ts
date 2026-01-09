/**
 * API Route: Freelancer Form by ID
 * Endpoint untuk operasi pada freelancer form spesifik
 * 
 * GET /api/freelancer/[id] - Mendapatkan freelancer form berdasarkan ID
 * PATCH /api/freelancer/[id] - Update freelancer form
 * DELETE /api/freelancer/[id] - Hapus freelancer form
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getFreelancerFormById,
  updateFreelancerForm,
  updateFreelancerFormStatus,
  deleteFreelancerForm,
  FreelancerFormData,
} from "../../../lib/services/freelancer-form.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/freelancer/[id]
 * Mendapatkan freelancer form berdasarkan ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Freelancer ID is required",
        },
        { status: 400 }
      );
    }

    const form = await getFreelancerFormById(id);

    if (!form) {
      return NextResponse.json(
        {
          success: false,
          message: "Freelancer form not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer form retrieved successfully",
        data: form,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching freelancer form:", error);

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

/**
 * PATCH /api/freelancer/[id]
 * Update freelancer form (data atau status)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Freelancer ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Cek apakah freelancer form ada
    const existingForm = await getFreelancerFormById(id);
    if (!existingForm) {
      return NextResponse.json(
        {
          success: false,
          message: "Freelancer form not found",
        },
        { status: 404 }
      );
    }

    // Jika hanya update status
    if (body.status && Object.keys(body).length === 1) {
      const validStatuses: FreelancerFormData["status"][] = [
        "pending",
        "approved",
        "rejected",
      ];
      
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid status value",
            errors: [`Status must be one of: ${validStatuses.join(", ")}`],
          },
          { status: 400 }
        );
      }

      const updated = await updateFreelancerFormStatus(id, body.status);
      
      if (!updated) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to update status",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: `Freelancer form status updated to ${body.status}`,
        },
        { status: 200 }
      );
    }

    // Update data lainnya
    const allowedFields = [
      "name",
      "address",
      "email",
      "phone",
      "skills",
      "professionalExperience",
      "portfolioUrl",
      "resumeFileName",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fields to update",
        },
        { status: 400 }
      );
    }

    const updated = await updateFreelancerForm(id, updateData);

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update freelancer form",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer form updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating freelancer form:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

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

/**
 * DELETE /api/freelancer/[id]
 * Hapus freelancer form
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Freelancer ID is required",
        },
        { status: 400 }
      );
    }

    // Cek apakah freelancer form ada
    const existingForm = await getFreelancerFormById(id);
    if (!existingForm) {
      return NextResponse.json(
        {
          success: false,
          message: "Freelancer form not found",
        },
        { status: 404 }
      );
    }

    const deleted = await deleteFreelancerForm(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete freelancer form",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer form deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting freelancer form:", error);

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
