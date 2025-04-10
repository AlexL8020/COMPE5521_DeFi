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



/**
 * Hook to fetch wallet balance for a given wallet address.
 *
 * @param walletAddress The user's wallet address.
 * @returns React Query result object for the wallet balance.
 */
export const useWalletBalance = (walletAddress: string | null | undefined) => {
    const queryKey: QueryKey = ["walletBalance", walletAddress];

    const fetchWalletBalance = async () => {
        if (!walletAddress) {
            throw new Error("Wallet address is required");
        }

        console.log(`Fetching wallet balance for address: ${walletAddress}`);
        const response = await apiClient.get<{
            balance: string;
        }>(
            `/blockchain/balance/${walletAddress}`
        );
        return response.data;
    };

    return useQuery({
        queryKey: queryKey,
        queryFn: fetchWalletBalance,
        enabled: !!walletAddress,
        retry: (failureCount, error) => {
            // Retry logic (can be customized)
            return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000, // 1 minute
    });
};