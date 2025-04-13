// ./Proj/BE/src/controllers/campaignController.ts
import { Request, Response } from "express";
import CampaignMetadata, {
  ICampaignMetadata,
} from "../models/CampaignMetadata";
import User from "../models/User";
import { blockchainService } from "../services/blockchainService";
import mongoose from "mongoose";
import { campaignService } from "../services/campaignService";


// Define the expected request body structure from the frontend
interface SaveMetadataRequestBody {
  title: string;
  category: string;
  shortDescription: string;
  image: string | null; // Base64 data URI or null
  fullDescription: string;
  timeline: string;
  aboutYou: string;
  fundingGoal: string; // Received as string
  duration: string; // Received as string
}

// Extend the Express Request interface
interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    walletAddress?: string;
  };
}

// Define the size limit (in bytes)
// 10 MB = 10 * 1024 * 1024 bytes
const BASE64_IMAGE_SIZE_LIMIT_BYTES = 10 * 1024 * 1024;




export const campaignController = {

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

  saveCampaignMetadata: async (req: AuthenticatedRequest, res: Response) => {
    try {
      // --- 1. Get Authenticated User's Wallet Address ---
      const creatorWalletAddress = req.body?.walletAddress;

      if (!creatorWalletAddress) {
        res
          .status(401)
          .json({ message: "Authentication failed: Wallet address not found." });
        return
      }

      // --- 2. Extract and Validate Frontend Data ---
      const {
        title,
        category,
        shortDescription,
        image, // Base64 data URI from frontend
        fullDescription,
        timeline,
        aboutYou,
        fundingGoal: fundingGoalStr,
        duration: durationStr,
      } = req.body as SaveMetadataRequestBody;

      // Basic presence validation
      if (
        !title ||
        !shortDescription ||
        !fullDescription ||
        !fundingGoalStr ||
        !durationStr ||
        !shortDescription

      ) {
        res
          .status(400)
          .json({ message: "Missing required campaign metadata fields." });
        return
      }

      // --- 3. Image Handling & Size Check ---
      let imageBase64Data: string | undefined = undefined;
      if (image && typeof image === "string" && image.startsWith("data:image")) {
        // *** Add size check HERE ***
        if (image.length > BASE64_IMAGE_SIZE_LIMIT_BYTES) {
          console.warn(
            `Image rejected: Base64 string length (${image.length} bytes) exceeds limit (${BASE64_IMAGE_SIZE_LIMIT_BYTES} bytes).`
          );
          res.status(413).json({ // 413 Payload Too Large
            message: `Image file size is too large (exceeds ${BASE64_IMAGE_SIZE_LIMIT_BYTES / (1024 * 1024)}MB limit). Please upload a smaller image.`,
          });
          return
        }
        // If size check passes, assign the data
        imageBase64Data = image;

      } else if (image) {
        console.warn("Received 'image' field is not a valid data URI format.");
      }

      // --- 4. Data Transformation ---
      const fundingGoal = parseFloat(fundingGoalStr);
      const duration = parseInt(durationStr, 10);

      if (isNaN(fundingGoal) || fundingGoal < 0) {
        res
          .status(400)
          .json({ message: "Invalid or negative funding goal format." });
        return
      }
      if (isNaN(duration) || duration < 1) {
        res
          .status(400)
          .json({ message: "Invalid duration format or value (must be at least 1)." });
        return
      }

      // --- 5. Create and Save Metadata Document ---
      const campaignMetadata = new CampaignMetadata({
        ...req.body,
        creatorWalletAddress: creatorWalletAddress,
        description: shortDescription,
        imageUrl: imageBase64Data,
        contractAddress: req.body.contractAddress,
      });

      await campaignMetadata.save(); // Mongoose validation runs. MongoDB will check actual BSON size limit here.

      // --- 6. Success Response ---
      const responseData = campaignMetadata.toObject();
      // delete responseData.imageUrl; // Optionally remove image data from response

      res.status(201).json({
        message: "Metadata saved successfully",
        // data: responseData,
        data: { _id: campaignMetadata._id } // Send back minimal data
      });
      return

    } catch (error: any) {
      console.error("Error saving metadata:", error);

      // Keep the check for the actual MongoDB error as a fallback
      if (error.message && error.message.includes("max BSON size")) {
        res.status(413).json({ // 413 Payload Too Large
          message: "Error saving metadata: Document size exceeds MongoDB's 16MB limit, likely due to a large image.",
        });
        return
      }

      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(400)
          .json({ message: "Validation Error", errors: error.errors });
        return
      }

      res.status(500).json({ message: "Server error saving metadata" });
      return
    }
  },
  /**
   * Get all campaigns with merged data from blockchain and database
   * @route GET /api/campaigns/merged
   * @access Public
   */
  getMergedCampaigns: async (req: Request, res: Response): Promise<void> => {
    try {
      // Call the service to get merged campaign data
      const mergedCampaigns = await campaignService.getMergedCampaignData();

      // Return the merged campaign data with 200 OK status
      res.status(200).json({
        success: true,
        count: mergedCampaigns.length,
        data: mergedCampaigns
      });
    } catch (error) {
      console.error('Error in getMergedCampaigns controller:', error);

      // Return appropriate error response
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve merged campaign data',
        message: (error as Error).message
      });
    }
  }

};
