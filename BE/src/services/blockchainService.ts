import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Load contract ABIs
const mockStableCoinAbi = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "../../../Blockchain/artifacts/contracts/MockStableCoin.sol/MockStableCoin.json"
    ),
    "utf8"
  )
).abi;

const crowdfundingPlatformAbi = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "../../../Blockchain/artifacts/contracts/CrowdfundingPlatform.sol/CrowdfundingPlatform.json"
    ),
    "utf8"
  )
).abi;

// Contract addresses (from deployment)
const CONTRACT_ADDRESSES = {
  mockStableCoin: process.env.MOCK_STABLE_COIN_ADDRESS || "",
  crowdfundingPlatform: process.env.CROWDFUNDING_PLATFORM_ADDRESS || "",
};

// RPC URL for the network
const RPC_URL = process.env.RPC_URL || "http://localhost:8545";

// Private key for the backend wallet (for minting tokens to new users)
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Initialize contract instances
const mockStableCoin = new ethers.Contract(
  CONTRACT_ADDRESSES.mockStableCoin,
  mockStableCoinAbi,
  wallet
);

const crowdfundingPlatform = new ethers.Contract(
  CONTRACT_ADDRESSES.crowdfundingPlatform,
  crowdfundingPlatformAbi,
  wallet
);

// Amount of mock tokens to give to new users (e.g., 1000 tokens with 18 decimals)
const NEW_USER_TOKEN_AMOUNT = ethers.parseUnits("1000", 18);

export const blockchainService = {
  // Function to mint tokens for new users
  mintTokensForNewUser: async (userAddress: string): Promise<boolean> => {
    try {
      const tx = await mockStableCoin.mintForNewUser(
        userAddress,
        NEW_USER_TOKEN_AMOUNT
      );
      await tx.wait();
      console.log(`Minted ${NEW_USER_TOKEN_AMOUNT} tokens to ${userAddress}`);
      return true;
    } catch (error) {
      console.error("Error minting tokens:", error);
      return false;
    }
  },

  // Function to get user's token balance
  getUserBalance: async (userAddress: string): Promise<string> => {
    try {
      const balance = await mockStableCoin.balanceOf(userAddress);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      console.error("Error getting user balance:", error);
      return "0";
    }
  },

  // Function to create a new campaign
  createCampaign: async (
    creatorAddress: string,
    goal: string,
    durationInDays: number
  ): Promise<number | null> => {
    try {
      // Convert goal to wei (assuming 18 decimals)
      const goalInWei = ethers.parseUnits(goal, 18);

      // Create campaign
      const tx = await crowdfundingPlatform.createCampaign(
        goalInWei,
        durationInDays
      );
      const receipt = await tx.wait();

      // Extract campaign ID from event logs
      const event = receipt.logs.find(
        (log: any) => log.fragment && log.fragment.name === "CampaignCreated"
      );

      if (event && event.args) {
        return Number(event.args[0]);
      }
      return null;
    } catch (error) {
      console.error("Error creating campaign:", error);
      return null;
    }
  },

  // Function to get campaign details
  getCampaignDetails: async (campaignId: number) => {
    try {
      const details = await crowdfundingPlatform.getCampaignDetails(campaignId);
      return {
        creator: details[0],
        goal: ethers.formatUnits(details[1], 18),
        deadline: new Date(Number(details[2]) * 1000),
        amountRaised: ethers.formatUnits(details[3], 18),
        claimed: details[4],
        active: details[5],
      };
    } catch (error) {
      console.error("Error getting campaign details:", error);
      return null;
    }
  },

  // Function to listen for blockchain events
  setupEventListeners: (callback: (event: any) => void) => {
    crowdfundingPlatform.on(
      "CampaignCreated",
      (campaignId, creator, goal, deadline, event) => {
        callback({
          type: "CampaignCreated",
          campaignId: Number(campaignId),
          creator,
          goal: ethers.formatUnits(goal, 18),
          deadline: new Date(Number(deadline) * 1000),
        });
      }
    );

    crowdfundingPlatform.on(
      "ContributionMade",
      (campaignId, contributor, amount, event) => {
        callback({
          type: "ContributionMade",
          campaignId: Number(campaignId),
          contributor,
          amount: ethers.formatUnits(amount, 18),
        });
      }
    );

    // Add more event listeners as needed
  },
};
