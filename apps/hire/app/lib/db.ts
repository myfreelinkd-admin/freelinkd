// AstraDB Connection
export { getAstraDB, AstraDBClient } from "./db/astradb";

// Supabase Connection
export { getSupabase, SupabaseClientManager } from "./db/supabase";

// MongoDB Connection
export { getMongoDB, MongoDBClientManager } from "./db/mongodb";

// Type exports
export type { AstraDBConfig } from "./db/astradb";
export type { SupabaseConfig } from "./db/supabase";
export type { MongoDBConfig } from "./db/mongodb";

/**
 * Database connection status interface
 */
interface DatabaseStatus {
  astradb: boolean;
  supabase: boolean;
  mongodb: boolean;
}

/**
 * Initialize and verify all database connections
 */
export async function initializeDatabases(): Promise<DatabaseStatus> {
  const results: DatabaseStatus = {
    astradb: false,
    supabase: false,
    mongodb: false,
  };

  try {
    // Check AstraDB connection
    const { getAstraDB } = await import("./db/astradb");
    const astraClient = getAstraDB();
    results.astradb = await astraClient.checkConnection();

    // Check Supabase connection
    const { getSupabase } = await import("./db/supabase");
    const supabaseClient = getSupabase();
    results.supabase = await supabaseClient.checkConnection();

    // Check MongoDB connection
    const { getMongoDB } = await import("./db/mongodb");
    const mongoClient = getMongoDB();
    results.mongodb = await mongoClient.checkConnection();

    console.log("Database initialization results:", results);
  } catch (error) {
    console.error("Database initialization error:", error);
  }

  return results;
}
