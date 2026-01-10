import { DataAPIClient } from "@datastax/astra-db-ts";

interface AstraDBChatConfig {
  token: string;
  endpoint: string;
}

interface AstraDBDatabase {
  collection(collectionName: string): unknown;
  createCollection(collectionName: string): Promise<unknown>;
  listCollections(): Promise<{ name: string }[]>;
  dropCollection(collectionName: string): Promise<unknown>;
  command(command: unknown): Promise<unknown>;
}

class AstraDBChatClient {
  private static instance: AstraDBChatClient | null = null;
  private client: DataAPIClient;
  private config: AstraDBChatConfig;

  private dbHistory: AstraDBDatabase | null = null;

  private constructor(config: AstraDBChatConfig) {
    this.config = config;
    this.client = new DataAPIClient(this.config.token);
  }
  
  public static getInstance(): AstraDBChatClient {
    if (!AstraDBChatClient.instance) {
      const token = process.env.ASTRA_DB_TOKEN_CHAT;
      const endpoint = process.env.ASTRA_DB_ENDPOINT_CHAT;

      if (!token || !endpoint) {
        throw new Error(
          "AstraDB Chat credentials missing. Please check ASTRA_DB_TOKEN_CHAT and ASTRA_DB_ENDPOINT_CHAT in .env file"
        );
      }

      AstraDBChatClient.instance = new AstraDBChatClient({ token, endpoint });
    }

    return AstraDBChatClient.instance;
  }

  public getDatabase(): AstraDBDatabase {
    if (!this.dbHistory) {
      this.dbHistory = this.client.db(this.config.endpoint, {
        keyspace: "history",
      }) as AstraDBDatabase;
    }
    return this.dbHistory;
  }

  public getCollection(collectionName: string = "history") {
    const db = this.getDatabase();
    return db.collection(collectionName);
  }

  public async checkConnection(): Promise<boolean> {
    try {
      const db = this.getDatabase();
      await db.listCollections();
      return true;
    } catch (error) {
      console.error("AstraDB Chat History connection failed:", error);
      return false;
    }
  }

  public async createCollection(collectionName: string) {
    try {
      const db = this.getDatabase();
      const collection = await db.createCollection(collectionName);
      console.log(
        `Collection '${collectionName}' created in chat history database successfully`
      );
      return collection;
    } catch (error) {
      console.error(
        `Failed to create collection '${collectionName}' in chat history:`,
        error
      );
      throw error;
    }
  }

  public async listCollections() {
    try {
      const db = this.getDatabase();
      const collections = await db.listCollections();
      return collections;
    } catch (error) {
      console.error("Failed to list chat history collections:", error);
      throw error;
    }
  }

  public async deleteCollection(collectionName: string) {
    try {
      const db = this.getDatabase();
      await db.dropCollection(collectionName);
      console.log(
        `Collection '${collectionName}' deleted from chat history successfully`
      );
      return true;
    } catch (error) {
      console.error(
        `Failed to delete collection '${collectionName}' from chat history:`,
        error
      );
      throw error;
    }
  }
}

export const getChatHistoryDB = () => AstraDBChatClient.getInstance();

export type { AstraDBChatConfig };
export { AstraDBChatClient };
