import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  UseQueryResult,
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query";
import apiClient from "./apiClient"; // Assuming apiClient is configured
import { AxiosError } from "axios";
import { CampaignDetails } from "../../BE/src/types/blockchainTypesx"; // Assuming CampaignDetails is defined in types
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
export type CampaignInfo = {
  campaignId: number;

} & CampaignDetails

// src/types/campaign.ts (or wherever you keep your types)

// Data structure expected by the frontend form/hook input
export interface CampaignMetadataFormInput {
  title: string;
  category: string;
  shortDescription: string;
  image: string | null; // Base64 data URI or null
  fullDescription: string;
  timeline: string;
  aboutYou: string;
  fundingGoal: string; // String from form input
  duration: string; // String from form input
  frontendTrackerId: string; // Unique ID for tracking this submission
  walletAddress: string; // Wallet address of the creator
}

// Data structure sent to the backend API (includes trackerId)


// Data structure received from the backend on success
export interface SaveMetadataSuccessResponse {
  message: string;
  data: {
    _id: string;
    frontendTrackerId: string;
  };
}

// Potential structure for API error responses
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, any>; // For validation errors
  frontendTrackerId?: string; // For conflict errors
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


// export const useSaveCampaignMetadata = (
//   body: FormData,
// )=>{


// }

const SAVE_METADATA_ENDPOINT = `/campaigns/saveMetadata`; // Adjust endpoint path

// --- API Call Function ---
const saveCampaignMetadata = async (
  metadataInput: CampaignMetadataFormInput
): Promise<SaveMetadataSuccessResponse> => {
  // Generate unique tracker ID for this submission

  const payload: CampaignMetadataFormInput = metadataInput

  console.log("Sending metadata payload:", payload); // For debugging

  // Replace with your configured axios instance if you have one
  const response = await apiClient.post<SaveMetadataSuccessResponse>(
    SAVE_METADATA_ENDPOINT,
    payload,
    {
      // Ensure your axios instance or global config handles auth (e.g., sending tokens)
      // headers: { 'Authorization': `Bearer ${your_token}` } // Example if needed here
    }
  );

  return response.data; // Axios returns the data property from the response
};

// --- React Query Hook ---
type UseSaveCampaignMetadataOptions = Omit<
  UseMutationOptions<
    SaveMetadataSuccessResponse, // Type of data returned on success
    AxiosError<ApiErrorResponse>, // Type of error
    CampaignMetadataFormInput // Type of variables passed to mutationFn
  >,
  "mutationFn" // We provide the mutationFn
>;

export const useSaveCampaignMetadata = (
  options?: UseSaveCampaignMetadataOptions
): UseMutationResult<
  SaveMetadataSuccessResponse,
  AxiosError<ApiErrorResponse>,
  CampaignMetadataFormInput
> => {
  return useMutation<
    SaveMetadataSuccessResponse,
    AxiosError<ApiErrorResponse>,
    CampaignMetadataFormInput
  >(
    {
      mutationFn: (metadataInput) => saveCampaignMetadata(metadataInput), // The function that performs the mutation

      // You can add default options for the mutation here
      // For example, handling success or error globally for this mutation
      onSuccess: (data, variables) => {
        console.log("Metadata saved successfully:", data);
        // Example: Invalidate a query for the list of campaigns
        // queryClient.invalidateQueries(['campaigns']);
        // Example: Show a success toast notification
        // toast.success(`Campaign metadata saved! ID: ${data.data.frontendTrackerId}`);
      },
      onError: (error, variables) => {
        console.error("Error saving metadata:", error.response?.data || error.message);
        // Example: Show an error toast notification
        // const errorMsg = error.response?.data?.message || "Failed to save metadata.";
        // toast.error(errorMsg);
      },
      // Spread any options passed into the hook
      ...options,

    }
  );
};
import { MergedCampaignData } from "../../BE/src/services/campaignService"; // Import the MergedCampaignData type

// Define a response type for the merged campaigns endpoint
interface MergedCampaignsResponse {
  success: boolean;
  count: number;
  data: MergedCampaignData[];
}

export const useGetMergedCampaigns = (): UseQueryResult<MergedCampaignData[], AxiosError<ApiError>> => {
  // Define a unique query key
  const queryKey: QueryKey = ["campaigns", "merged"];

  // Define the asynchronous function to fetch the data
  const fetchMergedCampaigns = async (): Promise<MergedCampaignData[]> => {
    console.log('Fetching merged campaigns data...');

    // Make the GET request to the backend endpoint
    const response = await apiClient.get<MergedCampaignsResponse>(
      `/campaigns/metadata/merged/all`
    );

    console.log(`Found ${response.data.count} merged campaigns`);
    return response.data.data; // Return just the data array from the response
  };

  // Use the useQuery hook
  return useQuery<MergedCampaignData[], AxiosError<ApiError>>({
    queryKey: queryKey,
    queryFn: fetchMergedCampaigns,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry excessively for server errors
      return failureCount < 2;
    }
  });
};