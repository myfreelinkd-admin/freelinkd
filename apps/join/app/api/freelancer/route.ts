/**
 * API Route: Freelancer Form
 * Endpoint untuk mengelola pendaftaran freelancer
 * 
 * POST /api/freelancer - Submit form pendaftaran freelancer baru
 * GET /api/freelancer - Mendapatkan semua freelancer (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  createFreelancerForm,
  getAllFreelancerForms,
  isEmailAlreadyRegistered,
  CreateFreelancerFormRequest,
} from "../../lib/services/freelancer-form.service";

/**
 * Validasi data form freelancer
 */
function validateFormData(data: unknown): {
  isValid: boolean;
  errors: string[];
  validatedData?: CreateFreelancerFormRequest;
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { isValid: false, errors: ["Invalid request body"] };
  }

  const formData = data as Record<string, unknown>;

  // Validasi field wajib
  if (!formData.name || typeof formData.name !== "string" || formData.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!formData.address || typeof formData.address !== "string" || formData.address.trim() === "") {
    errors.push("Address is required");
  }

  if (!formData.email || typeof formData.email !== "string" || formData.email.trim() === "") {
    errors.push("Email is required");
  } else {
    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push("Invalid email format");
    }
  }

  if (!formData.phone || typeof formData.phone !== "string" || formData.phone.trim() === "") {
    errors.push("Phone is required");
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Return validated data
  return {
    isValid: true,
    errors: [],
    validatedData: {
      name: (formData.name as string).trim(),
      address: (formData.address as string).trim(),
      email: (formData.email as string).trim().toLowerCase(),
      phone: (formData.phone as string).trim(),
      skills: formData.skills ? (formData.skills as string).trim() : undefined,
      professionalExperience: formData.professionalExperience
        ? (formData.professionalExperience as string).trim()
        : undefined,
      portfolioUrl: formData.portfolioUrl
        ? (formData.portfolioUrl as string).trim()
        : undefined,
      resumeFileName: formData.resumeFileName
        ? (formData.resumeFileName as string).trim()
        : undefined,
      // Store resume as base64 data URL for deployment persistence
      resumeData: formData.resumeData
        ? (formData.resumeData as string)
        : undefined,
    },
  };
}

/**
 * POST /api/freelancer
 * Submit form pendaftaran freelancer baru ke AstraDB
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validasi data
    const validation = validateFormData(body);
    if (!validation.isValid || !validation.validatedData) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const emailExists = await isEmailAlreadyRegistered(validation.validatedData.email);
    if (emailExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
          errors: ["This email address has already been used for registration"],
        },
        { status: 409 }
      );
    }

    // Simpan ke AstraDB
    const savedForm = await createFreelancerForm(validation.validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer application submitted successfully",
        data: {
          id: savedForm._id,
          email: savedForm.email,
          status: savedForm.status,
          createdAt: savedForm.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting freelancer form:", error);

    // Handle specific errors
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
 * GET /api/freelancer
 * Mendapatkan semua data freelancer form (untuk admin)
 */
export async function GET() {
  try {
    const forms = await getAllFreelancerForms();

    return NextResponse.json(
      {
        success: true,
        message: "Freelancer forms retrieved successfully",
        data: forms,
        total: forms.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching freelancer forms:", error);

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
