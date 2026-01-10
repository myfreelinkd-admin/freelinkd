import bcrypt from "bcryptjs";
import { getMongoDB } from "@/app/lib/db/mongodb";
import {
  AdminDocument,
  AdminRegisterRequest,
  AdminLoginRequest,
  AdminResponse,
} from "@/app/types/admin";

const ADMIN_COLLECTION = "admin_freelinkd";
const SALT_ROUNDS = 12;
export class AdminService {
  
  static async register(
    registerData: AdminRegisterRequest
  ): Promise<AdminResponse> {
    const { username, email, password } = registerData;

    const mongoClient = getMongoDB();
    const collection = await mongoClient.getCollection<AdminDocument>(
      ADMIN_COLLECTION
    );

    const existingAdmin = await collection.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      throw new Error("EMAIL_EXISTS");
    }

    const existingUsername = await collection.findOne({
      username: username.toLowerCase(),
    });

    if (existingUsername) {
      throw new Error("USERNAME_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const now = new Date();
    const adminDoc: Omit<AdminDocument, "_id"> = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",  
      status: "active", 
      createdAt: now,
      updatedAt: now,
    };
    const result = await collection.insertOne(adminDoc as AdminDocument);

    if (!result.insertedId) {
      throw new Error("INSERTION_FAILED");
    }

    return {
      id: result.insertedId.toString(),
      username: adminDoc.username,
      email: adminDoc.email,
      role: adminDoc.role,
      status: adminDoc.status,
      createdAt: adminDoc.createdAt.toISOString(),
    };
  }

  /**
   * Login admin
   * @param loginData - Admin login credentials
   * @returns Admin response if credentials are valid
   * @throws Error if login fails
   */
  static async login(loginData: AdminLoginRequest): Promise<AdminResponse> {
    const { email, password } = loginData;

    // Get MongoDB collection
    const mongoClient = getMongoDB();
    const collection = await mongoClient.getCollection<AdminDocument>(
      ADMIN_COLLECTION
    );

    // Find admin by email
    const admin = await collection.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Check if account is active
    if (admin.status !== "active") {
      throw new Error("ACCOUNT_INACTIVE");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Update last login timestamp
    await collection.updateOne(
      { _id: admin._id },
      {
        $set: {
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // Return admin response (without password)
    return {
      id: admin._id!.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      createdAt: admin.createdAt.toISOString(),
    };
  }

  /**
   * Find admin by email
   * @param email - Admin email
   * @returns Admin document or null
   */
  static async findByEmail(email: string): Promise<AdminDocument | null> {
    const mongoClient = getMongoDB();
    const collection = await mongoClient.getCollection<AdminDocument>(
      ADMIN_COLLECTION
    );

    return collection.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find admin by username
   * @param username - Admin username
   * @returns Admin document or null
   */
  static async findByUsername(username: string): Promise<AdminDocument | null> {
    const mongoClient = getMongoDB();
    const collection = await mongoClient.getCollection<AdminDocument>(
      ADMIN_COLLECTION
    );

    return collection.findOne({ username: username.toLowerCase() });
  }
}
