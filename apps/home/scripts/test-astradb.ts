/**
 * AstraDB Keyspace Connection Test Script
 * Run with: npx tsx apps/home/scripts/test-astradb.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from apps/home/.env
config({ path: resolve(__dirname, "../.env") });

const KEYSPACES = ["freelancer", "chatbot", "report"] as const;

async function testAstraDBConnection() {
  console.log("=== AstraDB Keyspace Connection Test ===\n");

  // Check environment variables
  const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
  const endpoint = process.env.ASTRA_DB_API_ENDPOINT;

  console.log("Environment Variables Check:");
  console.log(
    `- ASTRA_DB_APPLICATION_TOKEN: ${token ? "✅ Set (" + token.substring(0, 20) + "...)" : "❌ Missing"}`
  );
  console.log(
    `- ASTRA_DB_API_ENDPOINT: ${endpoint ? "✅ Set (" + endpoint + ")" : "❌ Missing"}`
  );
  console.log("");

  if (!token || !endpoint) {
    console.error("❌ Missing required environment variables!");
    console.log("\nPlease add the following to your apps/home/.env file:");
    console.log("ASTRA_DB_APPLICATION_TOKEN=your_token_here");
    console.log("ASTRA_DB_API_ENDPOINT=your_endpoint_here");
    process.exit(1);
  }

  try {
    // Import AstraDB client
    const { DataAPIClient } = await import("@datastax/astra-db-ts");

    console.log("Initializing AstraDB client...\n");
    const client = new DataAPIClient(token);

    // Test default connection first
    console.log("=== Testing Default Connection ===\n");
    const defaultDb = client.db(endpoint);
    try {
      const defaultCollections = await defaultDb.listCollections();
      console.log("✅ Default connection successful!");
      console.log(
        "   Collections:",
        defaultCollections.map((c: { name: string }) => c.name)
      );
    } catch (error) {
      console.error("❌ Default connection failed:", error);
    }

    console.log("\n=== Testing Keyspace Connections ===\n");

    // Test each keyspace
    for (const keyspace of KEYSPACES) {
      console.log(`Testing keyspace: '${keyspace}'...`);

      try {
        const db = client.db(endpoint, { keyspace });
        const collections = await db.listCollections();
        console.log(`✅ '${keyspace}' keyspace - Connected successfully!`);
        console.log(
          `   Collections:`,
          collections.length > 0
            ? collections.map((c: { name: string }) => c.name)
            : "(empty)"
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(`❌ '${keyspace}' keyspace - Connection failed!`);
        console.error(`   Error: ${errorMessage}`);

        // Suggest creating the keyspace if it doesn't exist
        if (
          errorMessage.includes("KEYSPACE_DOES_NOT_EXIST") ||
          errorMessage.includes("keyspace")
        ) {
          console.log(
            `   💡 Hint: You may need to create the '${keyspace}' keyspace in AstraDB dashboard.`
          );
        }
      }
      console.log("");
    }

    console.log("=== Test Complete ===");
  } catch (error) {
    console.error("\n❌ Failed to initialize AstraDB client!");
    console.error("Error:", error);
    process.exit(1);
  }
}

testAstraDBConnection();
