// src/seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User"; // Import User model
import CampaignMetadata from "./models/CampaignMetadata"; // Import Campaign model
import { demoUsersSeed, demoCampaignsSeed } from "./config/seedData"; // Import demo data

dotenv.config(); // Load .env variables

//const mongoUri = process.env.MONGODB_URI;
const mongoUri = "mongodb://localhost:27017/DeFi";
//const dbName = process.env.MONGODB_DB_NAME;
const dbName = "DeFi";

// if (!mongoUri) {
//   console.error(
//     "FATAL ERROR: MONGODB_URI environment variable is not defined for seeding."
//   );
//   process.exit(1);
// }

// Add authSource=admin for consistency
const baseUri = mongoUri.split("?")[0];
const dbPart = dbName ? `/${dbName}` : "";
const optionsPart = "?authSource=admin&retryWrites=true&w=majority";
const fullUri = `${baseUri}${dbPart}${optionsPart}`;

const connectAndSeed = async () => {
  let connection; // Keep track of the connection
  try {
    console.log("Attempting to connect to MongoDB for seeding...");
    // Use createConnection to get a connection object we can close reliably
    //connection = await mongoose.createConnection(fullUri).asPromise();
    connection = await mongoose.createConnection(mongoUri).asPromise();
    console.log("MongoDB connected for seeding.");

    // Get models from the specific connection
    const UserDB = connection.model<mongoose.Document & any>(
      "User",
      User.schema
    );
    const CampaignMetadataDB = connection.model<mongoose.Document & any>(
      "CampaignMetadata",
      CampaignMetadata.schema
    );

    // --- Seeding Logic ---

    // Clear existing data (Use with caution!)
    console.log("Clearing existing campaign metadata...");
    await CampaignMetadataDB.deleteMany({});
    console.log("Clearing existing users...");
    await UserDB.deleteMany({});

    // Seed Users
    console.log("Seeding demo users...");
    const createdUsers = await UserDB.insertMany(demoUsersSeed);
    console.log(`${createdUsers.length} users seeded successfully.`);

    // Create a map of walletAddress -> userId for easy lookup
    const userWalletMap = new Map<string, mongoose.Types.ObjectId>();
    createdUsers.forEach((user) => {
      // Ensure walletAddress exists and user._id exists before adding to map
      if (user.walletAddress && user._id) {
        userWalletMap.set(user.walletAddress, user._id);
      } else {
        console.warn(
          `User missing walletAddress or _id during seeding: ${user.name}`
        );
      }
    });

    // Prepare Campaign Metadata with correct creator ObjectId references
    const campaignsToSeed = demoCampaignsSeed
      .map((campaign) => {
        const creatorId = userWalletMap.get(campaign.creatorWalletAddress);
        if (!creatorId) {
          console.warn(
            `Could not find user ID for creator wallet: ${campaign.creatorWalletAddress} for campaign: ${campaign.title}`
          );
          // Decide how to handle: skip campaign, use a default user, throw error?
          // For now, let's filter it out later if creatorId is undefined
          return null; // Mark for filtering
        }
        return {
          ...campaign,
          creator: creatorId, // Assign the actual ObjectId
        };
      })
      .filter((campaign) => campaign !== null); // Remove campaigns where creator wasn't found

    // Seed Campaign Metadata
    if (campaignsToSeed.length > 0) {
      console.log("Seeding demo campaign metadata...");
      const createdCampaigns = await CampaignMetadataDB.insertMany(
        campaignsToSeed
      );
      console.log(
        `${createdCampaigns.length} campaign metadata entries seeded successfully.`
      );
    } else {
      console.log("No valid campaign metadata entries to seed.");
    }

    // --- End Seeding Logic ---
  } catch (error) {
    console.error("Error during seeding process:", error);
    process.exit(1); // Exit with error on failure
  } finally {
    // Ensure disconnection even if errors occur
    if (connection) {
      console.log("Disconnecting MongoDB...");
      await connection.close();
      console.log("MongoDB disconnected.");
    }
  }
};

// Run the seeding function
connectAndSeed();
