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
import {
  AlertCircle,
  Upload,
  Info,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useWalletAuth } from "../../../hooks/useWalletAuth";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ethers, Interface, Log } from "ethers";
import {
  useSaveCampaignMetadata,
  SaveCampaignMetadataPayload,
} from "@/query/useSaveCampaignMetadata"; // Ensure path is correct
import clsx from "clsx";
import CrowdfundingPlatformAbi from "@/lib/contracts/abis/CrowdfundingPlatform.json"; // Ensure path is correct
import { set } from "react-hook-form";

// --- Contract Configuration ---
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
  fundingGoal: string;
  duration: string;
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
  const { address: creatorWallet, isConnected } = useAccount();

  // --- Wagmi Hooks ---
  const {
    data: writeContractHash,
    writeContract,
    isPending: isWriteContractLoading, // Renamed from isPending for clarity
    error: writeContractError,
    reset: resetWriteContract, // Function to reset writeContract state
  } = useWriteContract();

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: txReceiptError,
  } = useWaitForTransactionReceipt({
    hash: writeContractHash,
    confirmations: 1,
  });

  // --- Metadata Hook ---
  const {
    mutate: saveMetadataMutate,
    isPending: isSavingMetadata, // Renamed from isLoading
    isSuccess: isMetadataSaved,
    error: saveMetadataError,
    reset: resetSaveMetadata, // Function to reset metadata save state
  } = useSaveCampaignMetadata();

  // --- Step Navigation ---
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // --- Form Input Handlers (Unchanged) ---
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
          alert("File too large. Max size: 1MB."); return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select an image file."); e.target.value = "";
      }
    }
  };

  // --- Reset Function ---
  const resetProcess = () => {
    console.log("Resetting process...");
    setTxError(null);
    setCreatedCampaignId(null);
    resetWriteContract(); // Reset wagmi write hook state
    resetSaveMetadata(); // Reset react-query mutation state
    // Optionally reset form data:
    // setFormData({ title: "", ... });
    // Optionally navigate back to step 1:
    // setCurrentStep(1);
  };
  useEffect(() => {
    console.log("---------------- simple log -----------------")

    console.log("-----------------useWaitForTransactionReceipt: txReceipt ", txReceipt)
    console.log("-----------------useWaitForTransactionReceipt: isConfirming", isConfirming)

    console.log("-----------------useWaitForTransactionReceipt: isConfirmed", isConfirmed)

    console.log("-----------------useWaitForTransactionReceipt: txReceiptError", txReceiptError)

    console.log("---------------- simple log -----------------")





  }, [
    txReceipt,
    isConfirming,
    isConfirmed,
    txReceiptError,
  ])

  // --- Handle Blockchain Transaction Submission ---
  const handleLaunchCampaign = () => { // Removed async as writeContract is used with callbacks/hooks
    console.log("Attempting handleLaunchCampaign...");
    resetProcess(); // Reset state before starting a new attempt

    if (!isConnected || !creatorWallet) {
      alert("Please connect your wallet first."); return;
    }
    if (!contractAddress) {
      alert("Contract address is not configured.");
      console.error("NEXT_PUBLIC_CROWDFUNDING_PLATFORM_ADDRESS is not set"); return;
    }

    try {
      const goalValue = parseFloat(formData.fundingGoal);
      const durationValue = parseInt(formData.duration, 10);
      if (isNaN(goalValue) || goalValue <= 0) {
        setTxError("Invalid funding goal."); return;
      }
      if (isNaN(durationValue) || durationValue <= 0) {
        setTxError("Invalid duration."); return;
      }
      const goalInWei = ethers.parseUnits(formData.fundingGoal, 18);

      console.log("Calling writeContract...");
      writeContract({ // Call wagmi hook
        address: contractAddress,
        abi: contractABI,
        functionName: "createCampaign",
        args: [goalInWei, BigInt(durationValue)],
      }, { // Add callbacks for immediate feedback/debugging
        onSuccess: (hash) => {
          console.log("✅ writeContract Success! Tx Hash:", hash);
          // State update (isWriteContractLoading -> false, writeContractHash -> hash) handled by wagmi
        },
        onError: (error) => {
          console.error("❌ writeContract Error:", error);
          // Extract a cleaner message if possible
          const message = (error as any)?.shortMessage ?? error.message;
          setTxError(`Transaction Submission Failed: ${message.split('(')[0]}`);
        },
        onSettled: (data, error) => {
          // Runs after onSuccess or onError
          console.log("ℹ️ writeContract Settled. Hash:", data, "Error:", error);
        },
      });
    } catch (err: any) { // Catch synchronous errors during preparation
      console.error("❌ Error preparing transaction:", err);
      setTxError(`Preparation Failed: ${err.message}`);
    }
  };

  // --- Effect for Logging Hash ---

  const [countAfterTransHashReceived, setCountAfterTransHashReceived] = useState(0)

  const countLimit = 3
  useEffect(() => {
    if (writeContractHash) {
      console.log("ℹ️ Transaction Hash Received:", writeContractHash);
      console.log("⏳ Waiting for confirmation...");

      // Create a timer that increments the count every second until it reaches 5
      const timer = setInterval(() => {
        setCountAfterTransHashReceived(prevCount => {
          const nextCount = prevCount + 1;
          console.log("ℹ️ Transaction Hash Received after second: ", nextCount);

          // Clear the interval when count reaches 5
          if (nextCount >= countLimit) {
            clearInterval(timer);
          }
          return nextCount < countLimit ? nextCount : countLimit;
        });
      }, 1000);

      // Clean up the timer when component unmounts or when hash changes
      return () => clearInterval(timer);
    } else {
      // Reset counter when hash is cleared/changed
      setCountAfterTransHashReceived(0);
    }
  }, [writeContractHash]);

  // --- Effect to Handle Post-Transaction Confirmation & Metadata Save ---
  useEffect(() => {
    // Only proceed if confirmed, receipt exists, and metadata hasn't already been saved
    if (isConfirmed && txReceipt && !isMetadataSaved && !isSavingMetadata) {
      console.log("✅ Transaction Confirmed. Receipt:", txReceipt);
      setTxError(null);

      let foundCampaignId: number | null = null;
      const iFace = new Interface(contractABI);
      console.log("ℹ️ Parsing logs...");
      try {
        for (const log of txReceipt.logs as unknown as Log[]) {
          // console.log("--- Checking log:", log); // Verbose log
          if (
            log.topics &&
            log.data &&
            log.address.toLowerCase() === contractAddress?.toLowerCase()
          ) {
            try {
              const parsedLog = iFace.parseLog(log);
              // console.log("--- Parsed log:", parsedLog); // Verbose log
              if (parsedLog && parsedLog.name === "CampaignCreated") {
                foundCampaignId = Number(parsedLog.args[0]);
                console.log("✅ CampaignCreated event FOUND! ID:", foundCampaignId);
                break;
              }
            } catch (parseError: any) {
              console.warn("--- Log parsing error (ignoring):", parseError.message);
            }
          }
        }
      } catch (outerError: any) {
        console.error("❌ CRITICAL ERROR during log processing:", outerError);
        setTxError("Failed to process transaction logs.");
        return;
      }

      console.log("ℹ️ Log parsing finished. Found Campaign ID:", foundCampaignId);

      if (foundCampaignId !== null && creatorWallet) {
        setCreatedCampaignId(foundCampaignId);
        const metadataPayload: SaveCampaignMetadataPayload = {
          campaignId: foundCampaignId,
          title: formData.title, category: formData.category,
          shortDescription: formData.shortDescription, image: formData.image,
          fullDescription: formData.fullDescription, timeline: formData.timeline,
          aboutYou: formData.aboutYou, fundingGoal: formData.fundingGoal,
          duration: formData.duration, creatorWallet: creatorWallet,
        };
        console.log("⏳ Calling saveMetadataMutate...");
        saveMetadataMutate(metadataPayload, { // Add callbacks here too
          onSuccess: (data) => console.log("✅ Metadata Save Success:", data),
          onError: (error) => console.error("❌ Metadata Save Error:", error), // Error already handled by useEffect below
        });
      } else if (!creatorWallet) {
        console.error("❌ Creator wallet missing after confirmation.");
        setTxError("Wallet address missing after confirmation.");
      } else {
        console.error("❌ CampaignCreated event NOT FOUND in logs.");
        setTxError("Campaign created, but failed to retrieve Campaign ID from logs.");
      }
    }
  }, [isConfirmed, txReceipt, contractABI, creatorWallet, formData, saveMetadataMutate, isMetadataSaved, isSavingMetadata]); // Added metadata states to dependencies


  // --- Effect to Handle Hook Errors ---
  useEffect(() => {
    // Prioritize showing errors from later stages
    let displayedError: string | null = null;
    if (saveMetadataError) {
      console.error("❌ Metadata Save Error Hook:", saveMetadataError);
      displayedError = `Metadata Save Failed: ${saveMetadataError.response?.data?.message || saveMetadataError.message}`;
    } else if (txReceiptError) {
      console.error("❌ Transaction Receipt Error Hook:", txReceiptError);
      displayedError = `Transaction Failed: ${txReceiptError.message.split('(')[0]}`;
    } else if (writeContractError) {
      // This error might be superseded by txReceiptError if the tx fails later
      // Only show if no later error occurred
      if (!txReceiptError) {
        console.error("❌ Write Contract Error Hook:", writeContractError);
        displayedError = `Blockchain Error: ${writeContractError.message.split('(')[0]}`;
      }
    }
    // Only update state if the error message is different or clearing an old error
    if (displayedError !== txError) {
      setTxError(displayedError);
    }
  }, [writeContractError, txReceiptError, saveMetadataError, txError]); // Added txError dependency


  // --- Determine Button State ---
  const getButtonState = () => {
    // Check overall success first
    if (isConfirmed && isMetadataSaved) return { text: "Campaign Launched!", disabled: true };
    // Check loading states
    if (isWriteContractLoading) return { text: "Check Wallet...", disabled: true };
    if (isConfirming) return { text: "Confirming Tx...", disabled: true };
    if (isSavingMetadata) return { text: "Saving Data...", disabled: true };
    // Check connection
    if (!isConnected) return { text: "Connect Wallet", disabled: true };
    // Check if required fields for the final step are filled
    const areFieldsFilled = formData.fundingGoal !== "" && formData.duration !== "";
    if (!areFieldsFilled) return { text: "Fill Funding Details", disabled: true };
    // Check if review is expanded (assuming reviewExpanded state exists in FundingAndReviewStep)
    // if (!reviewExpanded) return { text: "Review Before Launching", disabled: true };

    // Default state: ready to launch if fields are filled and review done
    return { text: "Launch Campaign", disabled: false };
  };
  const buttonState = getButtonState();

  // --- Component Render ---
  return (
    <div className="container py-8 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Your Campaign</h1>
          <p className="text-muted-foreground mb-8">
            Share your educational goals with potential backers
          </p>
        </div>
        {/* <ThemeToggle /> */}
      </div>

      {/* Step Bar */}
      <StepBar currentStep={currentStep} />

      {/* Conditional Step Rendering */}
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
          countAfterTransHashReceived={countAfterTransHashReceived}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleLaunchCampaign={handleLaunchCampaign}
          buttonState={buttonState}
          txError={txError}
          // Pass combined success state
          isSuccess={isConfirmed && isMetadataSaved}
          createdCampaignId={createdCampaignId}
          prevStep={prevStep}
        />
      )}

      {/* Optional: Button to reset the process if something went wrong */}
      {(txError || (isConfirmed && !isMetadataSaved && !isSavingMetadata)) && (
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={resetProcess}>Try Again</Button>
        </div>
      )}
    </div>
  );
}

// --- Step Components (Keep BasicInfoStep, CampaignDetailsStep as before) ---
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
            className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step
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


// FundingAndReviewStep component (mostly unchanged, props updated)
type FundingAndReviewStepProps = {
  formData: CampaignFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (id: string, value: string) => void;
  handleLaunchCampaign: () => void;
  buttonState: { text: string; disabled: boolean };
  txError: string | null;
  isSuccess: boolean;
  createdCampaignId: number | null;
  prevStep: () => void;
  countAfterTransHashReceived: number;
};

function FundingAndReviewStep({
  formData,
  handleInputChange,
  handleSelectChange,
  handleLaunchCampaign,
  buttonState,
  txError,
  isSuccess,
  createdCampaignId,
  prevStep,
  countAfterTransHashReceived
}: FundingAndReviewStepProps) {
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const [isAfterExpandDelay, setIsAfterExpandDelay] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (reviewExpanded) {
      // Reset countdown and isAfterExpandDelay when review is expanded
      setCountdown(3);
      setIsAfterExpandDelay(false);

      // Set up countdown interval
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Set up timer for enabling button after 5 seconds
      timer = setTimeout(() => {
        setIsAfterExpandDelay(true);
      }, 5000);
    } else {
      // Reset when collapsed
      setIsAfterExpandDelay(false);
      setCountdown(5);
    }

    // Cleanup function
    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [reviewExpanded]);

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
            blockchain. Funds will be managed by the smart contract using MSC tokens.
          </AlertDescription>
        </Alert>

        {/* Funding Goal Input */}
        <div className="space-y-2">
          <Label htmlFor="fundingGoal">Funding Goal (MSC)</Label>
          <Input
            id="fundingGoal"
            type="number"
            placeholder="e.g., 500" // Example in MSC
            min="1" // Adjust min goal if needed (in MSC)
            step="1" // Adjust step (in MSC)
            value={formData.fundingGoal}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            Enter the total amount of MSC tokens you aim to raise.
          </p>
        </div>

        {/* Duration Select */}
        <div className="space-y-2">
          <Label htmlFor="duration">Campaign Duration (Days)</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => handleSelectChange("duration", value)}
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
              className={`h-4 w-4 transition-transform ${reviewExpanded ? "rotate-180" : ""
                }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t">
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-4">Campaign Summary</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* ... Title, Category ... */}
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
                        ? `${formData.fundingGoal} MSC` // Display MSC
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
                  {/* ... Descriptions, Image ... */}
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
          <Alert> {/* Ensure you have a success variant */}
            <Check className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Campaign successfully launched on the blockchain (ID:{" "}
              {createdCampaignId}) and metadata saved!
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
        <div className="flex items-center gap-2">
          {reviewExpanded && !isAfterExpandDelay && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Please review for {countdown}s</span>
            </div>
          )}
          <Button
            disabled={buttonState.disabled || !reviewExpanded || !isAfterExpandDelay}
            onClick={handleLaunchCampaign}
          >
            {buttonState.disabled && !isSuccess && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {buttonState.text}
            {countAfterTransHashReceived > 0 && `(${countAfterTransHashReceived})`}

          </Button>
        </div>
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
