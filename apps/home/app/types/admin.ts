import { ObjectId } from "mongodb";

export interface AdminDocument {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export type AdminRole = "super_admin" | "admin" | "moderator";
export type AdminStatus = "active" | "inactive" | "suspended";

export interface AdminRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminResponse {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
