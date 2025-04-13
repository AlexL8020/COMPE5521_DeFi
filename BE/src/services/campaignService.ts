// ./Proj/BE/src/services/campaignService.ts
import CampaignMetadata from "../models/CampaignMetadata";
import User from "../models/User";
import { blockchainService } from "./blockchainService";
import {
  CreateCampaignInput,
  CampaignCreationResult,
  CampaignDetailsResult,
} from "../types/campaignTypes"; // Import DTOs/types


// Define the expected request body structure from the frontend
// src/types/campaign.ts (or a relevant types file)

import { Document, Types } from 'mongoose';

// Interface for MongoDB document (assuming it's based on previous schema)
export interface ICampaignMetadata extends Document {
  frontendTrackerId: string;
  creatorWalletAddress: string;
  title: string;
  description: string;
  fullDescription: string;
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
  timeline?: string;
  aboutYou?: string;
  fundingGoal?: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
  // Add any other fields from your actual schema
}

// Interface for the data structure from the "other service"
export interface BlockchainCampaignInfo {
  campaignId: number; // Or string, depending on source
  creator: string;
  goal: string; // Keep as string as per example
  deadline: number; // Unix timestamp
  amountRaised: string; // Keep as string as per example
  claimed: boolean;
  active: boolean;
  frontendTrackerId: string;
}

// Interface for the final merged data structure
export interface MergedCampaignData {
  // --- Fields from MongoDB Metadata ---
  _id: Types.ObjectId; // MongoDB document ID
  mongoCreatorWalletAddress: string; // Renamed to avoid conflict
  title: string;
  description: string;
  fullDescription: string;
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
  timeline?: string;
  aboutYou?: string;
  mongoFundingGoal?: number; // Renamed
  mongoDuration?: number; // Renamed
  metadataCreatedAt: Date;
  metadataUpdatedAt: Date;

  // --- Fields from Blockchain Service ---
  blockchainCampaignId: number | string; // Renamed
  blockchainCreator: string; // Renamed
  blockchainGoal: string; // Renamed
  deadline: number;
  amountRaised: string;
  claimed: boolean;
  active: boolean;

  // --- The Key ---
  frontendTrackerId: string;
}


export const campaignService = {

  getCampaignByContractAddress: async (
    contractAddress: string
  ): Promise<CampaignDetailsResult> => {
    // 1. Get rich metadata from MongoDB
    const campaignMetadata = await CampaignMetadata.findOne({
      contractAddress,
    }).populate("creator", "name profilePictureUrl walletAddress"); // Populate specific fields

    if (!campaignMetadata) {
      throw new Error(
        `Campaign not found for contract address: ${contractAddress}`
      );
    }

    // 2. Extract campaign ID (assuming format 'prefix_id')
    // Consider adding error handling if the format is unexpected
    const parts = contractAddress.split("_");
    if (parts.length < 2 || isNaN(parseInt(parts[1]))) {
      throw new Error(
        `Invalid contract address format for extracting ID: ${contractAddress}`
      );
    }
    const campaignId = parseInt(parts[1]);

    // 3. Get funding status from blockchain
    const blockchainData = await blockchainService.getCampaignDetails(
      campaignId
    );

    // 4. Combine and return data
    return {
      metadata: campaignMetadata.toObject(), // Convert Mongoose doc to plain object
      blockchain: blockchainData
        ? {
          amountRaised: blockchainData.amountRaised.toString(), // Ensure consistent types
          goal: blockchainData.goal.toString(),
          deadline: blockchainData.deadline,
          active: blockchainData.active,
          claimed: blockchainData.claimed,
        }
        : null,
    };
  },

  getMergedCampaignData: async (): Promise<MergedCampaignData[]> => {
    console.log("Starting campaign data merge process...");
    try {
      // --- Step 1: Fetch All Metadata from MongoDB ---
      // Use .lean() for performance if you only need plain JS objects
      // Select only necessary fields if possible
      const mongoMetadataList = await CampaignMetadata.find(
        {}, // No filter, get all
        // Optional: Select specific fields for efficiency
        // 'frontendTrackerId creatorWalletAddress title description fullDescription imageUrl videoUrl category timeline aboutYou fundingGoal duration createdAt updatedAt'
      ).lean<ICampaignMetadata[]>(); // Use lean for plain objects
      console.log(`Fetched ${mongoMetadataList.length} metadata documents from MongoDB.`);

      // --- Step 2: Fetch Data from the Other Service ---
      const blockchainCampaignList = await blockchainService.getAllCampaigns();
      if (!blockchainCampaignList) {
        throw new Error("Failed to fetch campaign data from the external service.");

      }

      console.log(`Fetched ${blockchainCampaignList?.length} campaign info records from external service.`);

      // --- Step 3: Prepare Blockchain Data for Efficient Lookup ---
      // Create a Map where key is frontendTrackerId and value is the BlockchainCampaignInfo object
      const blockchainDataMap = new Map<string, BlockchainCampaignInfo>();
      for (const campaign of blockchainCampaignList) {
        if (campaign.frontendTrackerId) { // Ensure tracker ID exists
          blockchainDataMap.set(campaign.frontendTrackerId, campaign);
        }
      }
      console.log(`Created lookup map with ${blockchainDataMap.size} unique tracker IDs from external service.`);

      // --- Step 4: Iterate Through MongoDB Data and Merge ---
      const mergedList: MergedCampaignData[] = [];
      for (const metadata of mongoMetadataList) {
        // Find corresponding blockchain data using the map
        const blockchainData = blockchainDataMap.get(metadata.frontendTrackerId);

        // **If found (match exists), then merge**
        if (blockchainData) {
          const mergedData: MergedCampaignData = {
            // --- Fields from MongoDB Metadata ---
            _id: metadata._id as any, // Get the MongoDB ObjectId
            mongoCreatorWalletAddress: metadata.creatorWalletAddress,
            title: metadata.title,
            description: metadata.description,
            fullDescription: metadata.fullDescription,
            imageUrl: metadata.imageUrl,
            videoUrl: metadata.videoUrl,
            category: metadata.category,
            timeline: metadata.timeline,
            aboutYou: metadata.aboutYou,
            mongoFundingGoal: metadata.fundingGoal,
            mongoDuration: metadata.duration,
            metadataCreatedAt: metadata.createdAt,
            metadataUpdatedAt: metadata.updatedAt,

            // --- Fields from Blockchain Service ---
            blockchainCampaignId: blockchainData.campaignId,
            blockchainCreator: blockchainData.creator,
            blockchainGoal: blockchainData.goal,
            deadline: blockchainData.deadline,
            amountRaised: blockchainData.amountRaised,
            claimed: blockchainData.claimed,
            active: blockchainData.active,

            // --- The Key ---
            frontendTrackerId: metadata.frontendTrackerId, // or blockchainData.frontendTrackerId
          };
          mergedList.push(mergedData);
        } else {
          // **If not found, neglect this metadata entry**
          console.log(`Skipping merge for MongoDB entry with trackerId ${metadata.frontendTrackerId} (not found in external service data).`);
        }
      }

      console.log(`Merge complete. Resulting list contains ${mergedList.length} merged campaign records.`);
      return mergedList;

    } catch (error) {
      console.error("Error during campaign data merge process:", error);
      // Re-throw the error to be handled by the caller (e.g., an API route handler)
      throw new Error(`Failed to get merged campaign data: ${(error as Error).message}`);
    }
  }

};
