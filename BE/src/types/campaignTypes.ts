// ./Proj/BE/src/types/campaignTypes.ts
import { ICampaignMetadata } from "../models/CampaignMetadata"; // Assuming ICampaignMetadata is exported

export interface CreateCampaignInput {
  title: string;
  description: string;
  creatorWalletAddress: string;
  goal: number; // Assuming goal is a number
  durationInDays: number; // Assuming duration is a number
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
}

export interface CampaignCreationResult {
  metadata?: ICampaignMetadata; // Or a specific subset if needed
  campaignId: number; // Assuming campaignId is a number
}

export interface CampaignDetailsResult {
  metadata: any; // Use a more specific type based on populated data
  blockchain: {
    amountRaised: string; // Assuming blockchain returns BigNumber/string
    goal: string;
    deadline: number; // Assuming timestamp
    active: boolean;
    claimed: boolean;
  } | null;
}

// ./Proj/BE/src/types/userTypes.ts
import { IUser } from "../models/User"; // Assuming IUser is exported

export interface RegisterUserInput {
  name: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  walletAddress: string;
}

export interface UserRegistrationResult {
  user: IUser; // Or a specific subset
  tokensReceived: boolean; // Or more specific info from blockchainService
}

export interface UserProfileResult {
  user: IUser; // Or a specific subset
  balance: string; // Assuming balance is BigNumber/string
}
