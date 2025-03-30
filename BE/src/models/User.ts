// src/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string; // Make email optional if login is wallet-based
  profilePictureUrl?: string;
  bio?: string;
  walletAddress: string; // Link to blockchain identity
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    email: {
      type: String,
      // required: false, // Only require if using email login too
      unique: true,
      sparse: true, // Allows multiple null/undefined emails but unique if present
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    profilePictureUrl: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    walletAddress: {
      // Indexed for potential lookups
      type: String,
      required: [true, "Wallet address is required"],
      unique: true, // Each user profile should map to one unique wallet
      trim: true,
      // Add validation for address format if desired (e.g., regex)
      // match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format']
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema); // Collection: 'users'

export default User;
