export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface JobData {
  id?: string;
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
  uploadDocument?: string;
  selectedFreelancer?: {
    id: string;
    name: string;
    skills: string;
    matchPercentage: number;
  } | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

class JobApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/api/jobs";
  }

  /**
   * Create a new job
   */
  async createJob(jobData: JobData): Promise<ApiResponse<JobData>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create job");
      }

      return data;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  }

  /**
   * Get all jobs with optional filters
   */
  async getJobs(params?: {
    page?: number;
    limit?: number;
    status?: string;
    email?: string;
  }): Promise<ApiResponse<JobData[]>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.email) queryParams.append("email", params.email);

      const url = `${this.baseUrl}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      return data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  }

  /**
   * Get a single job by ID
   */
  async getJobById(id: string): Promise<ApiResponse<JobData>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch job");
      }

      return data;
    } catch (error) {
      console.error("Error fetching job:", error);
      throw error;
    }
  }

  /**
   * Update a job
   */
  async updateJob(
    id: string,
    updates: Partial<JobData>
  ): Promise<ApiResponse<JobData>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update job");
      }

      return data;
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  }

  /**
   * Delete a job
   */
  async deleteJob(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete job");
      }

      return data;
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const jobApiService = new JobApiService();
