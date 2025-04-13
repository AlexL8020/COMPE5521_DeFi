// components/MyCampaignCard.tsx (New File)
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Edit, Trash2, ArrowUpRight, AlertCircle, CheckCircle, Loader2, Gift } from "lucide-react"; // Added Gift, Loader2, CheckCircle
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { ethers } from "ethers";
import { MergedCampaignData } from "../../../BE/src/services/campaignService";

// Import ABI and Address (adjust paths)
import CrowdfundingPlatformAbi from "@/lib/contracts/abis/CrowdfundingPlatform.json";
import { useUserProfile } from "@/query/useForUser";
const contractABI = CrowdfundingPlatformAbi.abi;
const contractAddress = process.env.NEXT_PUBLIC_CROWDFUNDING_PLATFORM_ADDRESS as `0x${string}` | undefined;

interface MyCampaignCardProps {
    campaign: Partial<MergedCampaignData>; // Use Partial if some fields might be optional initially
}

export function MyCampaignCard({ campaign }: MyCampaignCardProps) {
    const { address: connectedAddress, isConnected } = useAccount();

    // State for claim process
    const [claimError, setClaimError] = useState<string | null>(null);
    const [isClaimSuccessful, setIsClaimSuccessful] = useState(false); // Track success state

    // Wagmi hooks for claiming
    const {
        data: claimTxHash,
        writeContract: claimFundsWrite,
        isPending: isClaiming, // Pending user wallet interaction
        error: claimWriteError,
        reset: resetClaimWrite,
    } = useWriteContract();

    const {
        isLoading: isConfirmingClaim, // Waiting for blockchain confirmation
        isSuccess: isClaimConfirmed, // Claim tx confirmed
        error: claimReceiptError,
    } = useWaitForTransactionReceipt({
        hash: claimTxHash,
        confirmations: 1,
    });
    const { data: creatorData } = useUserProfile(campaign?.mongoCreatorWalletAddress || "")

    // --- Derived Data & Conditions ---
    const campaignId = campaign?.blockchainCampaignId; // **ASSUMING THIS EXISTS**
    const creator = creatorData?.user?.name ?? "---";

    const deadline = campaign?.deadline || 0; // Default to 0 if undefined
    const goalAmount = parseFloat(campaign?.blockchainGoal || "1"); // Use blockchainGoal
    const raisedAmount = parseFloat(campaign?.amountRaised || "0");
    const isClaimed = campaign?.claimed || false; // Default to false if undefined
    const isActive = campaign?.active ?? false; // Use active status from data

    const isCreator = isConnected && connectedAddress?.toLowerCase() === campaign?.mongoCreatorWalletAddress?.toLowerCase();
    const isDeadlinePassed = Date.now() / 1000 >= deadline;
    const isGoalReached = raisedAmount >= goalAmount;

    // Determine if the claim button should be shown and enabled
    const canClaim = isCreator && isGoalReached && !isClaimed;
    const isProcessingClaim = isClaiming || isConfirmingClaim;
    const { data: backersArray, isLoading: isBackerLoading, error: backerError } = useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getCampaignBackers',
        args: [BigInt(campaignId ?? 0)],
        query: {
            enabled: !!contractAddress && campaignId != undefined && Number(campaignId) >= 0 as any, // Only run if valid
        }
    });

    const backerCount = Array.isArray(backersArray) ? backersArray.length : 0;


    // --- Claim Function ---
    const handleClaim = () => {
        if (!canClaim || campaignId == undefined || !contractAddress) {
            console.error("Claim function called with invalid state or missing data.");
            return; // Early exit if conditions are not met
        }

        console.log(`Attempting to claim funds for campaign ID: ${campaignId}`);
        setClaimError(null);
        setIsClaimSuccessful(false);
        resetClaimWrite(); // Reset previous write state

        claimFundsWrite({
            address: contractAddress,
            abi: contractABI,
            functionName: "claimFunds",
            args: [BigInt(campaignId)], // Pass campaignId as BigInt
        }, {
            onSuccess: (hash) => {
                console.log(`✅ Claim funds transaction sent: ${hash}`);
            },
            onError: (error) => {
                console.error(`❌ Error sending claim funds transaction:`, error);
                setClaimError(`Failed to send transaction: ${error.message.split("(")[0]}`);
            }
        });
    };

    // --- Effect to handle claim success/error after confirmation ---
    useEffect(() => {
        if (isClaimConfirmed) {
            console.log(`✅ Claim successful for campaign ${campaignId}`);
            setIsClaimSuccessful(true);
            setClaimError(null);
            // Optionally: Trigger a refetch of campaign data here
            // queryClient.invalidateQueries({ queryKey: ['campaigns', creator] });
        }
        if (claimReceiptError) {
            console.error(`❌ Error confirming claim transaction for campaign ${campaignId}:`, claimReceiptError);
            setClaimError(`Transaction failed: ${claimReceiptError.message.split("(")[0]}`);
            setIsClaimSuccessful(false);
        }
        if (claimWriteError) { // Handle error during sending itself
            console.error(`❌ Error writing claim transaction for campaign ${campaignId}:`, claimWriteError);
            setClaimError(`Transaction error: ${claimWriteError.message.split("(")[0]}`);
            setIsClaimSuccessful(false);
        }
    }, [isClaimConfirmed, claimReceiptError, claimWriteError, campaignId]); // Added claimWriteError dependency


    // --- Render Data (adjust based on your MergedCampaignData structure) ---
    const displayCampaignId = campaign?.blockchainCampaignId ?? campaign?.frontendTrackerId ?? "N/A"; // Fallback display ID
    const campaignName = campaign?.title ?? "Untitled Campaign";
    const createdOn = campaign?.metadataCreatedAt ? new Date(campaign.metadataCreatedAt).toLocaleDateString() : "--";
    const daysLeft = isDeadlinePassed ? 0 : Math.max(0, Math.floor((new Date(deadline * 1000).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const progressValue = goalAmount > 0 ? Math.min(100, (raisedAmount / goalAmount) * 100) : 0;

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{campaignName}</CardTitle>
                    {/* Use more specific status based on claim/active/deadline */}
                    <Badge variant={isClaimed ? "secondary" : (isActive && !isDeadlinePassed) ? "default" : "outline"}>
                        {isClaimed ? "Claimed" : isActive ? (isDeadlinePassed ? "Ended" : "Active") : "Draft/Inactive"}
                    </Badge>
                </div>
                <CardDescription>ID: {displayCampaignId} | Created: {createdOn}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1 text-sm">
                            <span className="font-medium">{raisedAmount.toFixed(2)} MSC raised</span>
                            <span className="text-muted-foreground">of {goalAmount.toFixed(2)} MSC goal</span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
                    </div>
                    <div className="flex gap-2 text-center text-sm">
                        <div className="flex-1 rounded-md p-2">
                            {/* Placeholder for backers - requires fetching backers array */}
                            <div className="font-medium">{backerCount ?? 0}</div>
                            <div className="text-xs text-muted-foreground">Backers</div>
                        </div>
                        <div className="flex-1 rounded-md p-2">
                            <div className="font-medium">{daysLeft}</div>
                            <div className="text-xs text-muted-foreground">Days Left</div>
                        </div>
                    </div>
                    {/* Display Claim Status/Error within the card */}
                    {claimError && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Claim Error</AlertTitle>
                            <AlertDescription>{claimError}</AlertDescription>
                        </Alert>
                    )}
                    {isClaimSuccessful && (
                        <Alert className="mt-2">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Claim Successful</AlertTitle>
                            <AlertDescription>Funds claimed successfully!</AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                    {/* Link still uses frontendTrackerId if that's your routing key */}
                    <Link href={`/campaigns/${campaign?.frontendTrackerId ?? campaignId}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            View
                        </Button>
                    </Link>



                    {/* Conditional Claim Button */}
                    {isCreator && ( // Only show button area if user is the creator
                        <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={handleClaim}
                            disabled={!canClaim || isProcessingClaim || isClaimSuccessful} // Disable if not eligible, processing, or already succeeded
                        >
                            {isProcessingClaim && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isClaimSuccessful ? "Funds Claimed" : canClaim ? "Claim Funds" : "Cannot Claim Yet"}
                            {!isProcessingClaim && !isClaimSuccessful && canClaim && <Gift className="h-4 w-4 ml-2" />}
                        </Button>
                    )}
                </div>
            </CardFooter>

        </Card>
    );
}
