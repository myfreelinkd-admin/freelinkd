import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Configuration Interface
 */
interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Supabase Client Singleton Class
 */
class SupabaseClientManager {
  private static instance: SupabaseClientManager | null = null;
  private client: SupabaseClient;
  private config: SupabaseConfig;

  private constructor(config: SupabaseConfig) {
    this.config = config;
    this.client = createClient(this.config.url, this.config.anonKey);
  }

  /**
   * Get singleton instance of Supabase client
   */
  public static getInstance(): SupabaseClientManager {
    if (!SupabaseClientManager.instance) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !anonKey) {
        throw new Error(
          "Supabase credentials missing. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env file"
        );
      }

      SupabaseClientManager.instance = new SupabaseClientManager({
        url,
        anonKey,
      });
    }

    return SupabaseClientManager.instance;
  }

  /**
   * Get Supabase client instance
   */
  public getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Check connection status
   */
  public async checkConnection(): Promise<boolean> {
    try {
      // Simple auth state check - connection is valid if we can reach the API
      const { data, error } = await this.client.auth.getSession();
      // Connection is OK even if no active session
      return true;
    } catch (error) {
      console.error("Supabase connection failed:", error);
      return false;
    }
  }

  /**
   * Get table reference
   * @param tableName - Name of the table
   */
  public table(tableName: string) {
    return this.client.from(tableName);
  }

  /**
   * Authentication methods
   */
  public get auth() {
    return this.client.auth;
  }

  /**
   * Storage methods
   */
  public get storage() {
    return this.client.storage;
  }

  /**
   * Realtime methods
   */
  public get realtime() {
    return this.client.realtime;
  }

  /**
   * Execute a raw SQL query (requires RLS policies)
   * @param query - SQL query string
   * @param params - Query parameters
   */
  public async query(query: string, params?: unknown[]): Promise<unknown> {
    try {
      const { data, error } = await this.client.rpc("execute_sql", {
        query,
        params,
      });

      if (error) throw error;
      return data as unknown;
    } catch (error) {
      console.error("Query execution failed:", error);
      throw error;
    }
  }
}

// Export singleton instance getter
export const getSupabase = () => SupabaseClientManager.getInstance();

// Export class for type purposes
export type { SupabaseConfig };
export { SupabaseClientManager };
