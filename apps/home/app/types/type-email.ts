export interface FreelancerAcceptanceEmailData {
  freelancerName: string;
  freelancerEmail: string;
  projectName?: string;
  acceptanceMessage?: string;
  companyName?: string;
}

export interface FreelancerRejectionEmailData {
  freelancerName: string;
  freelancerEmail: string;
  rejectionReason?: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  error?: Error;
}
