// src/services/blockchainService.ts
import { ethers, InterfaceAbi, ContractTransactionResponse, Log } from "ethers"; // Import necessary types
import fs from "fs";
import path from "path";
import dotenv from "dotenv"; // Import dotenv
import { CampaignDetails, RawCampaignDetails } from "../types/blockchainTypesx";
import { CampaignCreationResult } from "../types/campaignTypes";

dotenv.config({ path: path.resolve(__dirname, "../../.env") }); // Load .env from root
export interface CampaignInfo extends CampaignDetails {
  campaignId: number;
}
// --- ABI Loading ---
const mockStableCoinArtifact = JSON.parse(
  fs.readFileSync(
    // Adjust path relative to the compiled JS file in dist/
    path.join(
      __dirname,
      "../../../Blockchain/artifacts/contracts/MockStableCoin.sol/MockStableCoin.json"
    ),
    "utf8"
  )
);
const mockStableCoinAbi: InterfaceAbi = mockStableCoinArtifact.abi;

const crowdfundingPlatformArtifact = JSON.parse(
  fs.readFileSync(
    // Adjust path relative to the compiled JS file in dist/
    path.join(
      __dirname,
      "../../../Blockchain/artifacts/contracts/CrowdfundingPlatform.sol/CrowdfundingPlatform.json"
    ),
    "utf8"
  )
);
const crowdfundingPlatformAbi: InterfaceAbi = crowdfundingPlatformArtifact.abi;

// --- Configuration ---
const MOCK_STABLE_COIN_ADDRESS = process.env.MOCK_STABLE_COIN_ADDRESS || "";
const CROWDFUNDING_PLATFORM_ADDRESS =
  process.env.CROWDFUNDING_PLATFORM_ADDRESS || "";
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const ADMIN_PRIVATE_KEY = process.env.PRIVATE_KEY || "";

if (!MOCK_STABLE_COIN_ADDRESS || !CROWDFUNDING_PLATFORM_ADDRESS) {
  console.error(
    "FATAL ERROR: MOCK_STABLE_COIN_ADDRESS or CROWDFUNDING_PLATFORM_ADDRESS not found in environment variables."
  );
  // process.exit(1);
}
if (!ADMIN_PRIVATE_KEY) {
  console.error(
    "FATAL ERROR: PRIVATE_KEY not found in environment variables. Cannot sign transactions."
  );
  // process.exit(1);
}

// Initialize provider and admin wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

console.log(`Blockchain Service using admin account: ${adminWallet.address}`);
console.log(`RPC URL: ${RPC_URL}`);
console.log(`MockStableCoin Address: ${MOCK_STABLE_COIN_ADDRESS}`);
console.log(`CrowdfundingPlatform Address: ${CROWDFUNDING_PLATFORM_ADDRESS}`);

// Initialize contract instances (connected to the admin wallet)
const mockStableCoin = new ethers.Contract(
  MOCK_STABLE_COIN_ADDRESS,
  mockStableCoinAbi,
  adminWallet
);

const crowdfundingPlatform = new ethers.Contract(
  CROWDFUNDING_PLATFORM_ADDRESS,
  crowdfundingPlatformAbi,
  adminWallet
);

// Amount of mock tokens to give to new users
const NEW_USER_TOKEN_AMOUNT = ethers.parseUnits("1000", 18);

// --- Blockchain Service Object ---
export const blockchainService = {
  // Function to mint tokens for new users (using admin wallet)
  mintTokensForNewUser: async (userAddress: string): Promise<boolean> => {
    if (!mockStableCoin.runner) {
      console.error("Admin wallet not connected to MockStableCoin contract.");
      return false;
    }
    try {
      console.log(
        `Attempting to mint ${ethers.formatUnits(
          NEW_USER_TOKEN_AMOUNT,
          18
        )} MSC to ${userAddress} using admin ${adminWallet.address}`
      );
      const tx: ContractTransactionResponse =
        await mockStableCoin.mintForNewUser(userAddress, NEW_USER_TOKEN_AMOUNT);
      await tx.wait();
      console.log(
        `Successfully minted ${ethers.formatUnits(
          NEW_USER_TOKEN_AMOUNT,
          18
        )} MSC to ${userAddress} (Tx: ${tx.hash})`
      );
      return true;
    } catch (error) {
      console.error(`Error minting tokens to ${userAddress}:`, error);
      return false;
    }
  },

  // Function to get user's token balance
  getUserBalance: async (userAddress: string): Promise<string> => {
    try {
      const balance = await mockStableCoin.balanceOf(userAddress);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      console.error(`Error getting balance for ${userAddress}:`, error);
      return "0";
    }
  },

  // // Function to create a new campaign (using admin wallet)
  // createCampaign: async (
  //   creatorWalletAddress: string, // Currently unused for signing
  //   goal: string,
  //   durationInDays: number
  // ): Promise<CampaignCreationResult | null> => {
  //   if (!crowdfundingPlatform.runner) {
  //     console.error(
  //       "Admin wallet not connected to CrowdfundingPlatform contract."
  //     );
  //     return null;
  //   }
  //   try {
  //     const goalInWei = ethers.parseUnits(goal, 18);
  //     console.log(
  //       `Admin ${adminWallet.address} creating campaign (Goal: ${goal}, Duration: ${durationInDays} days)`
  //     );

  //     const tx: ContractTransactionResponse =
  //       await crowdfundingPlatform.createCampaign(goalInWei, durationInDays);
  //     const receipt = await tx.wait();

  //     let campaignId: number | null = null;
  //     if (receipt?.logs) {
  //       const iFace = new ethers.Interface(crowdfundingPlatformAbi);
  //       for (const log of receipt.logs as Log[]) {
  //         if (log.topics && log.data) {
  //           try {
  //             const parsedLog = iFace.parseLog(log);
  //             if (parsedLog && parsedLog.name === "CampaignCreated") {
  //               campaignId = Number(parsedLog.args[0]);
  //               console.log(
  //                 `Campaign created successfully. Campaign ID: ${campaignId} (Tx: ${tx.hash})`
  //               );
  //               break;
  //             }
  //           } catch (parseError) {
  //             // Ignore logs that don't match the ABI
  //           }
  //         }
  //       }
  //     }

  //     if (campaignId !== null) {
  //       return { campaignId };
  //     } else {
  //       console.error(
  //         "CampaignCreated event not found in transaction receipt."
  //       );
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error creating campaign:", error);
  //     return null;
  //   }
  // },

  // Function to get campaign details
  getCampaignDetails: async (
    campaignId: number
  ): Promise<CampaignDetails | null> => {
    try {
      const details: RawCampaignDetails =
        await crowdfundingPlatform.getCampaignDetails(campaignId);

      console.log("details: ", details)
      return {
        creator: details[0],
        goal: ethers.formatUnits(details[1], 18),
        deadline: Number(details[2]), // Return timestamp as number
        amountRaised: ethers.formatUnits(details[3], 18),
        claimed: details[4],
        active: details[5],
        frontendTrackerId: details[6], // This is a placeholder. Adjust based on your actual implementation.
      };
    } catch (error) {
      if ((error as any)?.message?.includes("invalid campaign id")) {
        console.warn(`Campaign details not found for ID: ${campaignId}`);
      } else {
        console.error(
          `Error getting campaign details for ID ${campaignId}:`,
          error
        );
      }
      return null;
    }
  },

  // Function to contribute to a campaign (using admin wallet)
  contributeToCampaign: async (
    contributorWalletAddress: string, // Currently unused for signing
    campaignId: number,
    amount: string
  ): Promise<boolean> => {
    if (!mockStableCoin.runner || !crowdfundingPlatform.runner) {
      console.error("Admin wallet not connected to contracts.");
      return false;
    }
    try {
      const amountInWei = ethers.parseUnits(amount, 18);
      console.log(
        `Admin ${adminWallet.address} initiating contribution to campaign ${campaignId} (Amount: ${amount} MSC)`
      );

      // Step 1: Approve the CrowdfundingPlatform contract to spend tokens
      console.log(
        `Admin approving platform ${CROWDFUNDING_PLATFORM_ADDRESS} to spend ${amount} MSC...`
      );
      const approveTx: ContractTransactionResponse =
        await mockStableCoin.approve(
          CROWDFUNDING_PLATFORM_ADDRESS,
          amountInWei
        );
      await approveTx.wait();
      console.log(
        `Approval successful for campaign ${campaignId}. (Tx: ${approveTx.hash})`
      );

      // Step 2: Call the contribute function on the CrowdfundingPlatform
      console.log(
        `Admin contributing ${amount} MSC to campaign ${campaignId}...`
      );
      const contributeTx: ContractTransactionResponse =
        await crowdfundingPlatform.contribute(campaignId, amountInWei);
      await contributeTx.wait();
      console.log(
        `Contribution successful to campaign ${campaignId}. (Tx: ${contributeTx.hash})`
      );

      return true;
    } catch (error) {
      console.error(
        `Error contributing to campaign ${campaignId} with amount ${amount}:`,
        error
      );
      return false;
    }
  },

  // --- NEW FUNCTION ---
  /**
   * Fetches campaign details for all campaigns created by a specific address.
   * NOTE: This iterates through all campaigns on-chain. Inefficient for large numbers.
   * Consider off-chain indexing for production.
   * @param creatorAddress The address of the campaign creator.
   * @returns A promise resolving to an array of CampaignInfo objects or null on error.
   */
  getCampaignsByCreator: async (
    creatorAddress: string
  ): Promise<CampaignInfo[] | null> => {
    console.log(`Fetching campaigns created by: ${creatorAddress}`);
    try {
      // 1. Get total campaign count
      const countBigInt = await crowdfundingPlatform.campaignCount();
      const count = Number(countBigInt);
      console.log(`Total campaigns on platform: ${count}`);

      if (count === 0) {
        return []; // No campaigns exist yet
      }

      // 2. Create an array of campaign IDs to fetch
      const campaignIds = Array.from({ length: count }, (_, i) => i); // [0, 1, ..., count-1]

      // 3. Fetch details for all campaigns concurrently
      const campaignDetailPromises = campaignIds.map(id =>
        blockchainService.getCampaignDetails(id) // Reuse existing typed function
          .then(details => ({ id, details })) // Keep track of ID
          .catch(err => {
            // Handle potential errors fetching individual campaigns
            console.error(`Error fetching details for campaign ID ${id}:`, err);
            return { id, details: null }; // Return null details on error
          })
      );

      const campaignResults = await Promise.all(campaignDetailPromises);

      // 4. Filter results for the target creator and valid details
      const creatorCampaigns: CampaignInfo[] = [];
      const normalizedCreatorAddress = creatorAddress.toLowerCase();

      for (const result of campaignResults) {
        if (result.details && result.details.creator.toLowerCase() === normalizedCreatorAddress) {
          creatorCampaigns.push({
            campaignId: result.id,
            ...result.details,
          });
        }
      }

      console.log(`Found ${creatorCampaigns.length} campaigns for ${creatorAddress}`);
      return creatorCampaigns;

    } catch (error) {
      console.error(`Error fetching campaigns for creator ${creatorAddress}:`, error);
      return null; // Indicate failure
    }
  },

  getCampaignsExceptCreator: async (
    excludeAddress: string
  ): Promise<CampaignInfo[] | null> => {
    try {
      console.log(`API request for campaigns excluding creator: ${excludeAddress}`);

      // Get total campaign count (reuse existing logic from blockchainService)
      const countBigInt = await crowdfundingPlatform.campaignCount();
      const count = Number(countBigInt);
      console.log(`Total campaigns on platform: ${count}`);

      if (count === 0) {
        return [] // No campaigns exist yet
      }

      // Create an array of campaign IDs to fetch
      const campaignIds = Array.from({ length: count }, (_, i) => i);

      // Fetch details for all campaigns concurrently
      const campaignDetailPromises = campaignIds.map(id =>
        blockchainService.getCampaignDetails(id)
          .then(details => ({ id, details }))
          .catch(err => {
            console.error(`Error fetching details for campaign ID ${id}:`, err);
            return { id, details: null };
          })
      );

      const campaignResults = await Promise.all(campaignDetailPromises);

      // Filter to exclude campaigns from the specific creator
      const normalizedExcludeAddress = excludeAddress.toLowerCase();
      const filteredCampaigns: CampaignInfo[] = [];

      for (const result of campaignResults) {
        if (result.details && result.details.creator.toLowerCase() !== normalizedExcludeAddress) {
          filteredCampaigns.push({
            campaignId: result.id,
            ...result.details,
          });
        }
      }

      console.log(`Found ${filteredCampaigns.length} campaigns excluding creator ${excludeAddress}`);

      return filteredCampaigns;
    } catch (error) {
      console.error(`Error fetching campaigns excluding creator ${excludeAddress}:`, error);
      return null; // Indicate failure
    }
  },
  getAllCampaigns: async (): Promise<CampaignInfo[] | null> => {
    try {
      console.log("API request for all campaigns");

      // Get total campaign count
      const countBigInt = await crowdfundingPlatform.campaignCount();
      const count = Number(countBigInt);
      console.log(`Total campaigns on platform: ${count}`);

      if (count === 0) {
        return []; // No campaigns exist yet
      }

      // Create an array of campaign IDs to fetch
      const campaignIds = Array.from({ length: count }, (_, i) => i);

      // Fetch details for all campaigns concurrently
      const campaignDetailPromises = campaignIds.map(id =>
        blockchainService.getCampaignDetails(id)
          .then(details => ({ id, details }))
          .catch(err => {
            console.error(`Error fetching details for campaign ID ${id}:`, err);
            return { id, details: null };
          })
      );

      const campaignResults = await Promise.all(campaignDetailPromises);

      // Filter out any null results
      const allCampaigns: CampaignInfo[] = [];

      for (const result of campaignResults) {
        if (result.details) {
          allCampaigns.push({
            campaignId: result.id,
            ...result.details,
          });
        }
      }

      console.log(`Found ${allCampaigns.length} total campaigns`);
      return allCampaigns;

    } catch (error) {
      console.error("Error fetching all campaigns:", error);
      return null; // Indicate failure
    }
  }
};

// Optional: Log initialization status
console.log(
  `Blockchain service configured. Admin: ${adminWallet.address}, RPC: ${RPC_URL}`
);
