// src/hooks/useCampaignMutations.ts
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "./apiClient"; // Assuming you have apiClient configured like in useForUser.ts
// src/hooks/campaignTypes.ts (or similar file)
import { AxiosError } from "axios";

// Payload for creating a campaign
// Aligned with CampaignFormData types, plus creatorWallet
export interface CreateCampaignPayload {
  title: string;
  category: string;
  shortDescription: string;
  image: string | null; // Updated to allow null
  fullDescription: string;
  timeline: string; // Updated to string
  aboutYou: string;
  fundingGoal: string; // Updated to string
  duration: string; // Updated to string
  creatorWallet: string; // Still required for the API payload
}

// Expected response structure from POST /api/v1/campaign
// Adjust based on your actual backend response
export interface CreateCampaignApiResponse {
  message: string;
  campaign: {
    _id: string;
    title: string;
    // ... other campaign fields returned by the API
  };
}

// Re-use or define a standard API error structure
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

// Define the specific type for the mutation hook result
// (No changes needed here, but ensure it's defined)
export type UseCreateCampaignMutationResult = UseMutationResult<
  CreateCampaignApiResponse,
  AxiosError<ApiError>,
  CreateCampaignPayload
>;

/**
 * Hook to create a new campaign via POST /api/v1/campaign.
 *
 * @returns React Query mutation result object for creating a campaign.
 */
export const useCreateCampaign = (): UseMutationResult<
  CreateCampaignApiResponse,
  AxiosError<ApiError>,
  CreateCampaignPayload
> => {
  const queryClient = useQueryClient();

  // The async function that performs the API call
  const createCampaign = async (
    campaignData: CreateCampaignPayload
  ): Promise<CreateCampaignApiResponse> => {
    console.log("Attempting to create campaign with payload:", campaignData);
    const { image, ...rest } = campaignData;
    // Use your configured apiClient (e.g., Axios instance)
    // It likely handles JSON stringification and headers automatically
    const response = await apiClient.post<CreateCampaignApiResponse>(
      "/campaign", // Your campaign creation endpoint
      campaignData
    );
    console.log("Campaign creation API response:", response.data);
    return response.data;
  };

  return useMutation<
    CreateCampaignApiResponse,
    AxiosError<ApiError>,
    CreateCampaignPayload
  >({
    mutationFn: createCampaign,
    onSuccess: (data, variables) => {
      // --- Success Handling ---
      console.log("Campaign created successfully via useMutation:", data);

      // --- Invalidate Queries (Optional but Recommended) ---
      // If you have queries that fetch lists of campaigns or the specific
      // user's campaigns, invalidate them here so they refetch fresh data.
      // Example: Invalidate a query fetching all campaigns
      // queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      // Example: Invalidate campaigns related to the creator
      // queryClient.invalidateQueries({ queryKey: ['campaigns', 'creator', variables.creatorWallet] });

      // --- Side Effects (Optional) ---
      // e.g., Show a success notification to the user
      // alert("Campaign launched successfully!");
      // You might trigger navigation here as well
    },
    onError: (error, variables) => {
      // --- Error Handling ---
      console.error(
        "Error creating campaign via useMutation:",
        error.response?.data || error.message
      );

      // --- Side Effects (Optional) ---
      // e.g., Show an error notification to the user
      // alert(`Failed to launch campaign: ${error.response?.data?.message || error.message}`);
    },
    // You can add onMutate or onSettled callbacks if needed
    // onSettled: () => {
    //   console.log("Mutation settled (either success or error)");
    // },
  });
};
