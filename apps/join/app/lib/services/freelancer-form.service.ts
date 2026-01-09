/**
 * Freelancer Form Service
 * Service untuk operasi CRUD pada collection freelancer_form di AstraDB
 * Keyspace: freelancer
 * Collection: freelancer_form
 */

import { getAstraDB } from "../db";

/**
 * Interface untuk data Freelancer Form
 */
export interface FreelancerFormData {
  _id?: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  skills?: string;
  professionalExperience?: string;
  portfolioUrl?: string;
  resumeFileName?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface untuk create freelancer request
 */
export interface CreateFreelancerFormRequest {
  name: string;
  address: string;
  email: string;
  phone: string;
  skills?: string;
  professionalExperience?: string;
  portfolioUrl?: string;
  resumeFileName?: string;
}

/**
 * Interface untuk response dari AstraDB
 */
interface AstraDBInsertResponse {
  insertedId: string;
}

interface AstraDBFindResponse {
  toArray(): Promise<FreelancerFormData[]>;
}

interface AstraDBCollection {
  insertOne(doc: Partial<FreelancerFormData>): Promise<AstraDBInsertResponse>;
  findOne(filter: Record<string, unknown>): Promise<FreelancerFormData | null>;
  find(filter: Record<string, unknown>): AstraDBFindResponse;
  updateOne(
    filter: Record<string, unknown>,
    update: Record<string, unknown>
  ): Promise<{ modifiedCount: number }>;
  deleteOne(
    filter: Record<string, unknown>
  ): Promise<{ deletedCount: number }>;
}

const COLLECTION_NAME = "freelancer_form";

// Flag untuk tracking apakah collection sudah diinisialisasi
let collectionInitialized = false;

/**
 * Inisialisasi collection jika belum ada
 */
async function ensureCollectionExists(): Promise<void> {
  if (collectionInitialized) return;

  try {
    const astraClient = getAstraDB();
    const db = astraClient.getDatabase();
    
    // Coba list collections untuk cek apakah sudah ada
    const collections = await db.listCollections();
    const collectionNames = (collections as { name: string }[]).map((c) => c.name);
    
    if (!collectionNames.includes(COLLECTION_NAME)) {
      console.log(`Creating collection: ${COLLECTION_NAME}`);
      await db.createCollection(COLLECTION_NAME);
      console.log(`Collection ${COLLECTION_NAME} created successfully`);
    }
    
    collectionInitialized = true;
  } catch (error) {
    // Jika error adalah "collection already exists", abaikan
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("already exists")) {
      collectionInitialized = true;
      return;
    }
    console.error("Error ensuring collection exists:", error);
    throw error;
  }
}

/**
 * Mendapatkan collection freelancer_form
 */
function getFreelancerFormCollection(): AstraDBCollection {
  const astraClient = getAstraDB();
  return astraClient.getCollection(COLLECTION_NAME) as AstraDBCollection;
}

/**
 * Mendapatkan collection dengan memastikan sudah ada
 */
async function getCollection(): Promise<AstraDBCollection> {
  await ensureCollectionExists();
  return getFreelancerFormCollection();
}

/**
 * Membuat entri freelancer form baru
 */
export async function createFreelancerForm(
  data: CreateFreelancerFormRequest
): Promise<FreelancerFormData> {
  const collection = await getCollection();

  const now = new Date().toISOString();
  const formData: Partial<FreelancerFormData> = {
    ...data,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(formData);

  return {
    _id: result.insertedId,
    ...formData,
    name: data.name,
    address: data.address,
    email: data.email,
    phone: data.phone,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Mendapatkan freelancer form berdasarkan ID
 */
export async function getFreelancerFormById(
  id: string
): Promise<FreelancerFormData | null> {
  const collection = await getCollection();
  return await collection.findOne({ _id: id });
}

/**
 * Mendapatkan freelancer form berdasarkan email
 */
export async function getFreelancerFormByEmail(
  email: string
): Promise<FreelancerFormData | null> {
  const collection = await getCollection();
  return await collection.findOne({ email });
}

/**
 * Mendapatkan semua freelancer forms
 */
export async function getAllFreelancerForms(): Promise<FreelancerFormData[]> {
  const collection = await getCollection();
  const cursor = collection.find({});
  return await cursor.toArray();
}

/**
 * Mendapatkan freelancer forms berdasarkan status
 */
export async function getFreelancerFormsByStatus(
  status: FreelancerFormData["status"]
): Promise<FreelancerFormData[]> {
  const collection = await getCollection();
  const cursor = collection.find({ status });
  return await cursor.toArray();
}

/**
 * Update status freelancer form
 */
export async function updateFreelancerFormStatus(
  id: string,
  status: FreelancerFormData["status"]
): Promise<boolean> {
  const collection = await getCollection();

  const result = await collection.updateOne(
    { _id: id },
    {
      $set: {
        status,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  return result.modifiedCount > 0;
}

/**
 * Update freelancer form
 */
export async function updateFreelancerForm(
  id: string,
  data: Partial<CreateFreelancerFormRequest>
): Promise<boolean> {
  const collection = await getCollection();

  const result = await collection.updateOne(
    { _id: id },
    {
      $set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  return result.modifiedCount > 0;
}

/**
 * Hapus freelancer form
 */
export async function deleteFreelancerForm(id: string): Promise<boolean> {
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

/**
 * Cek apakah email sudah terdaftar
 */
export async function isEmailAlreadyRegistered(email: string): Promise<boolean> {
  const existing = await getFreelancerFormByEmail(email);
  return existing !== null;
}
