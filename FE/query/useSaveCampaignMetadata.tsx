// src/query/useForCampaigns.ts (or a new file like useSaveCampaignMetadata.ts)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// Assuming API URL setup as before
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
const apiClient = axios.create({ baseURL: API_BASE_URL });

// Payload for SAVING metadata to the backend
// Includes the campaignId obtained from the blockchain event
export interface SaveCampaignMetadataPayload {
  campaignId: number; // From blockchain event
  title: string;
  category: string;
  shortDescription: string;
  image: string | null;
  fullDescription: string;
  timeline: string;
  aboutYou: string;
  // Funding goal and duration are on-chain, but you might send them for redundancy
  fundingGoal: string;
  duration: string;
  creatorWallet: string; // The actual creator's wallet
  // Add contractAddress if your backend schema requires it for linking
  contractAddress?: string; // Optional, depends on backend schema
}

// Expected response from the backend metadata save endpoint
interface SaveCampaignMetadataResponse {
  message: string;
  campaign: any; // Define more specific type based on backend response
}

interface ApiError {
  message: string;
  error?: string;
}

/**
 * Hook to save campaign metadata to the backend AFTER successful blockchain creation.
 * Calls POST /api/v1/campaign (or your specific metadata endpoint)
 */
export const useSaveCampaignMetadata = () => {
  const queryClient = useQueryClient();

  const saveMetadata = async (
    payload: SaveCampaignMetadataPayload
  ): Promise<SaveCampaignMetadataResponse> => {
    // IMPORTANT: Adjust the endpoint if it's different from the old one
    // This endpoint should ONLY save metadata, not trigger blockchain actions.
    const response = await apiClient.post<SaveCampaignMetadataResponse>(
      "/campaign", // Or e.g., "/campaign/metadata"
      payload
    );
    return response.data;
  };

  return useMutation<
    SaveCampaignMetadataResponse,
    AxiosError<ApiError>,
    SaveCampaignMetadataPayload
  >({
    mutationFn: saveMetadata,
    onSuccess: (data) => {
      console.log("Campaign metadata saved successfully:", data);
      // Optionally invalidate queries related to campaign lists
      queryClient.invalidateQueries({ queryKey: ["campaigns"] }); // Example query key
    },
    onError: (error) => {
      console.error(
        "Error saving campaign metadata:",
        error.response?.data || error.message
      );
    },
  });
};

// Keep other campaign-related hooks if needed (e.g., fetching campaigns)
// Remove the old useCreateCampaign hook that called the backend blockchain endpoint
