/**
 * Freelancer Form API Client
 * Helper functions untuk memanggil API freelancer form dari frontend
 */

export interface FreelancerFormSubmitData {
  name: string;
  address: string;
  email: string;
  phone: string;
  skills?: string;
  professionalExperience?: string;
  portfolioUrl?: string;
  resumeFileName?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface SubmitSuccessData {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

/**
 * Submit form pendaftaran freelancer ke API
 */
export async function submitFreelancerForm(
  data: FreelancerFormSubmitData
): Promise<ApiResponse<SubmitSuccessData>> {
  try {
    const response = await fetch("/api/freelancer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error submitting freelancer form:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

/**
 * Mendapatkan data freelancer form berdasarkan ID
 */
export async function getFreelancerFormData(
  id: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/freelancer/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching freelancer form:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

/**
 * Mendapatkan semua freelancer forms (untuk admin)
 */
export async function getAllFreelancerForms(): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/freelancer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching freelancer forms:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
