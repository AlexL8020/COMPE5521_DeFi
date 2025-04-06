// ./Proj/BE/src/controllers/userController.ts
import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { blockchainService } from "../services/blockchainService";

export const userController = {
  // Register a new user
  registerUser: async (req: Request, res: Response) => {
    try {
      const { name, email, profilePictureUrl, bio, walletAddress } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ walletAddress });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user in MongoDB (off-chain storage)
      const newUser = new User({
        name,
        email,
        profilePictureUrl,
        bio,
        walletAddress, // This is the only link to the blockchain identity
      });

      await newUser.save();

      // Mint tokens for the new user (on-chain operation)
      // This only interacts with the blockchain to mint tokens to the wallet address
      const mintSuccess = await blockchainService.mintTokensForNewUser(
        walletAddress
      );

      return res.status(201).json({
        message: "User registered successfully",
        user: newUser,
        tokensReceived: mintSuccess,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // Get user profile (combines off-chain and on-chain data)
  getUserProfile: async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.params;

      // Get user profile from MongoDB (off-chain)
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's token balance from blockchain (on-chain)
      const balance = await blockchainService.getUserBalance(walletAddress);

      // Return combined data
      return res.status(200).json({
        user, // Off-chain user profile data
        balance, // On-chain token balance
      });
    } catch (error) {
      console.error("Error getting user profile:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
