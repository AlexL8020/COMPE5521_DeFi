// ./Proj/BE/src/controllers/campaignController.ts
import { Request, Response } from "express";
import CampaignMetadata, {
  ICampaignMetadata,
} from "../models/CampaignMetadata";
import User from "../models/User";
import { blockchainService } from "../services/blockchainService";

export const campaignController = {
  // Create a new campaign
  createCampaign: async (req: Request, res: Response) => {
    try {
      // Extract campaign data
      const {
        title,
        description,
        creatorWalletAddress,
        goal,
        durationInDays,
        imageUrl,
        videoUrl,
        category,
      } = req.body;

      // Find the user in MongoDB
      const user = await User.findOne({ walletAddress: creatorWalletAddress });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create campaign on blockchain (only essential data)
      // This stores only the funding goal, duration, and creator address on-chain
      const campaignAddr = await blockchainService.createCampaign(
        creatorWalletAddress, // On-chain: creator wallet address
        goal, // On-chain: funding goal
        durationInDays // On-chain: campaign duration
      );

      if (!campaignAddr) {
        return res
          .status(400)
          .json({ message: "Failed to create campaign on blockchain" });
      }

      // Store rich metadata in MongoDB (off-chain)
      const newCampaignMetadata = new CampaignMetadata({
        contractAddress: campaignAddr, // Link to blockchain
        creatorWalletAddress, // Link to blockchain
        creator: user._id, // Link to MongoDB user
        title, // Off-chain: rich data
        description, // Off-chain: rich data
        imageUrl, // Off-chain: rich data
        videoUrl, // Off-chain: rich data
        category, // Off-chain: rich data
      });

      await newCampaignMetadata.save();

      return res.status(201).json({
        message: "Campaign created successfully",
        campaign: {
          ...newCampaignMetadata.toObject(),
          campaignId: campaignAddr,
        },
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // Get campaign details (combines off-chain and on-chain data)
  getCampaignByContractAddress: async (req: Request, res: Response) => {
    try {
      const { contractAddress } = req.params;

      // Get rich metadata from MongoDB (off-chain)
      const campaignMetadata = await CampaignMetadata.findOne({
        contractAddress,
      }).populate("creator", "name profilePictureUrl walletAddress");

      if (!campaignMetadata) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Extract campaign ID from contract address
      const campaignId = parseInt(contractAddress.split("_")[1]);

      // Get funding status from blockchain (on-chain)
      const blockchainData = await blockchainService.getCampaignDetails(
        campaignId
      );

      // Combine off-chain metadata with on-chain data
      const campaignData = {
        // Off-chain data (rich metadata)
        metadata: campaignMetadata.toObject(),

        // On-chain data (funding status)
        blockchain: blockchainData
          ? {
            amountRaised: blockchainData.amountRaised,
            goal: blockchainData.goal,
            deadline: blockchainData.deadline,
            active: blockchainData.active,
            claimed: blockchainData.claimed,
          }
          : null,
      };

      return res.status(200).json(campaignData);
    } catch (error) {
      console.error("Error getting campaign:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },


};
