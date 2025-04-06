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

export type UserProfileResult =
  | {
      isExist: true;
      user: IUser; // Or a specific subset
      balance: string; // Assuming balance is BigNumber/string
    }
  | {
      isExist: false;
      user: null;
      balance: null;
    };
