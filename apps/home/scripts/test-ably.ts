import * as Ably from "ably";
import * as fs from "fs";
import * as path from "path";

// Helper to load .env manually since dotenv might not be installed
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    console.log("Loading .env from:", envPath);
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      line = line.trim();
      if (!line || line.startsWith("#")) return;

      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  } else {
    console.warn(".env file not found at:", envPath);
  }
}

loadEnv();

const apiKey =
  process.env.ABLY_API_KEY ||
  process.env.NEXT_PUBLIC_ABLY_API_KEY ||
  process.env.NEXT_PUBLIC_NEXT_PUBLIC_ABLY_API_KEY;

if (!apiKey) {
  console.error(
    "Error: ABLY_API_KEY or NEXT_PUBLIC_ABLY_API_KEY not found in environment variables."
  );
  console.error(
    "Please ensure you have defined one of these in your .env file."
  );
  process.exit(1);
}

async function testConnection() {
  console.log("Attempting to connect to Ably...");

  try {
    const realtime = new Ably.Realtime({ key: apiKey });

    realtime.connection.on("connected", () => {
      console.log("✅ Successfully connected to Ably!");
      console.log("Connection ID:", realtime.connection.id);

      // Close connection and exit
      realtime.close();
      setTimeout(() => process.exit(0), 100);
    });

    realtime.connection.on("failed", (err) => {
      console.error("❌ Failed to connect to Ably:", err.reason);
      process.exit(1);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

testConnection();
