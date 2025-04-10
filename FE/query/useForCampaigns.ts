import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "./apiClient"; // Assuming apiClient is configured
import { AxiosError } from "axios";

// --- TypeScript Interfaces ---

// User profile structure (from your existing code)
export interface UserProfile {
  _id: string;
  walletAddress: string;
  name: string;
  email?: string;
  profilePictureUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}



// Payload for creating a user (from your existing code)
export interface CreateUserPayload {
  walletAddress: string;
  name: string;
  email?: string;
  profilePictureUrl?: string;
  bio?: string;
}



// Custom error type (from your existing code)
interface ApiError {
  message: string;
  error?: string;
}

// --- NEW: Interface for Campaign Info returned by the backend ---
// Matches the CampaignInfo type defined in the backend blockchainService
export interface CampaignInfo {
  campaignId: number;
  creator: string;
  goal: string;       // Formatted string (e.g., "1.5")
  deadline: number;   // Unix timestamp in milliseconds
  amountRaised: string; // Formatted string (e.g., "0.2")
  claimed: boolean;
  active: boolean;
}
// --- NEW HOOK ---

/**
 * Hook to fetch campaigns created by a specific wallet address.
 * Calls GET /campaign/by-creator/:creatorAddress
 *
 * @param creatorAddress The wallet address of the campaign creator (string | null | undefined).
 * @returns React Query result object for the list of campaigns.
 */
export const useGetCampaignsByCreator = (
  creatorAddress: string | null | undefined
): UseQueryResult<CampaignInfo[], AxiosError<ApiError>> => {
  // Define a unique query key including the creator address
  const queryKey: QueryKey = ["campaigns", "byCreator", creatorAddress];

  // Define the asynchronous function to fetch the data
  const fetchCampaigns = async (): Promise<CampaignInfo[]> => {
    if (!creatorAddress) {
      // This should not be called if 'enabled' is false, but good practice
      throw new Error("Creator address is required to fetch campaigns.");
    }
    console.log(`Fetching campaigns for creator: ${creatorAddress}`);
    // Make the GET request to the backend endpoint
    const response = await apiClient.get<CampaignInfo[]>(
      `/campaigns/by-creator/${creatorAddress}` // Note: Changed endpoint prefix based on backend route
    );
    console.log(`Found ${response.data.length} campaigns for ${creatorAddress}`);
    return response.data; // The backend returns the array directly
  };

  // Use the useQuery hook
  return useQuery<CampaignInfo[], AxiosError<ApiError>>({
    queryKey: queryKey,
    queryFn: fetchCampaigns,
    // Only run the query if the creatorAddress is provided
    enabled: !!creatorAddress,
    // Optional: Configure staleTime, refetchOnWindowFocus, retry, etc.
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry excessively for client errors like invalid address (though backend validates)
      if (error.response?.status === 400) return false;
      // Standard retry for server/network errors
      return failureCount < 2;
    }
  });
};