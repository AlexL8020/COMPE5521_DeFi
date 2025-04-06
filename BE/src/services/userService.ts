// ./Proj/BE/src/services/userService.ts
import User from "../models/User";
import { blockchainService } from "./blockchainService";
import {
  RegisterUserInput,
  UserRegistrationResult,
  UserProfileResult,
} from "../types/userTypes"; // Import DTOs/types

export const userService = {
  /**
   * Registers a new user in the database and mints initial tokens.
   */
  registerUser: async (
    data: RegisterUserInput
  ): Promise<UserRegistrationResult> => {
    // 1. Check if user already exists
    const existingUser = await User.findOne({
      walletAddress: data.walletAddress,
    });
    if (existingUser) {
      throw new Error(
        `User already exists with wallet address: ${data.walletAddress}`
      );
    }

    // 2. Create new user in MongoDB
    const newUser = new User({
      name: data.name,
      email: data.email,
      profilePictureUrl: data.profilePictureUrl,
      bio: data.bio,
      walletAddress: data.walletAddress,
    });
    await newUser.save();

    // 3. Mint tokens for the new user (handle potential failure)
    let mintSuccess = false;
    try {
      mintSuccess = await blockchainService.mintTokensForNewUser(
        data.walletAddress
      );
    } catch (mintError) {
      console.error(
        `Failed to mint tokens for ${data.walletAddress}:`,
        mintError
      );
      // Decide if registration should fail if minting fails,
      // or just log the error and continue. Here we continue but report failure.
    }

    // 4. Return registration result
    return {
      user: newUser.toObject(), // Convert Mongoose doc to plain object
      tokensReceived: mintSuccess,
    };
  },

  /**
   * Retrieves user profile data from the database and token balance from the blockchain.
   */
  getUserProfile: async (walletAddress: string): Promise<UserProfileResult> => {
    // 1. Get user profile from MongoDB
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return {
        isExist: false,
        user: null, // Or handle this case differently
        balance: null, // Default balance if user doesn't exist
      };
    }

    // 2. Get user's token balance from blockchain
    const balance = await blockchainService.getUserBalance(walletAddress);

    // 3. Return combined data
    return {
      isExist: true,
      user: user.toObject(), // Convert Mongoose doc to plain object
      balance: balance.toString(), // Ensure consistent type (e.g., string)
    };
  },
};
