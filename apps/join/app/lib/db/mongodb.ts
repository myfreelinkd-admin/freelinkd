import {
  MongoClient,
  Db,
  ServerApiVersion,
  Collection,
  Document,
} from "mongodb";

interface MongoDBConfig {
  uri: string;
  defaultDbName?: string;
}

/**
 * MongoDB Client Singleton Class
 */
class MongoDBClientManager {
  private static instance: MongoDBClientManager | null = null;
  private client: MongoClient;
  private config: MongoDBConfig;
  private db: Db | null = null;
  private isConnected: boolean = false;
  private readonly DEFAULT_DB_NAME = "freelinkd_db";

  private constructor(config: MongoDBConfig) {
    this.config = config;
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    this.client = new MongoClient(this.config.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  // Get singleton instance of MongoDB client

  public static getInstance(): MongoDBClientManager {
    if (!MongoDBClientManager.instance) {
      const uri = process.env.MONGODB_URI;

      if (!uri) {
        throw new Error(
          "MongoDB URI missing. Please check MONGODB_URI in .env file"
        );
      }

      MongoDBClientManager.instance = new MongoDBClientManager({ uri });
    }

    return MongoDBClientManager.instance;
  }

  // Connect to MongoDB

  private async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.isConnected = true;
        console.log("MongoDB connected successfully");
      } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
      }
    }
  }

  // Get MongoDB client instance

  public async getClient(): Promise<MongoClient> {
    await this.connect();
    return this.client;
  }

  /**
   * Get database instance
   * @param dbName - Database name (optional, defaults to 'freelinkd_db')
   */
  public async getDatabase(dbName?: string): Promise<Db> {
    await this.connect();

    const targetDbName = dbName || this.DEFAULT_DB_NAME;

    if (dbName) {
      return this.client.db(targetDbName);
    }

    if (!this.db) {
      this.db = this.client.db(this.DEFAULT_DB_NAME);
    }

    return this.db;
  }

  /**
   * Get collection from database
   * @param collectionName - Name of the collection
   * @param dbName - Database name (optional, defaults to 'freelinkd_db')
   */
  public async getCollection<T extends Document = Document>(
    collectionName: string,
    dbName?: string
  ): Promise<Collection<T>> {
    const database = await this.getDatabase(dbName);
    return database.collection<T>(collectionName);
  }

  // Check connection status

  public async checkConnection(): Promise<boolean> {
    try {
      await this.connect();
      await this.client.db("admin").command({ ping: 1 });
      return true;
    } catch (error) {
      console.error("MongoDB connection check failed:", error);
      return false;
    }
  }

  //  List all databases

  public async listDatabases() {
    try {
      await this.connect();
      const result = await this.client.db().admin().listDatabases();
      return result.databases;
    } catch (error) {
      console.error("Failed to list databases:", error);
      throw error;
    }
  }

  /**
   * List all collections in a database
   * @param dbName - Database name (optional, defaults to 'freelinkd_db')
   */
  public async listCollections(dbName?: string) {
    try {
      const database = await this.getDatabase(dbName);
      const collections = await database.listCollections().toArray();
      return collections;
    } catch (error) {
      console.error("Failed to list collections:", error);
      throw error;
    }
  }

  //  Close MongoDB connection

  public async close(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log("MongoDB connection closed");
    }
  }
}

// Export singleton instance getter
export const getMongoDB = () => MongoDBClientManager.getInstance();

// Export class for type purposes
export type { MongoDBConfig };
export { MongoDBClientManager };
