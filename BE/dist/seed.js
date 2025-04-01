"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/seed.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User")); // Import User model
const CampaignMetadata_1 = __importDefault(require("./models/CampaignMetadata")); // Import Campaign model
const seedData_1 = require("./config/seedData"); // Import demo data
dotenv_1.default.config(); // Load .env variables
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
const connectAndSeed = () => __awaiter(void 0, void 0, void 0, function* () {
    let connection; // Keep track of the connection
    try {
        console.log("Attempting to connect to MongoDB for seeding...");
        // Use createConnection to get a connection object we can close reliably
        //connection = await mongoose.createConnection(fullUri).asPromise();
        connection = yield mongoose_1.default.createConnection(mongoUri).asPromise();
        console.log("MongoDB connected for seeding.");
        // Get models from the specific connection
        const UserDB = connection.model("User", User_1.default.schema);
        const CampaignMetadataDB = connection.model("CampaignMetadata", CampaignMetadata_1.default.schema);
        // --- Seeding Logic ---
        // Clear existing data (Use with caution!)
        console.log("Clearing existing campaign metadata...");
        yield CampaignMetadataDB.deleteMany({});
        console.log("Clearing existing users...");
        yield UserDB.deleteMany({});
        // Seed Users
        console.log("Seeding demo users...");
        const createdUsers = yield UserDB.insertMany(seedData_1.demoUsersSeed);
        console.log(`${createdUsers.length} users seeded successfully.`);
        // Create a map of walletAddress -> userId for easy lookup
        const userWalletMap = new Map();
        createdUsers.forEach((user) => {
            // Ensure walletAddress exists and user._id exists before adding to map
            if (user.walletAddress && user._id) {
                userWalletMap.set(user.walletAddress, user._id);
            }
            else {
                console.warn(`User missing walletAddress or _id during seeding: ${user.name}`);
            }
        });
        // Prepare Campaign Metadata with correct creator ObjectId references
        const campaignsToSeed = seedData_1.demoCampaignsSeed
            .map((campaign) => {
            const creatorId = userWalletMap.get(campaign.creatorWalletAddress);
            if (!creatorId) {
                console.warn(`Could not find user ID for creator wallet: ${campaign.creatorWalletAddress} for campaign: ${campaign.title}`);
                // Decide how to handle: skip campaign, use a default user, throw error?
                // For now, let's filter it out later if creatorId is undefined
                return null; // Mark for filtering
            }
            return Object.assign(Object.assign({}, campaign), { creator: creatorId });
        })
            .filter((campaign) => campaign !== null); // Remove campaigns where creator wasn't found
        // Seed Campaign Metadata
        if (campaignsToSeed.length > 0) {
            console.log("Seeding demo campaign metadata...");
            const createdCampaigns = yield CampaignMetadataDB.insertMany(campaignsToSeed);
            console.log(`${createdCampaigns.length} campaign metadata entries seeded successfully.`);
        }
        else {
            console.log("No valid campaign metadata entries to seed.");
        }
        // --- End Seeding Logic ---
    }
    catch (error) {
        console.error("Error during seeding process:", error);
        process.exit(1); // Exit with error on failure
    }
    finally {
        // Ensure disconnection even if errors occur
        if (connection) {
            console.log("Disconnecting MongoDB...");
            yield connection.close();
            console.log("MongoDB disconnected.");
        }
    }
});
// Run the seeding function
connectAndSeed();
