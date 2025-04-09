// FE/app/campaigns/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Removed Tabs imports as they were commented out
import {
  AlertCircle,
  Upload,
  Info,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react"; // Added Loader2
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useWalletAuth } from "../../../hooks/useWalletAuth"; // Assuming this uses wagmi
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi"; // Import wagmi hooks
import { ethers, Interface, Log } from "ethers"; // Import ethers
import {
  useSaveCampaignMetadata,
  SaveCampaignMetadataPayload,
} from "@/query/useSaveCampaignMetadata"; // Import the NEW metadata hook
import clsx from "clsx";
import CrowdfundingPlatformAbi from "@/lib/contracts/abis/CrowdfundingPlatform.json";
// --- Contract Configuration ---
// Import ABI (replace with your actual import method)
const contractABI = CrowdfundingPlatformAbi.abi;
const contractAddress = process.env
  .NEXT_PUBLIC_CROWDFUNDING_PLATFORM_ADDRESS as `0x${string}` | undefined;

// --- Component Types ---
type CampaignFormData = {
  title: string;
  category: string;
  shortDescription: string;
  image: string | null;
  fullDescription: string;
  timeline: string;
  aboutYou: string;
  fundingGoal: string; // Keep as string for input
  duration: string; // Keep as string for input
};

// --- Component ---
export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    category: "",
    shortDescription: "",
    image: null,
    fullDescription: "",
    timeline: "",
    aboutYou: "",
    fundingGoal: "",
    duration: "",
  });
  const [txError, setTxError] = useState<string | null>(null);
  const [createdCampaignId, setCreatedCampaignId] = useState<number | null>(
    null
  );

  // --- Wallet & Account ---
  const { address: creatorWallet, isConnected } = useAccount(); // Get address directly from wagmi

  // --- Wagmi Hooks for Blockchain Interaction ---
  const {
    data: writeContractHash, // Transaction hash from writeContract
    writeContract, // Function to initiate the transaction
    isPending: isWriteContractLoading, // Loading state for initiating tx
    error: writeContractError,
  } = useWriteContract();

  const {
    data: txReceipt, // Transaction receipt after confirmation
    isLoading: isConfirming, // Loading state while waiting for confirmation
    isSuccess: isConfirmed, // True if transaction is confirmed
    error: txReceiptError,
  } = useWaitForTransactionReceipt({
    hash: writeContractHash, // Wait for the specific transaction hash
    confirmations: 1, // Number of confirmations to wait for (adjust as needed)
  });

  // --- React Query Hook for Saving Metadata to Backend ---
  const {
    mutate: saveMetadataMutate,
    isPending: isSavingMetadata,
    isSuccess: isMetadataSaved,
    error: saveMetadataError,
  } = useSaveCampaignMetadata();

  // --- Step Navigation ---
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // --- Form Input Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size > 1 * 1024 * 1024) {
          // 1MB limit
          alert("File too large. Max size: 1MB.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select an image file.");
        e.target.value = "";
      }
    }
  };

  // --- Handle Blockchain Transaction Submission ---
  const handleLaunchCampaign = async () => {
    setTxError(null); // Reset previous errors
    setCreatedCampaignId(null);

    if (!isConnected || !creatorWallet) {
      alert("Please connect your wallet first.");
      // Optionally trigger wallet connection here if you have a function for it
      return;
    }
    if (!contractAddress) {
      alert("Contract address is not configured. Please contact support.");
      console.error("NEXT_PUBLIC_CROWDFUNDING_PLATFORM_ADDRESS is not set");
      return;
    }

    try {
      // 1. Validate and Prepare Contract Arguments
      const goalValue = parseFloat(formData.fundingGoal);
      const durationValue = parseInt(formData.duration, 10);

      if (isNaN(goalValue) || goalValue <= 0) {
        setTxError("Invalid funding goal. Please enter a positive number.");
        return;
      }
      if (isNaN(durationValue) || durationValue <= 0) {
        setTxError("Invalid duration. Please select a valid number of days.");
        return;
      }

      const goalInWei = ethers.parseUnits(formData.fundingGoal, 18); // Convert ETH to Wei

      console.log("Initiating createCampaign transaction...");
      console.log("Goal (Wei):", goalInWei.toString());
      console.log("Duration (Days):", durationValue);

      // 2. Call writeContract (triggers MetaMask popup)
      writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "createCampaign",
        args: [goalInWei, BigInt(durationValue)], // Use BigInt for uint256 duration
      });
      // Execution continues in the useEffect below once hash is available and tx confirmed
    } catch (err: any) {
      console.error("Error initiating transaction:", err);
      setTxError(
        `Failed to initiate transaction: ${err.shortMessage || err.message}`
      );
    }
  };

  // --- Effect to Handle Post-Transaction Logic (Confirmation & Metadata Save) ---
  useEffect(() => {
    if (isConfirmed && txReceipt) {
      console.log("Transaction Confirmed:", txReceipt);
      setTxError(null); // Clear any previous errors

      // 3. Parse Logs to find CampaignCreated event and get campaignId
      let foundCampaignId: number | null = null;
      const iFace = new Interface(contractABI);
      for (const log of txReceipt.logs as unknown as Log[]) {
        // Cast needed sometimes
        try {
          // Ensure log has topics and data before parsing
          if (
            log.topics &&
            log.data &&
            log.address.toLowerCase() === contractAddress?.toLowerCase()
          ) {
            const parsedLog = iFace.parseLog(log);
            if (parsedLog && parsedLog.name === "CampaignCreated") {
              foundCampaignId = Number(parsedLog.args[0]); // First argument is campaignId
              console.log(
                "Parsed CampaignCreated event, Campaign ID:",
                foundCampaignId
              );
              break;
            }
          }
        } catch (parseError) {
          // Ignore logs that don't match the ABI or are from other contracts
          // console.debug("Could not parse log or wrong contract:", log, parseError);
        }
      }

      if (foundCampaignId !== null && creatorWallet) {
        setCreatedCampaignId(foundCampaignId); // Store the ID

        // 4. Prepare Metadata Payload for Backend
        const metadataPayload: SaveCampaignMetadataPayload = {
          campaignId: foundCampaignId,
          title: formData.title,
          category: formData.category,
          shortDescription: formData.shortDescription,
          image: formData.image,
          fullDescription: formData.fullDescription,
          timeline: formData.timeline,
          aboutYou: formData.aboutYou,
          fundingGoal: formData.fundingGoal, // Send original string values
          duration: formData.duration,
          creatorWallet: creatorWallet, // Use the connected wallet address
          // contractAddress: contractAddress, // Include if needed by backend
        };

        console.log("Saving metadata to backend:", metadataPayload);
        // 5. Call the mutation to save metadata
        saveMetadataMutate(metadataPayload);
      } else if (!creatorWallet) {
        console.error("Creator wallet address missing after confirmation.");
        setTxError("Wallet address missing after confirmation.");
      } else {
        console.error(
          "Could not find CampaignCreated event in transaction logs."
        );
        setTxError(
          "Campaign created, but failed to retrieve Campaign ID from logs."
        );
      }
    }
  }, [
    isConfirmed,
    txReceipt,
    contractABI,
    creatorWallet,
    formData,
    saveMetadataMutate,
  ]); // Dependencies

  // --- Handle Errors from Hooks ---
  useEffect(() => {
    if (writeContractError) {
      console.error("Write Contract Error:", writeContractError);
      setTxError(
        `Blockchain Error: ${writeContractError.message.split("(")[0]}`
      ); // Show cleaner error
    }
    if (txReceiptError) {
      console.error("Transaction Receipt Error:", txReceiptError);
      setTxError(`Transaction Failed: ${txReceiptError.message.split("(")[0]}`);
    }
    if (saveMetadataError) {
      // Error saving metadata already logged in the hook's onError
      // Optionally set a state here to show a specific UI message for metadata save failure
      setTxError(
        `Metadata Save Failed: ${
          saveMetadataError.response?.data?.message || saveMetadataError.message
        }`
      );
    }
  }, [writeContractError, txReceiptError, saveMetadataError]);

  // --- Determine Button State ---
  const getButtonState = () => {
    if (!isConnected) return { text: "Connect Wallet", disabled: true };
    if (isWriteContractLoading)
      return { text: "Check Wallet...", disabled: true };
    if (isConfirming) return { text: "Confirming Tx...", disabled: true };
    if (isSavingMetadata) return { text: "Saving Data...", disabled: true };
    if (isConfirmed && isMetadataSaved)
      return { text: "Campaign Launched!", disabled: true };
    // Check if required fields for the final step are filled
    const areFieldsFilled =
      formData.fundingGoal !== "" && formData.duration !== "";
    if (!areFieldsFilled)
      return { text: "Fill Funding Details", disabled: true };
    // Check if review is expanded (assuming reviewExpanded state exists)
    // if (!reviewExpanded) return { text: "Review Before Launching", disabled: true };
    return { text: "Launch Campaign", disabled: false };
  };
  const buttonState = getButtonState();

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Your Campaign</h1>
          <p className="text-muted-foreground mb-8">
            Share your educational goals with potential backers
          </p>
        </div>
        <ThemeToggle />
      </div>

      <StepBar currentStep={currentStep} />

      {/* Render steps based on currentStep */}
      {currentStep === 1 && (
        <BasicInfoStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleFileChange={handleFileChange}
          nextStep={nextStep}
        />
      )}

      {currentStep === 2 && (
        <CampaignDetailsStep
          formData={formData}
          handleInputChange={handleInputChange}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {currentStep === 3 && (
        <FundingAndReviewStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          // Pass the new handler and loading states
          handleLaunchCampaign={handleLaunchCampaign}
          buttonState={buttonState}
          txError={txError}
          isSuccess={isConfirmed && isMetadataSaved} // Overall success
          createdCampaignId={createdCampaignId}
          prevStep={prevStep}
        />
      )}
    </div>
  );
}

// --- Step Components (Mostly Unchanged, except FundingAndReviewStep) ---

// StepBar component remains the same
const StepBar = ({ currentStep }: { currentStep: number }) => {
  // ... (same as before) ...
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted"></div>
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-muted text-muted-foreground"
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm ">
        <div
          className={clsx(
            "w-10 text-center",
            currentStep >= 1
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          )}
        >
          Basic Info
        </div>
        <div
          className={clsx(
            "w-10 text-center mr-4",
            currentStep >= 2
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          )}
        >
          Campaign Details
        </div>
        <div
          className={clsx(
            "w-12 text-center",
            currentStep >= 3
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          )}
        >
          Funding & Review
        </div>
      </div>
    </div>
  );
};

// BasicInfoStep component remains the same
type BasicInfoStepProps = {
  formData: {
    title: string;
    category: string;
    shortDescription: string;
    image: string | null;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (id: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
};
function BasicInfoStep({
  formData,
  handleInputChange,
  handleSelectChange,
  handleFileChange,
  nextStep,
}: BasicInfoStepProps) {
  // ... (same as before) ...
  const isNextDisabled =
    formData.title === "" ||
    formData.category === "" ||
    formData.shortDescription === "" ||
    formData.image == null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Tell us about your campaign and yourself
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign Title</Label>
          <Input
            id="title"
            placeholder="Enter a clear, specific title for your campaign"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tuition">Tuition</SelectItem>
              <SelectItem value="research">Research Project</SelectItem>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="project">Personal Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            placeholder="Provide a brief summary of your campaign (150 characters max)"
            className="resize-none"
            value={formData.shortDescription}
            onChange={handleInputChange}
            maxLength={150}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Campaign Image</Label>
          {formData.image ? (
            <img
              src={formData.image}
              alt="Campaign preview"
              className="max-h-48 rounded-lg mx-auto"
            />
          ) : (
            <>
              <label
                htmlFor="image"
                className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                  Drag and drop an image, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200 x 675 pixels
                </p>
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button disabled={isNextDisabled} onClick={nextStep}>
          {isNextDisabled ? "Please fill all fields" : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// CampaignDetailsStep component remains the same
type CampaignDetailsStepProps = {
  formData: {
    fullDescription: string;
    timeline: string;
    aboutYou: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
};
function CampaignDetailsStep({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
}: CampaignDetailsStepProps) {
  // ... (same as before) ...
  const isNextDisabled =
    formData.fullDescription === "" ||
    formData.timeline === "" ||
    formData.aboutYou === "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Details</CardTitle>
        <CardDescription>
          Share your story and educational goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullDescription">Full Description</Label>
          <Textarea
            id="fullDescription"
            placeholder="Tell your story. Why are you raising funds? What will you use them for? How will backers benefit?"
            className="min-h-[200px] resize-none"
            value={formData.fullDescription}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            You can use markdown for formatting. Add images, lists, and more to
            make your story compelling.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline</Label>
          <Textarea
            id="timeline"
            placeholder="Outline your educational or project timeline. When will you start? When do you expect to complete your goals?"
            className="resize-none"
            value={formData.timeline}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aboutYou">About You</Label>
          <Textarea
            id="aboutYou"
            placeholder="Tell potential backers about yourself, your background, and why you're passionate about this educational goal."
            className="resize-none"
            value={formData.aboutYou}
            onChange={handleInputChange}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button disabled={isNextDisabled} onClick={nextStep}>
          {isNextDisabled ? "Please fill all fields" : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// FundingAndReviewStep component UPDATED
type FundingAndReviewStepProps = {
  formData: CampaignFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (id: string, value: string) => void;
  handleLaunchCampaign: () => void; // Changed from handleSubmit
  buttonState: { text: string; disabled: boolean }; // Pass button state
  txError: string | null; // Pass transaction error
  isSuccess: boolean; // Pass overall success state
  createdCampaignId: number | null; // Pass created ID
  prevStep: () => void;
};

function FundingAndReviewStep({
  formData,
  handleInputChange,
  handleSelectChange,
  handleLaunchCampaign, // Use the new handler
  buttonState, // Use the button state object
  txError, // Display transaction error
  isSuccess, // Display success message
  createdCampaignId,
  prevStep,
}: FundingAndReviewStepProps) {
  const [reviewExpanded, setReviewExpanded] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding & Review</CardTitle>
        <CardDescription>
          Set your funding goal and review your campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Connection Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Your wallet must be connected to launch the campaign on the
            blockchain. Funds will be managed by the smart contract.
          </AlertDescription>
        </Alert>

        {/* Funding Goal Input */}
        <div className="space-y-2">
          <Label htmlFor="fundingGoal">Funding Goal (ETH)</Label>
          <Input
            id="fundingGoal"
            type="number"
            placeholder="e.g., 1.5" // Changed placeholder
            min="0.01" // Adjust min goal if needed
            step="0.01" // Adjust step
            value={formData.fundingGoal}
            onChange={handleInputChange}
            disabled={buttonState.disabled && !isSuccess} // Disable if processing
          />
          <p className="text-xs text-muted-foreground">
            Enter the total amount of ETH you aim to raise.
          </p>
        </div>

        {/* Duration Select */}
        <div className="space-y-2">
          <Label htmlFor="duration">Campaign Duration (Days)</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => handleSelectChange("duration", value)}
            disabled={buttonState.disabled && !isSuccess} // Disable if processing
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Review Section */}
        <Collapsible
          className="border rounded-md overflow-hidden"
          onOpenChange={(open) => setReviewExpanded(open)}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium hover:bg-muted/50 transition-colors">
            {/* ... (Trigger content same as before) ... */}
            <div className="flex items-center gap-2">
              {reviewExpanded ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span>
                {reviewExpanded
                  ? "Campaign Details Reviewed"
                  : "Review Campaign Details"}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                reviewExpanded ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t">
            {/* ... (Review content same as before) ... */}
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-4">Campaign Summary</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Title
                    </h4>
                    <p className="font-medium">
                      {formData.title || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Category
                    </h4>
                    <p className="font-medium">
                      {formData.category
                        ? getCategoryDisplayName(formData.category)
                        : "Not selected"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Funding Goal
                    </h4>
                    <p className="font-medium">
                      {formData.fundingGoal
                        ? `${formData.fundingGoal} ETH`
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Duration
                    </h4>
                    <p className="font-medium">
                      {formData.duration
                        ? `${formData.duration} days`
                        : "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Short Description
                    </h4>
                    <p className="text-sm">
                      {formData.shortDescription || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Timeline
                    </h4>
                    <p className="text-sm">
                      {formData.timeline || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      About You
                    </h4>
                    <p className="text-sm">
                      {formData.aboutYou || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Full Description
                    </h4>
                    <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto text-sm">
                      {formData.fullDescription ? (
                        <div className="prose prose-sm max-w-none">
                          {/* Basic rendering, consider markdown parser */}
                          {formData.fullDescription
                            .split("\n")
                            .map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No description provided
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Campaign Image
                    </h4>
                    {formData.image ? (
                      <div className="border rounded-md overflow-hidden w-full h-32">
                        <img
                          src={(formData.image as string) || "/placeholder.svg"}
                          alt="Campaign preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No image uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Transaction Status/Error Display */}
        {txError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{txError}</AlertDescription>
          </Alert>
        )}
        {isSuccess && (
          <Alert>
            {" "}
            {/* You might need to define a 'success' variant */}
            <Check className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Campaign successfully launched on the blockchain (ID:{" "}
              {createdCampaignId}) and metadata saved!
              {/* Optionally add a link to view the campaign */}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={buttonState.disabled && !isSuccess}
        >
          Back
        </Button>
        <Button
          disabled={buttonState.disabled || !reviewExpanded} // Also disable if review isn't expanded
          onClick={handleLaunchCampaign} // Use the new handler
        >
          {/* Show loader icon when processing */}
          {buttonState.disabled && !isSuccess && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {buttonState.text}
        </Button>
      </CardFooter>
    </Card>
  );
}

// getCategoryDisplayName function remains the same
const getCategoryDisplayName = (category: string) => {
  // ... (same as before) ...
  switch (category) {
    case "tuition":
      return "Tuition";
    case "research":
      return "Research Project";
    case "startup":
      return "Startup";
    case "project":
      return "Personal Project";
    default:
      return category;
  }
};
