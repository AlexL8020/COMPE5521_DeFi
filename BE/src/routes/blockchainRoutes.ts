// src/routes/blockchainRoutes.ts
import express, { Request, Response } from "express";
import { blockchainService } from "../services/blockchainService";
import User from "../models/User";
import CampaignMetadata from "../models/CampaignMetadata";

const router = express.Router();

// Mint tokens for a user
router.post("/mint-tokens", async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      res.status(400).json({ message: "Wallet address is required" });
    }

    // Check if user exists
    const user = await User.findOne({ walletAddress });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    // Mint tokens
    const success = await blockchainService.mintTokensForNewUser(walletAddress);

    if (success) {
      res.status(200).json({
        message: "Tokens minted successfully",
        walletAddress,
      });
    } else {
      res.status(500).json({ message: "Failed to mint tokens" });
    }
  } catch (error) {
    console.error("Error minting tokens:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user balance
router.get("/balance/:walletAddress", async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    // Get balance
    const balance = await blockchainService.getUserBalance(walletAddress);

    res.status(200).json({
      walletAddress,
      balance,
    });
  } catch (error) {
    console.error("Error getting balance:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a campaign on blockchain
router.post("/campaigns", async (req: Request, res: Response) => {
  try {
    const { creatorWalletAddress, goal, durationInDays } = req.body;

    if (!creatorWalletAddress || !goal || !durationInDays) {
      res.status(400).json({
        message: "Creator wallet address, goal, and duration are required",
      });
    }

    // Create campaign on blockchain
    const result = await blockchainService.createCampaign(
      creatorWalletAddress,
      goal,
      durationInDays
    );

    if (result) {
      res.status(201).json({
        message: "Campaign created on blockchain",
        campaignId: result,
        contractAddress: result,
      });
    } else {
      res.status(500).json({ message: "Failed to create campaign" });
    }
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get campaign details from blockchain
router.get("/campaigns/:campaignId", async (req: Request, res: Response) => {
  try {
    const campaignId = parseInt(req.params.campaignId);

    if (isNaN(campaignId)) {
      res.status(400).json({ message: "Invalid campaign ID" });
    }

    // Get campaign details from blockchain
    const details = await blockchainService.getCampaignDetails(campaignId);

    if (details) {
      res.status(200).json(details);
    } else {
      res.status(404).json({ message: "Campaign not found" });
    }
  } catch (error) {
    console.error("Error getting campaign details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Contribute to a campaign
router.post("/contribute", async (req: Request, res: Response) => {
  try {
    const { contributorWalletAddress, campaignId, amount } = req.body;

    if (!contributorWalletAddress || !campaignId || !amount) {
      res.status(400).json({
        message:
          "Contributor wallet address, campaign ID, and amount are required",
      });
    }

    // Contribute to campaign
    const success = await blockchainService.contributeToCampaign(
      contributorWalletAddress,
      parseInt(campaignId),
      amount
    );

    if (success) {
      res.status(200).json({
        message: "Contribution successful",
        contributorWalletAddress,
        campaignId,
        amount,
      });
    } else {
      res.status(500).json({ message: "Failed to contribute" });
    }
  } catch (error) {
    console.error("Error contributing to campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
