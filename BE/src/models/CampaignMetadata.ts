// src/models/CampaignMetadata.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User"; // Import User interface if referencing

export interface ICampaignMetadata extends Document {
  contractAddress: string; // Link to the deployed Campaign smart contract
  creatorWalletAddress: string; // Denormalized for easier lookup? Or use populate
  creator: mongoose.Types.ObjectId | IUser; // Reference to the User document
  title: string;
  description: string; // Rich text description
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
  updates?: Array<{ message: string; timestamp: Date }>;
  // Add other fields suitable for off-chain storage
  createdAt: Date;
  updatedAt: Date;
}

const campaignMetadataSchema: Schema<ICampaignMetadata> = new Schema(
  {
    contractAddress: {
      // Address of the corresponding Campaign contract on the blockchain
      type: String,
      required: true,
      unique: true, // Each metadata doc maps to one unique contract
      trim: true,
      // Add validation for address format if desired
      // match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address format']
    },
    creatorWalletAddress: {
      // Optional: Denormalize for querying, but ensure consistency
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      // Link to the User document in the 'users' collection
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the 'User' model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: { type: String, trim: true },
    videoUrl: { type: String, trim: true },
    category: { type: String, trim: true },
    updates: [
      {
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexing for common queries
campaignMetadataSchema.index({ creator: 1 });
campaignMetadataSchema.index({ category: 1 });
campaignMetadataSchema.index({ title: "text", description: "text" }); // For text search

const CampaignMetadata: Model<ICampaignMetadata> =
  mongoose.model<ICampaignMetadata>(
    "CampaignMetadata", // Model name
    campaignMetadataSchema, // Schema
    "campaign_metadata" // Explicit collection name
  );

export default CampaignMetadata;
