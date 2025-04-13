// components/ContributeForm.tsx (Simplified Version)
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

// Import ABIs
import CrowdfundingPlatformAbi from "@/lib/contracts/abis/CrowdfundingPlatform.json";
import MockStableCoinAbi from "@/lib/contracts/abis/MockStableCoin.json";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

// --- Contract Configuration ---
const platformContractABI = CrowdfundingPlatformAbi.abi;
const mscContractABI = MockStableCoinAbi.abi;
const platformContractAddress = process.env.NEXT_PUBLIC_CROWDFUNDING_PLATFORM_ADDRESS as `0x${string}` | undefined;
const mscContractAddress = process.env.NEXT_PUBLIC_MOCK_STABLE_COIN_ADDRESS as `0x${string}` | undefined;

interface ContributeFormProps {
    campaignId: number;
}

export function ContributeForm({ campaignId }: ContributeFormProps) {
    const [amount, setAmount] = useState<string>("");

    // Simpler state tracking
    type TxStage = "idle" | "approving" | "approvalConfirmed" | "contributing" | "contributionConfirmed" | "error" | "success";
    const [txStage, setTxStage] = useState<TxStage>("idle");
    const [txError, setTxError] = useState<string | null>(null);
    const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>(undefined);
    const [contributionHash, setContributionHash] = useState<`0x${string}` | undefined>(undefined);

    const { address: contributorAddress, isConnected } = useAccount();

    // --- Wagmi Hooks ---
    const {
        data: writeContractResultHash,
        writeContract,
        isPending: isWritePending,
        error: writeContractError,
        reset: resetWriteContract,
    } = useWriteContract();

    const {
        isLoading: isConfirmingApproval,
        isSuccess: isApprovalConfirmed,
        error: approvalReceiptError,
    } = useWaitForTransactionReceipt({ hash: approvalHash, confirmations: 1 });

    const {
        isLoading: isConfirmingContribution,
        isSuccess: isContributionConfirmed,
        error: contributionReceiptError,
    } = useWaitForTransactionReceipt({ hash: contributionHash, confirmations: 1 });

    // --- Handle Contribution (Always Approve First) ---
    const handleContribute = () => { // Removed async
        if (!isConnected || !contributorAddress) { alert("Please connect wallet."); return; }
        if (!platformContractAddress || !mscContractAddress) { alert("Contract addresses missing."); return; }
        if (!amount || parseFloat(amount) <= 0) { alert("Please enter a valid amount."); return; }

        resetProcessStates(); // Clear previous state
        setTxStage("approving"); // Start directly with approval

        try {
            const amountInWei = ethers.parseUnits(amount, 18);
            console.log(`Initiating ALWAYS APPROVE for ${amount} MSC (${amountInWei.toString()} wei)`);

            // --- ALWAYS CALL APPROVE ---
            writeContract({
                address: mscContractAddress,
                abi: mscContractABI,
                functionName: 'approve',
                args: [platformContractAddress, amountInWei],
            }, {
                onSuccess: (hash) => {
                    console.log("✅ Approve Tx Sent (Always Approve). Hash:", hash);
                    setApprovalHash(hash);
                },
                onError: handleError("Approval Submission Failed"),
            });
            // --- END ALWAYS CALL APPROVE ---

        } catch (error: any) {
            handleError("Approval Process Error")(error);
        }
    };

    // --- Effect to trigger Contribution after Approval is confirmed ---
    useEffect(() => {
        // Only trigger if we were in the 'approving' stage and it just got confirmed
        if (txStage === 'approving' && isApprovalConfirmed && approvalHash) {
            console.log("✅ Approval Confirmed! Proceeding to contribute...");
            setTxStage("approvalConfirmed"); // Mark approval as done before contributing
            setTxError(null);

            try {
                if (!platformContractAddress) {

                    return console.error("Platform contract address is missing.");
                }
                const amountInWei = ethers.parseUnits(amount, 18); // Recalculate just in case
                console.log("Initiating contribute transaction after approval...");
                setTxStage("contributing"); // Update stage
                writeContract({
                    address: platformContractAddress,
                    abi: platformContractABI,
                    functionName: 'contribute',
                    args: [BigInt(campaignId), amountInWei],
                }, {
                    onSuccess: (hash) => {
                        console.log("✅ Contribute Tx Sent (after approve). Hash:", hash);
                        setContributionHash(hash);
                    },
                    onError: handleError("Contribution Submission Failed (after approve)"),
                });
            } catch (error: any) {
                handleError("Contribute Call Error (after approve)")(error);
            }
        }
    }, [txStage, isApprovalConfirmed, approvalHash, amount, campaignId, platformContractAddress, platformContractABI, writeContract]); // Dependencies


    // --- Effect to handle final success state ---
    useEffect(() => {
        // Only trigger if we were in 'contributing' stage and it just got confirmed
        if (txStage === 'contributing' && isContributionConfirmed && contributionHash) {
            console.log("✅ Contribution Confirmed! Process Complete.");
            setTxStage("success");
            setTxError(null);
            // No need to refetch allowance in this simplified version
        }
    }, [txStage, isContributionConfirmed, contributionHash]);


    // --- Error Handling & Reset ---
    const handleError = (prefix: string) => (error: any) => {
        console.error(`❌ ${prefix}:`, error);
        const message = (error as any)?.shortMessage ?? error.message;
        setTxError(`${prefix}: ${message.split('(')[0]}`);
        setTxStage("error");
    };
    const resetProcessStates = () => {
        setTxError(null);
        setApprovalHash(undefined);
        setContributionHash(undefined);
        resetWriteContract();
        setTxStage("idle"); // Reset stage on new attempt
    };

    // --- Loading State ---
    // Simplified loading state
    const isLoading = isWritePending || isConfirmingApproval || isConfirmingContribution;

    // --- Render ---
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Contribute to Campaign #{campaignId}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!isConnected ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wallet Not Connected</AlertTitle>
                        <AlertDescription>Please connect your wallet to contribute.</AlertDescription>
                    </Alert>
                ) : (
                    <>
                        <div className="space-y-1">
                            <Label htmlFor="amount">Amount (MSC)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="e.g., 100"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0.000001"
                                step="any"
                                disabled={isLoading || txStage === 'success'}
                            />
                            {/* Removed allowance display as we don't check it */}
                        </div>

                        {/* Status Display */}
                        {txStage === 'approving' && (
                            <Alert  >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <AlertTitle>Step 1: Approving Spending...</AlertTitle>
                                <AlertDescription>Please confirm the approval transaction in your wallet. {isConfirmingApproval ? '(Waiting for confirmation...)' : ''}</AlertDescription>
                            </Alert>
                        )}
                        {txStage === 'approvalConfirmed' && (
                            <Alert >
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Approval Confirmed</AlertTitle>
                                <AlertDescription>Proceeding with contribution...</AlertDescription>
                            </Alert>
                        )}
                        {txStage === 'contributing' && (
                            <Alert >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <AlertTitle>Step 2: Contributing...</AlertTitle>
                                <AlertDescription>Please confirm the contribution transaction in your wallet. {isConfirmingContribution ? '(Waiting for confirmation...)' : ''}</AlertDescription>
                            </Alert>
                        )}
                        {txStage === 'success' && (
                            <Alert  >
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Contribution Successful!</AlertTitle>
                                <AlertDescription>Thank you for your support!</AlertDescription>
                            </Alert>
                        )}
                        {txStage === 'error' && txError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{txError}</AlertDescription>
                            </Alert>
                        )}
                    </>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleContribute}
                    disabled={!isConnected || isLoading || txStage === 'success' || !amount || parseFloat(amount) <= 0}
                    className="w-full"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {/* Simplified Button Text */}
                    {txStage === 'approving' ? 'Approving...' :
                        txStage === 'approvalConfirmed' ? 'Contributing...' :
                            txStage === 'contributing' ? 'Contributing...' :
                                txStage === 'success' ? 'Contribution Sent!' :
                                    'Contribute (Approve First)'}
                </Button>
            </CardFooter>
        </Card>
    );
}
