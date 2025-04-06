// ./Proj/BE/src/services/campaignService.ts
import CampaignMetadata from "../models/CampaignMetadata";
import User from "../models/User";
import { blockchainService } from "./blockchainService";
import {
  CreateCampaignInput,
  CampaignCreationResult,
  CampaignDetailsResult,
} from "../types/campaignTypes"; // Import DTOs/types

export const campaignService = {
  /**
   * Creates a campaign on the blockchain and stores metadata in the database.
   */
  createCampaign: async (
    data: CreateCampaignInput
  ): Promise<CampaignCreationResult> => {
    // 1. Find the user associated with the creator wallet address
    const user = await User.findOne({
      walletAddress: data.creatorWalletAddress,
    });
    if (!user) {
      // Throw a specific error for the controller to catch
      throw new Error(
        `Create Campaign - User not found for wallet address: ${data.creatorWalletAddress}`
      );
    }

    // 2. Create the campaign on the blockchain
    const campaignAddr = await blockchainService.createCampaign(
      data.creatorWalletAddress,
      String(data.goal),
      data.durationInDays
    );

    if (!campaignAddr) {
      throw new Error("Failed to create campaign on blockchain");
    }

    // 3. Store rich metadata in MongoDB
    const newCampaignMetadata = new CampaignMetadata({
      contractAddress: campaignAddr,
      creatorWalletAddress: data.creatorWalletAddress,
      creator: user._id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      category: data.category,
    });

    await newCampaignMetadata.save();

    // 4. Return the combined result
    return {
      metadata: newCampaignMetadata.toObject(), // Convert Mongoose doc to plain object
      campaignId: campaignAddr.campaignId,
    };
  },

  /**
   * Retrieves campaign details by combining database metadata and blockchain data.
   */
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
};
