import { Request, Response } from "express";
import { blockchainService, CampaignInfo } from "../services/blockchainService";
import User from "../models/User";
import { ethers } from "ethers";

export const mintTokens = async (req: Request, res: Response) => {
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
}

export const getUserBalance = async (req: Request, res: Response<{

}>) => {
    try {
        const { walletAddress } = req.params;

        const balance = await blockchainService.getUserBalance(walletAddress);

        res.status(200).json({
            balance,
        });
    } catch (error) {
        console.error("Error getting balance:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createCampaign = async (req: Request, res: Response) => {
    try {
        const { creatorWalletAddress, goal, durationInDays } = req.body;

        if (!creatorWalletAddress || !goal || !durationInDays) {
            res.status(400).json({
                message: "Creator wallet address, goal, and duration are required",
            });
        }

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
};

export const getCampaignDetails = async (req: Request, res: Response) => {
    try {
        const campaignId = parseInt(req.params.campaignId);

        if (isNaN(campaignId)) {
            res.status(400).json({ message: "Invalid campaign ID" });
        }

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
};

export const contributeToCampaign = async (req: Request, res: Response) => {
    try {
        const { contributorWalletAddress, campaignId, amount } = req.body;

        if (!contributorWalletAddress || !campaignId || !amount) {
            res.status(400).json({
                message:
                    "Contributor wallet address, campaign ID, and amount are required",
            });
        }

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
};


export const getOnChainCampaignByCreator = async (req: Request, res: Response) => {
    const { creatorAddress } = req.params;

    // Basic validation
    if (!ethers.isAddress(creatorAddress)) {
        res.status(400).json({ message: "Invalid creator wallet address format." });
    }

    try {
        console.log(`API request for campaigns by creator: ${creatorAddress}`);
        const campaigns: CampaignInfo[] | null = await blockchainService.getCampaignsByCreator(creatorAddress);

        if (campaigns === null) {
            // Error occurred within the service
            res.status(500).json({ message: "Failed to fetch campaigns from blockchain." });
        }

        // Success - return the found campaigns (could be an empty array)
        res.status(200).json(campaigns);

    } catch (error) {
        console.error(`Error in /campaigns/by-creator/${creatorAddress} route:`, error);
        res.status(500).json({ message: "Server error fetching campaigns." });
    }
}