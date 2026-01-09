import { DataAPIClient } from "@datastax/astra-db-ts";

/**
 * AstraDB Configuration Interface
 */
interface AstraDBConfig {
  token: string;
  endpoint: string;
  keyspace: string;
}

// Minimal interface for the parts of the Astra DB object used in this file
interface AstraDBDatabase {
  collection(collectionName: string): unknown;
  createCollection(collectionName: string): Promise<unknown>;
  listCollections(): Promise<unknown>;
  dropCollection(collectionName: string): Promise<unknown>;
  command(command: unknown): Promise<unknown>;
}

// Keyspace untuk freelancer form
const FREELANCER_KEYSPACE = "freelancer";

//  AstraDB Client Singleton Class

class AstraDBClient {
  private static instance: AstraDBClient | null = null;
  private client: DataAPIClient;
  private db: AstraDBDatabase;
  private config: AstraDBConfig;

  private constructor(config: AstraDBConfig) {
    this.config = config;
    this.client = new DataAPIClient(this.config.token);
    // Menggunakan keyspace yang dispesifikasikan
    this.db = this.client.db(this.config.endpoint, {
      keyspace: this.config.keyspace,
    }) as AstraDBDatabase;
  }

  //  Get singleton instance of AstraDB client

  public static getInstance(): AstraDBClient {
    if (!AstraDBClient.instance) {
      const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
      const endpoint = process.env.ASTRA_DB_API_ENDPOINT;
      const keyspace = process.env.ASTRA_DB_KEYSPACE || FREELANCER_KEYSPACE;

      if (!token || !endpoint) {
        throw new Error(
          "AstraDB credentials missing. Please check ASTRA_DB_APPLICATION_TOKEN and ASTRA_DB_API_ENDPOINT in .env file"
        );
      }

      console.log(`Connecting to AstraDB with keyspace: ${keyspace}`);
      AstraDBClient.instance = new AstraDBClient({ token, endpoint, keyspace });
    }

    return AstraDBClient.instance;
  }

  /**
   * Get database instance
   */
  public getDatabase() {
    return this.db;
  }

  /**
   * Get collection by name
   * @param collectionName - Name of the collection
   */
  public getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }

  /**
   * Check connection status
   */
  public async checkConnection(): Promise<boolean> {
    try {
      // Try to list collections as a connection check
      await this.db.listCollections();
      return true;
    } catch (error) {
      console.error("AstraDB connection failed:", error);
      return false;
    }
  }

  /**
   * Create a new collection
   * @param collectionName - Name of the collection to create
   */
  public async createCollection(collectionName: string) {
    try {
      const collection = await this.db.createCollection(collectionName);
      console.log(`Collection '${collectionName}' created successfully`);
      return collection;
    } catch (error) {
      console.error(`Failed to create collection '${collectionName}':`, error);
      throw error;
    }
  }

  //   List all collections

  public async listCollections() {
    try {
      const collections = await this.db.listCollections();
      return collections;
    } catch (error) {
      console.error("Failed to list collections:", error);
      throw error;
    }
  }

  /**
   * Delete a collection
   * @param collectionName - Name of the collection to delete
   */
  public async deleteCollection(collectionName: string) {
    try {
      await this.db.dropCollection(collectionName);
      console.log(`Collection '${collectionName}' deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to delete collection '${collectionName}':`, error);
      throw error;
    }
  }
}

// Export singleton instance getter
export const getAstraDB = () => AstraDBClient.getInstance();

// Export class for type purposes
export type { AstraDBConfig };
export { AstraDBClient };
