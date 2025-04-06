// src/routes/userRoutesV2.ts
import express, { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { RegisterUserInput } from "../types/userTypes"; // Import input type

const router = express.Router();

// --- Register a new user ---
// Wallet address comes from the request body here.
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Basic validation
      const { name, email, walletAddress } = req.body;
      console.log(
        "--------------- Registering userRoutesV2 ---------------",
        req.body
      );
      if (!name || !walletAddress) {
        res.status(400).json({
          message: "Missing required fields: name, walletAddress",
        });
      }

      // Prepare input data for the service
      const registerData: RegisterUserInput = {
        name: req.body.name,
        email: req.body.email,
        profilePictureUrl: req.body.profilePictureUrl,
        bio: req.body.bio,
        walletAddress: req.body.walletAddress, // Taken from body
      };

      // Call the user service
      const result = await userService.registerUser(registerData);

      // Send successful response
      res.status(201).json({
        message: "User registered successfully",
        user: result?.user,
        tokensReceived: result?.tokensReceived,
      });
    } catch (error: any) {
      if (error.message.startsWith("User already exists")) {
        res.status(409).json({ message: error.message });
      }
      next(error); // Pass other errors to the global handler
    }
  }
);

// --- Get a specific user's profile (using wallet address from URL) ---
// This endpoint allows fetching any user's profile by their address.
// For the demo, this can also serve as the way to get "your" profile
// if the frontend knows the user's address.
router.get(
  "/:walletAddress", // Wallet address comes from URL parameters
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const walletAddress = req.params.walletAddress;
      if (!walletAddress) {
        // This check might be redundant due to route definition, but good practice
        res
          .status(400)
          .json({ message: "Wallet address parameter is required" });
      }

      console.log(
        `Fetching profile for wallet address (from URL): ${walletAddress}`
      ); // Added log

      // Call the user service
      const userProfile = await userService.getUserProfile(walletAddress);

      // Send successful response
      res.status(200).json(userProfile);
    } catch (error: any) {
      const errMsg = error.message as string;

      if (errMsg?.includes("User not found")) {
        res.status(404).json({ message: error.message });
      }
      next(error); // Pass other errors to the global handler
    }
  }
);

export default router;
