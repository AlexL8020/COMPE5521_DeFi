"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Upload, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Your Campaign</h1>
          <p className="text-muted-foreground mb-8">Share your educational goals with potential backers</p>
        </div>
        <ThemeToggle />
      </div>

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
        <div className="flex justify-between mt-2 text-sm">
          <div className={currentStep >= 1 ? "text-foreground font-medium" : "text-muted-foreground"}>Basic Info</div>
          <div className={currentStep >= 2 ? "text-foreground font-medium" : "text-muted-foreground"}>
            Campaign Details
          </div>
          <div className={currentStep >= 3 ? "text-foreground font-medium" : "text-muted-foreground"}>
            Funding & Review
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell us about your campaign and yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input id="title" placeholder="Enter a clear, specific title for your campaign" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
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
              <Label htmlFor="short-description">Short Description</Label>
              <Textarea
                id="short-description"
                placeholder="Provide a brief summary of your campaign (150 characters max)"
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Campaign Image</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">Drag and drop an image, or click to browse</p>
                <p className="text-xs text-muted-foreground">Recommended size: 1200 x 675 pixels</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={nextStep}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Share your story and educational goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-description">Full Description</Label>
              <Tabs defaultValue="write">
                <TabsList className="mb-2">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <Textarea
                    id="full-description"
                    placeholder="Tell your story. Why are you raising funds? What will you use them for? How will backers benefit?"
                    className="min-h-[200px] resize-none"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="border rounded-md p-4 min-h-[200px] prose prose-sm max-w-none">
                    <p>Preview of your formatted description will appear here.</p>
                  </div>
                </TabsContent>
              </Tabs>
              <p className="text-xs text-muted-foreground">
                You can use markdown for formatting. Add images, lists, and more to make your story compelling.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Textarea
                id="timeline"
                placeholder="Outline your educational or project timeline. When will you start? When do you expect to complete your goals?"
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-you">About You</Label>
              <Textarea
                id="about-you"
                placeholder="Tell potential backers about yourself, your background, and why you're passionate about this educational goal."
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Funding & Review</CardTitle>
            <CardDescription>Set your funding goal and review your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Your wallet must be connected to create a campaign. All funds will be received directly to your wallet.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="funding-goal">Funding Goal (ETH)</Label>
              <Input id="funding-goal" type="number" placeholder="5.0" min="0.1" step="0.1" />
              <p className="text-xs text-muted-foreground">
                Set a realistic goal based on your needs. You'll receive all funds raised, even if you don't reach your
                goal.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Campaign Duration (Days)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="45">45 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Campaign Review</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Before launching, please review all details of your campaign. Once published, you can make minor edits,
                but major changes will require approval.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button>Launch Campaign</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

