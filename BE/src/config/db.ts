// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env file variables

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!mongoUri) {
  console.error(
    "FATAL ERROR: MONGODB_URI environment variable is not defined.",
  );
  process.exit(1); // Exit if URI is not set
}

// Construct the full URI if dbName is provided, otherwise use the base URI
// Atlas URIs often include a default DB, but this allows overriding/specifying
const fullUri = dbName
  ? `${mongoUri}/${dbName}?retryWrites=true&w=majority`
  : mongoUri;

export const connectDB = async (): Promise<void> => {
  try {
    // Log the URI without credentials for debugging (be careful in production logs)
    const uriToLog = mongoUri.replace(
      /\/\/([^:]+):([^@]+)@/,
      "//<username>:<password>@",
    );
    console.log(`Attempting to connect to MongoDB at: ${uriToLog}`);
    if (dbName) {
      console.log(`Database name: ${dbName}`);
    }

    await mongoose.connect(fullUri);

    console.log("MongoDB connected successfully using Mongoose!");

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected.");
    });
  } catch (err) {
    console.error(`Failed to connect to MongoDB: ${err}`);
    // Exit process on initial connection failure
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
