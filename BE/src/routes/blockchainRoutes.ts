import express from "express";
import {
  mintTokens,
  getUserBalance,
  // createCampaign,
  getCampaignDetails,
  contributeToCampaign,
} from "../controllers/blockchainController";

const router = express.Router();

// Mint tokens for a user
router.post("/mint-tokens", mintTokens);

// Get user balance
router.get("/balance/:walletAddress", getUserBalance);

// Create a campaign on blockchain
// router.post("/campaigns", createCampaign);

// Get campaign details from blockchain
router.get("/campaigns/:campaignId", getCampaignDetails);

// Contribute to a campaign
router.post("/contribute", contributeToCampaign);

export default router;