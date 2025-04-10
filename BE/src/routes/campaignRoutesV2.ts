// src/routes/campaign.ts (partial update)
import express, { Request, Response } from "express";
import CampaignMetadata from "../models/CampaignMetadata";
import User from "../models/User";
import { blockchainService } from "../services/blockchainService";
import { getOnChainCampaignByCreator } from "../controllers/blockchainController";

const router = express.Router();

// Create a new campaign
router.post("/", async (req: Request, res: Response) => {
  try {
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

    // Find the user
    const user = await User.findOne({ walletAddress: creatorWalletAddress });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    // Create campaign on blockchain
    const campaignResult = await blockchainService.createCampaign(
      creatorWalletAddress,
      goal,
      durationInDays
    );

    if (!campaignResult) {
      res
        .status(400)
        .json({ message: "Failed to create campaign on blockchain" });
    }

    // Create campaign metadata in database
    const newCampaignMetadata = new CampaignMetadata({
      contractAddress: campaignResult,
      creatorWalletAddress,
      creator: user?._id,
      title,
      description,
      imageUrl,
      videoUrl,
      category,
    });

    await newCampaignMetadata.save();

    res.status(201).json({
      message: "Campaign created successfully",
      campaign: {
        ...newCampaignMetadata.toObject(),
        campaignId: campaignResult,
      },
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get campaign by contract address
router.get("/:contractAddress", async (req: Request, res: Response) => {
  try {
    const { contractAddress } = req.params;

    // Get campaign from database
    const campaignMetadata = await CampaignMetadata.findOne({
      contractAddress,
    }).populate("creator", "name profilePictureUrl walletAddress");

    if (!campaignMetadata) {
      res.status(404).json({ message: "Campaign not found" });
    }

    // Extract campaign ID from contract address (this is a placeholder - adjust based on your actual implementation)
    const campaignId = parseInt(contractAddress.split("_")[1]);

    // Get latest blockchain data
    const blockchainData = await blockchainService.getCampaignDetails(
      campaignId
    );

    // Combine off-chain metadata with on-chain data
    const campaignData = {
      metadata: campaignMetadata?.toObject(),
      blockchain: blockchainData,
    };

    res.status(200).json(campaignData);
  } catch (error) {
    console.error("Error getting campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Other campaign routes...
router.get("/by-creator/:creatorAddress", getOnChainCampaignByCreator)
export default router;
