/**
 * Test Report API directly
 * Run with: npx tsx apps/home/scripts/test-report-api.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from apps/home/.env
config({ path: resolve(__dirname, "../.env") });

async function testReportAPI() {
  console.log("=== Testing Report API Logic ===\n");

  const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
  const endpoint = process.env.ASTRA_DB_API_ENDPOINT;

  if (!token || !endpoint) {
    console.error("❌ Missing environment variables!");
    process.exit(1);
  }

  try {
    const { DataAPIClient } = await import("@datastax/astra-db-ts");

    console.log("1. Connecting to AstraDB...");
    const client = new DataAPIClient(token);

    console.log("2. Connecting to 'report' keyspace...");
    const reportDB = client.db(endpoint, { keyspace: "report" });

    console.log("3. Getting 'report' collection...");
    const collection = reportDB.collection("report");

    console.log("4. Inserting test document...");
    const testDoc = {
      fullName: "Test User",
      email: "test@example.com",
      description: "This is a test report from script",
      createdAt: new Date(),
      status: "new",
    };

    const result = await collection.insertOne(testDoc);
    console.log("✅ Insert successful!");
    console.log("   Result:", result);

    console.log("\n5. Verifying by finding the document...");
    const found = await collection.findOne({ email: "test@example.com" });
    console.log("   Found:", found ? "Yes" : "No");
    if (found) {
      console.log("   Document:", JSON.stringify(found, null, 2));
    }

    console.log("\n=== Test Complete ===");
  } catch (error) {
    console.error("\n❌ Error occurred:");
    console.error(error);
    process.exit(1);
  }
}

testReportAPI();
