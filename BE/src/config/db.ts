// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env file variables (primarily for non-Docker runs)

// Read variables passed by Docker Compose environment
//const mongoUri_base = process.env.MONGODB_URI; // Reads base URI e.g., mongodb://user:pass@mongo:27017
const mongoUri_base = "mongodb://localhost:27017/DeFi";
//const dbName = process.env.MONGODB_DB_NAME;
const dbName = "DeFi";

if (!mongoUri_base) {
  console.error(
    "FATAL ERROR: MONGODB_URI environment variable is not defined."
  );
  process.exit(1);
}

// Construct the full URI: Append DB name and explicitly add authSource=admin
// Ensure base URI doesn't already contain query params before appending
const baseUri = mongoUri_base.split("?")[0];
const dbPart = dbName ? `/${dbName}` : "";

// Define standard options, including authSource
const optionsPart = "?authSource=admin&retryWrites=true&w=majority";

//const fullUri = `${baseUri}${dbPart}${optionsPart}`;
const fullUri = mongoUri_base;

export const connectDB = async (): Promise<void> => {
  try {
    const uriToLog = mongoUri_base.replace(
      /\/\/([^:]+):([^@]+)@/,
      "//<username>:<password>@"
    );
    console.log(`Base URI from env: ${uriToLog}`);
    console.log(
      `Attempting to connect with full URI: ${fullUri.replace(
        /\/\/([^:]+):([^@]+)@/,
        "//<username>:<password>@"
      )}`
    ); // Log full URI safely
    if (dbName) {
      console.log(`Target Database name: ${dbName}`);
    }

    await mongoose.connect(fullUri); // Use the explicitly constructed URI

    console.log("MongoDB connected successfully using Mongoose!");

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected.");
    });
  } catch (err) {
    console.error(`Failed to connect to MongoDB: ${err}`);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("Mongoose connection closed.");
  } catch (err) {
    console.error("Error closing Mongoose connection:", err);
  }
};
