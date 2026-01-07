/**
 * Database Connection Testing Script
 * Tests connectivity to AstraDB, MongoDB, and Supabase
 */

// Load environment variables from .env file
import { config } from "dotenv";
import { resolve } from "path";

// Load .env file
config({ path: resolve(__dirname, ".env") });

import { getAstraDB } from "./app/lib/db/astradb";
import { getMongoDB } from "./app/lib/db/mongodb";
import { getSupabase } from "./app/lib/db/supabase";
import { initializeDatabases } from "./app/lib/db";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

interface AstraMetadata {
  collectionsCount: number;
  collections: string[];
}

interface MongoMetadata {
  defaultDatabase: string;
  totalDatabases: number;
  databases: string[];
  collectionsCount: number;
  collections: string[];
}

interface SupabaseMetadata {
  status: string;
}

type DatabaseMetadata = AstraMetadata | MongoMetadata | SupabaseMetadata;

interface TestResult {
  database: string;
  connected: boolean;
  error?: string;
  metadata?: DatabaseMetadata;
}

/**
 * Test AstraDB connection
 */
async function testAstraDB(): Promise<TestResult> {
  console.log(`\n${colors.cyan}🧪 Testing AstraDB...${colors.reset}`);

  try {
    const astraClient = getAstraDB();
    const isConnected = await astraClient.checkConnection();

    if (isConnected) {
      // Try to list collections
      const collectionsRaw = await astraClient.listCollections();
      const collections: unknown[] = Array.isArray(collectionsRaw)
        ? collectionsRaw
        : [];

      console.log(
        `${colors.green}✓ AstraDB connected successfully${colors.reset}`
      );
      console.log(
        `  Collections: ${collections.length > 0 ? collections.length : "None"}`
      );

      return {
        database: "AstraDB",
        connected: true,
        metadata: {
          collectionsCount: collections.length,
          collections: collections.map(
            (c: unknown) => (c as { name: string }).name
          ),
        },
      };
    } else {
      console.log(`${colors.red}✗ AstraDB connection failed${colors.reset}`);
      return {
        database: "AstraDB",
        connected: false,
        error: "Connection check returned false",
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`${colors.red}✗ AstraDB error: ${errorMessage}${colors.reset}`);
    return {
      database: "AstraDB",
      connected: false,
      error: errorMessage,
    };
  }
}

/**
 * Test MongoDB connection
 */
async function testMongoDB(): Promise<TestResult> {
  console.log(`\n${colors.cyan}🧪 Testing MongoDB...${colors.reset}`);

  try {
    const mongoClient = getMongoDB();
    const isConnected = await mongoClient.checkConnection();

    if (isConnected) {
      // Get database info
      const databases = await mongoClient.listDatabases();
      const collections = await mongoClient.listCollections();

      console.log(
        `${colors.green}✓ MongoDB connected successfully${colors.reset}`
      );
      console.log(`  Default Database: freelinkd_db`);
      console.log(`  Total Databases: ${databases.length}`);
      console.log(`  Collections in freelinkd_db: ${collections.length}`);

      return {
        database: "MongoDB",
        connected: true,
        metadata: {
          defaultDatabase: "freelinkd_db",
          totalDatabases: databases.length,
          databases: databases.map((db: { name: string }) => db.name),
          collectionsCount: collections.length,
          collections: collections.map((c: { name: string }) => c.name),
        },
      };
    } else {
      console.log(`${colors.red}✗ MongoDB connection failed${colors.reset}`);
      return {
        database: "MongoDB",
        connected: false,
        error: "Connection check returned false",
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`${colors.red}✗ MongoDB error: ${errorMessage}${colors.reset}`);
    return {
      database: "MongoDB",
      connected: false,
      error: errorMessage,
    };
  }
}

/**
 * Test Supabase connection
 */
async function testSupabase(): Promise<TestResult> {
  console.log(`\n${colors.cyan}🧪 Testing Supabase...${colors.reset}`);

  try {
    const supabaseClient = getSupabase();
    const isConnected = await supabaseClient.checkConnection();

    if (isConnected) {
      console.log(
        `${colors.green}✓ Supabase connected successfully${colors.reset}`
      );
      console.log(`  Client ready for queries`);

      return {
        database: "Supabase",
        connected: true,
        metadata: {
          status: "ready",
        },
      };
    } else {
      console.log(`${colors.red}✗ Supabase connection failed${colors.reset}`);
      return {
        database: "Supabase",
        connected: false,
        error: "Connection check returned false",
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(
      `${colors.red}✗ Supabase error: ${errorMessage}${colors.reset}`
    );
    return {
      database: "Supabase",
      connected: false,
      error: errorMessage,
    };
  }
}

/**
 * Run all database tests
 */
async function runTests() {
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════${colors.reset}`
  );
  console.log(
    `${colors.blue}    DATABASE CONNECTION TESTING - QA REPORT${colors.reset}`
  );
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════${colors.reset}`
  );

  const startTime = Date.now();
  const results: TestResult[] = [];

  // Test each database
  results.push(await testAstraDB());
  results.push(await testMongoDB());
  results.push(await testSupabase());

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.yellow}📊 TEST SUMMARY${colors.reset}`);
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════${colors.reset}`
  );

  const successCount = results.filter((r) => r.connected).length;
  const failCount = results.filter((r) => !r.connected).length;

  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`${colors.green}✓ Passed: ${successCount}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${failCount}${colors.reset}`);
  console.log(`Duration: ${duration}s`);

  // Detailed results
  console.log(`\n${colors.yellow}Detailed Results:${colors.reset}`);
  results.forEach((result) => {
    const status = result.connected
      ? `${colors.green}PASS${colors.reset}`
      : `${colors.red}FAIL${colors.reset}`;
    console.log(`\n  [${status}] ${result.database}`);

    if (result.connected && result.metadata) {
      console.log(
        `    Metadata:`,
        JSON.stringify(result.metadata, null, 2).split("\n").join("\n    ")
      );
    }

    if (!result.connected && result.error) {
      console.log(`    ${colors.red}Error: ${result.error}${colors.reset}`);
    }
  });

  // Test using unified initialization function
  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`
  );
  console.log(
    `${colors.yellow}📋 Testing Unified Initialization${colors.reset}`
  );
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`
  );

  const unifiedResults = await initializeDatabases();
  console.log("Unified initialization results:", unifiedResults);

  console.log(
    `\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.green}✨ Testing Complete!${colors.reset}`);
  console.log(
    `${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`
  );

  // Exit with appropriate code
  process.exit(failCount > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error(
    `\n${colors.red}Fatal error during testing:${colors.reset}`,
    error
  );
  process.exit(1);
});
