import { DataAPIClient } from "@datastax/astra-db-ts";

/**
 * AstraDB Configuration Interface
 */
interface AstraDBConfig {
  token: string;
  endpoint: string;
}

interface AstraDBDatabase {
  collection(collectionName: string): unknown;
  createCollection(collectionName: string): Promise<unknown>;
  listCollections(): Promise<unknown>;
  dropCollection(collectionName: string): Promise<unknown>;
  command(command: unknown): Promise<unknown>;
}

/**
 * Predefined keyspace names for the application
 */
export const ASTRA_KEYSPACES = {
  FREELANCER: "freelancer",
  CHATBOT: "chatbot",
  REPORT: "report",
  UMKM: "umkm",
} as const;

export type AstraKeyspaceName =
  (typeof ASTRA_KEYSPACES)[keyof typeof ASTRA_KEYSPACES];

//  AstraDB Client Singleton Class

class AstraDBClient {
  private static instance: AstraDBClient | null = null;
  private client: DataAPIClient;
  private config: AstraDBConfig;

  // Database instances for each keyspace
  private dbFreelancer: AstraDBDatabase | null = null;
  private dbChatbot: AstraDBDatabase | null = null;
  private dbReport: AstraDBDatabase | null = null;
  private dbUmkm: AstraDBDatabase | null = null;

  // Default database (for backward compatibility)
  private defaultDb: AstraDBDatabase;

  private constructor(config: AstraDBConfig) {
    this.config = config;
    this.client = new DataAPIClient(this.config.token);
    this.defaultDb = this.client.db(this.config.endpoint) as AstraDBDatabase;
  }

  //  Get singleton instance of AstraDB client

  public static getInstance(): AstraDBClient {
    if (!AstraDBClient.instance) {
      const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
      const endpoint = process.env.ASTRA_DB_API_ENDPOINT;

      if (!token || !endpoint) {
        throw new Error(
          "AstraDB credentials missing. Please check ASTRA_DB_APPLICATION_TOKEN and ASTRA_DB_API_ENDPOINT in .env file"
        );
      }

      AstraDBClient.instance = new AstraDBClient({ token, endpoint });
    }

    return AstraDBClient.instance;
  }

  /**
   * Get database instance for a specific keyspace
   * @param keyspace - Name of the keyspace
   */
  public getDatabase(keyspace?: AstraKeyspaceName): AstraDBDatabase {
    if (!keyspace) {
      return this.defaultDb;
    }

    // Return cached database instance or create new one
    switch (keyspace) {
      case ASTRA_KEYSPACES.FREELANCER:
        if (!this.dbFreelancer) {
          this.dbFreelancer = this.client.db(this.config.endpoint, {
            keyspace: ASTRA_KEYSPACES.FREELANCER,
          }) as AstraDBDatabase;
        }
        return this.dbFreelancer;

      case ASTRA_KEYSPACES.CHATBOT:
        if (!this.dbChatbot) {
          this.dbChatbot = this.client.db(this.config.endpoint, {
            keyspace: ASTRA_KEYSPACES.CHATBOT,
          }) as AstraDBDatabase;
        }
        return this.dbChatbot;

      case ASTRA_KEYSPACES.REPORT:
        if (!this.dbReport) {
          this.dbReport = this.client.db(this.config.endpoint, {
            keyspace: ASTRA_KEYSPACES.REPORT,
          }) as AstraDBDatabase;
        }
        return this.dbReport;

      case ASTRA_KEYSPACES.UMKM:
        if (!this.dbUmkm) {
          this.dbUmkm = this.client.db(this.config.endpoint, {
            keyspace: ASTRA_KEYSPACES.UMKM,
          }) as AstraDBDatabase;
        }
        return this.dbUmkm;

      default:
        return this.defaultDb;
    }
  }

  /**
   * Get the Freelancer keyspace database
   */
  public getFreelancerDB(): AstraDBDatabase {
    return this.getDatabase(ASTRA_KEYSPACES.FREELANCER);
  }

  /**
   * Get database instance (default)
   */
  public getDefaultDatabase() {
    return this.defaultDb;
  }

  /**
   * Get collection by name from default keyspace (backward compatibility)
   * @param collectionName - Name of the collection
   */
  public getCollection(collectionName: string) {
    return this.defaultDb.collection(collectionName);
  }

  /**
   * Get collection from a specific keyspace
   * @param keyspace - Name of the keyspace
   * @param collectionName - Name of the collection
   */
  public getCollectionFromKeyspace(
    keyspace: AstraKeyspaceName,
    collectionName: string
  ) {
    const db = this.getDatabase(keyspace);
    return db.collection(collectionName);
  }

  /**
   * Check connection status
   */
  public async checkConnection(): Promise<boolean> {
    try {
      // Try to list collections as a connection check
      await this.defaultDb.listCollections();
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
      const collection = await this.defaultDb.createCollection(collectionName);
      console.log(`Collection '${collectionName}' created successfully`);
      return collection;
    } catch (error) {
      console.error(`Failed to create collection '${collectionName}':`, error);
      throw error;
    }
  }

  //   List all collections

  public async listCollections(keyspace?: AstraKeyspaceName) {
    try {
      const db = keyspace ? this.getDatabase(keyspace) : this.defaultDb;
      const collections = await db.listCollections();
      return collections;
    } catch (error) {
      console.error("Failed to list collections:", error);
      throw error;
    }
  }

  /**
   * Delete a collection
    @param collectionName - Name of the collection to delete
   */
  public async deleteCollection(collectionName: string) {
    try {
      await this.defaultDb.dropCollection(collectionName);
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

