"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Upload, Info, Check, ChevronDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { API_CONFIG } from "../../API"; // Adjust path as needed

import { useWalletAuth } from "../../../hooks/useWalletAuth";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { form } from "viem/chains";
import {
  CreateCampaignPayload,
  useCreateCampaign,
} from "@/query/useForCampaigns";
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
export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { connectWallet, disconnectWallet, loading } = useWalletAuth();
  const { data: session } = useSession();
  const creatorWallet = session?.user?.address;
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    category: "",
    shortDescription: "",
    image: null as string | null,
    fullDescription: "",
    timeline: "",
    aboutYou: "",
    fundingGoal: "",
    duration: "",
    //creatorWallet: session?.user?.address,
  });

  const {
    mutateAsync: createCampaignAsync,
    isError,
    isSuccess,
    error,
  } = useCreateCampaign();

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

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
    const file = e.target.files?.[0]; // Get the first selected file
    if (file) {
      if (file.type.startsWith("image/")) {
        // File is an image, process it
        if (file.size > 1 * 1024 * 1024) {
          alert("File too large. Max size: 1MB.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64image = reader.result as string;
          setFormData((prev) => ({ ...prev, image: base64image }));
          reader.result
            ? console.log("--- get the image ---")
            : console.log("no image found");
        };
        reader.readAsDataURL(file);
      } else {
        // File is not an image, notify user and reset input
        alert("Please select an image file.");
        e.target.value = ""; // Clear the input so they can try again
      }
    }
  };

  // Form submission handler
  const handleSubmit = async () => {
    if (!creatorWallet) {
      console.error("Creator wallet address is missing.");
      return;
    }

    // Construct the payload - directly use string values from formData
    const campaignPayload: CreateCampaignPayload = {
      title: formData.title,
      category: formData.category,
      shortDescription: formData.shortDescription,
      // Handle potential null image - send null or a default/empty string if API requires string
      image: formData.image || null, // Or: formData.image || "default-image-url" if API needs a string
      fullDescription: formData.fullDescription,
      timeline: formData.timeline,
      aboutYou: formData.aboutYou,
      fundingGoal: formData.fundingGoal, // Keep as string
      duration: formData.duration, // Keep as string
      creatorWallet,
    };

    console.log("Submitting JSON:", campaignPayload);
    console.log(creatorWallet);
    console.log(
      "Submitting campaign payload via useMutation:",
      campaignPayload
    );
    createCampaignAsync(campaignPayload)
      .then((response) => {
        console.log("Campaign created successfully:", response);
        // Handle success (e.g., redirect, show success message)
      })
      .catch((error) => {
        console.error("Error creating campaign:", error);
        // Handle error (e.g., show error message)
      });
  };

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
          handleSubmit={handleSubmit}
          prevStep={prevStep}
        />
      )}
    </div>
  );
}

const StepBar = ({ currentStep }: { currentStep: number }) => {
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
          {/* <Tabs defaultValue="write">
            <TabsList className="mb-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                id="fullDescription"
                placeholder="Tell your story. Why are you raising funds? What will you use them for? How will backers benefit?"
                className="min-h-[200px] resize-none"
                value={formData.fullDescription}
                onChange={handleInputChange}
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="border rounded-md p-4 min-h-[200px] prose prose-sm max-w-none">
                <p>Preview of your formatted description will appear here.</p>
              </div>
            </TabsContent>
          </Tabs> */}
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

type FundingAndReviewStepProps = {
  formData: CampaignFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (id: string, value: string) => void;
  handleSubmit: () => void;
  prevStep: () => void;
};

function FundingAndReviewStep({
  formData,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
  prevStep,
}: FundingAndReviewStepProps) {
  // State to track if review has been expanded
  const areFieldsAtThisStepFilled =
    formData.fundingGoal !== "" && formData.duration !== "";
  formData.fundingGoal !== "" && formData.duration !== "";
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
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Your wallet must be connected to create a campaign. All funds will
            be received directly to your wallet.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="fundingGoal">Funding Goal (ETH)</Label>
          <Input
            id="fundingGoal"
            type="number"
            placeholder="5.0"
            min="0.1"
            step="0.1"
            value={formData.fundingGoal}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            Set a realistic goal based on your needs. You'll receive all funds
            raised, even if you don't reach your goal.
          </p>
        </div>

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

        <div className="border rounded-md p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Campaign Review</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Before launching, please review all details of your campaign. Once
            published, you can make minor edits, but major changes will require
            approval.
          </p>
        </div>
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
              className={`h-4 w-4 transition-transform ${
                reviewExpanded ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t">
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
                          <p>{formData.fullDescription}</p>
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button
          disabled={!reviewExpanded || !areFieldsAtThisStepFilled}
          onClick={handleSubmit}
        >
          {reviewExpanded
            ? areFieldsAtThisStepFilled
              ? "Launch Campaign"
              : "Please fill all the fields"
            : "Review Before Submitting"}
        </Button>
      </CardFooter>
    </Card>
  );
}

const getCategoryDisplayName = (category: string) => {
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
