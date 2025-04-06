// src/hooks/useForUser.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "./apiClient";
import { AxiosError } from "axios";

// --- TypeScript Interfaces ---

// Define the structure of the user data returned by your GET /users/:walletAddress endpoint
// Adjust properties based on your actual User model in the backend
export interface UserProfile {
  _id: string; // Or ObjectId if you use that type on the frontend
  walletAddress: string;
  name: string;
  email?: string;
  profilePictureUrl?: string;
  bio?: string;
  createdAt: string; // Dates usually come as ISO strings
  updatedAt: string;
  // Add any other relevant user fields
}

type CheckUserApiResponse = {
  isExist: true;
  user: any; // Or a specific subset
  balance: any; // Assuming balance is BigNumber/string
};

// Define the payload required for the POST /register endpoint
export interface CreateUserPayload {
  walletAddress: string;
  name: string; // Assuming name is required for registration
  email?: string;
  profilePictureUrl?: string;
  bio?: string;
}

// Define the structure of the response from the POST /register endpoint
// Adjust based on what your backend returns (e.g., the created user, success message)
interface CreateUserApiResponse {
  message: string;
  user: UserProfile;
  tokensReceived?: boolean; // Include if your backend returns this
}

// Define a custom error type for API errors (optional but helpful)
interface ApiError {
  message: string;
  error?: string; // Include if your backend sends additional error details
  // You might add status code here if needed, though AxiosError provides it
}

// --- React Query Hooks ---

/**
 * Hook to check if a user exists based on their wallet address.
 * Fetches user profile data from GET /users/:walletAddress.
 * Handles 404 "Not Found" specifically - it will result in `isError` being true,
 * and the error object can be inspected for status 404.
 *
 * @param walletAddress The user's wallet address (string | null | undefined). Query is disabled if null/undefined.
 * @returns React Query result object for the user profile check.
 */
export const useCheckUserExists = (
  walletAddress: string | null | undefined
): UseQueryResult<CheckUserApiResponse, AxiosError<ApiError>> => {
  const queryKey: QueryKey = ["user", walletAddress];

  const fetchUserByWalletAddress = async (): Promise<CheckUserApiResponse> => {
    if (!walletAddress) {
      // Should not happen if 'enabled' is false, but good practice
      throw new Error("Wallet address is required");
    }
    console.log(`Checking user existence for address: ${walletAddress}`);
    const response = await apiClient.get<CheckUserApiResponse>(
      `/users/${walletAddress}`
    );
    return response.data;
  };

  return useQuery<CheckUserApiResponse, AxiosError<ApiError>>({
    queryKey: queryKey,
    queryFn: fetchUserByWalletAddress,
    enabled: !!walletAddress, // Only run the query if walletAddress is truthy
    retry: (failureCount, error) => {
      // Don't retry if the error is a 404 (User Not Found)
      if (error.response?.status === 404) {
        console.log(
          `User not found (404) for address: ${walletAddress}, not retrying.`
        );
        return false;
      }
      // Standard retry logic for other errors (e.g., network issues)
      return failureCount < 3;
    },
    refetchOnWindowFocus: false, // Optional: prevent refetching on window focus
    staleTime: 5 * 60 * 1000, // Optional: Data is considered fresh for 5 minutes
  });
};

/**
 * Hook to create a new user via POST /register.
 *
 * @returns React Query mutation result object for creating a user.
 */
export const useCreateUser = (): UseMutationResult<
  CreateUserApiResponse, // Type of data returned on success
  AxiosError<ApiError>, // Type of error
  CreateUserPayload // Type of variables passed to the mutation function
> => {
  const queryClient = useQueryClient();

  const createUser = async (
    userData: CreateUserPayload
  ): Promise<CreateUserApiResponse> => {
    console.log("Attempting to create user:", userData);
    const response = await apiClient.post<CreateUserApiResponse>(
      "/users/register",
      userData
    );
    console.log("User creation response:", response.data);
    return response.data;
  };

  return useMutation<
    CreateUserApiResponse,
    AxiosError<ApiError>,
    CreateUserPayload
  >({
    mutationFn: createUser,
    onSuccess: (data, variables) => {
      // --- Invalidate and Refetch ---
      // When a user is successfully created, invalidate the query
      // that checks for their existence, so it refetches the new data.
      console.log(
        "User created successfully, invalidating user query for:",
        variables.walletAddress
      );
      queryClient.invalidateQueries({
        queryKey: ["user", variables.walletAddress],
      });

      // You could also manually set the query data if the creation endpoint
      // returns the full user profile, potentially saving a refetch:
      // queryClient.setQueryData(['user', variables.walletAddress], data.user);

      // --- Optional: Side Effects ---
      // e.g., show a success notification
      // alert(`User ${data.user.name} created successfully!`);
    },
    onError: (error, variables) => {
      // --- Optional: Side Effects ---
      console.error(
        "Error creating user:",
        error.response?.data || error.message
      );
      // e.g., show an error notification
      // alert(`Failed to create user: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUserProfile = (
  walletAddress: string | null | undefined,
  enabled: boolean = true
) => {
  const queryKey: QueryKey = ["userProfile", walletAddress];

  const fetchUserProfile = async () => {
    if (!walletAddress) {
      throw new Error("Wallet address is required");
    }

    console.log(`Fetching complete profile for user: ${walletAddress}`);
    const response = await apiClient.get<{ user: UserProfile }>(
      `/users/${walletAddress}`
    );
    console.log(
      "=============== fetchUserProfile User profile response:",
      response
    );
    return response.data;
  };

  return useQuery({
    queryKey: queryKey,
    queryFn: fetchUserProfile,
    // enabled: !!walletAddress && enabled !== false, // Disabled if no wallet or explicitly disabled
    // retry: (failureCount, error: AxiosError<ApiError>) => {
    //   // Don't retry if the user doesn't exist
    //   if (error.response?.status === 404) {
    //     console.log(`User profile not found for address: ${walletAddress}`);
    //     return false;
    //   }
    //   // Standard retry logic for other errors
    //   return failureCount < 2;
    // },
    // refetchOnWindowFocus: false,
    // staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  });
};
