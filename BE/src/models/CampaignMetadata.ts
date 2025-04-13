// src/models/CampaignMetadata.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaignMetadata extends Document {
  frontendTrackerId: string; // New field for frontend tracking
  creatorWalletAddress: string;
  title: string;
  description: string;
  fullDescription: string;
  imageUrl?: string; // Base64 data URI
  videoUrl?: string;
  category?: string;
  timeline?: string;
  aboutYou?: string;
  fundingGoal?: number;
  duration?: number;
  updates?: Array<{ message: string; timestamp: Date }>;
  createdAt: Date;
  updatedAt: Date;
}

const campaignMetadataSchema: Schema<ICampaignMetadata> = new Schema(
  {
    frontendTrackerId: {
      // Unique identifier provided by the frontend for this specific submission
      type: String,
      required: [true, "Frontend tracker ID is required"],
      unique: true, // Ensure each metadata entry has a unique tracker ID
      trim: true,
      index: true, // Index for faster lookups if needed
    },
    creatorWalletAddress: {
      type: String,
      required: [true, "Creator wallet address is required"],
      trim: true,
      index: true,
      // match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format']
    },
    title: {
      type: String,
      required: [true, "Campaign title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: false, // Keep Base64 data intact
      // WARNING: Potential 16MB document size limit issue.
    },
    videoUrl: { type: String, trim: true },
    category: { type: String, trim: true },
    timeline: { type: String, trim: true },
    aboutYou: { type: String, trim: true },
    fundingGoal: {
      type: Number,
      required: [true, "Funding goal is required"],
      min: [0, "Funding goal cannot be negative"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1"],
    },
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

// // Indexing
// campaignMetadataSchema.index({ frontendTrackerId: 1 }); // Already added via 'index: true' above, but explicit doesn't hurt
// campaignMetadataSchema.index({ creatorWalletAddress: 1 });
// campaignMetadataSchema.index({ category: 1 });
// campaignMetadataSchema.index({ fundingGoal: 1 });
// campaignMetadataSchema.index({ title: "text", description: "text" });

const CampaignMetadata: Model<ICampaignMetadata> =
  mongoose.model<ICampaignMetadata>(
    "CampaignMetadata",
    campaignMetadataSchema,
    "campaign_metadata"
  );

export default CampaignMetadata;
