"use client";
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Share2, Flag, Heart } from "lucide-react"
import { FundingForm } from "@/components/funding-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { API_CONFIG } from '../../API'; // Your API config file
import { useGetMergedCampaigns } from '@/query/useForCampaigns';
import React from 'react';
import { useUserProfile } from "@/query/useForUser";

export default function CampaignPage({ params }: { params: { id: string } }) {

  const { data, isLoading, error } = useGetMergedCampaigns()
  // Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);

  // Now access properties on the resolved object
  const postId = resolvedParams.id;


  if (isLoading) {
    return <div className="container py-8 text-center">Loading campaign...</div>;
  }

  if (error || !data) {
    return <div className="container py-8 text-center text-red-500">{error?.message || 'Campaign not found'}</div>;
  }

  const targetCampaign = data?.find((campaign) => campaign.frontendTrackerId === postId)
  // Calculate progress percentage
  const goalAmount = parseFloat(targetCampaign?.blockchainGoal || "1") ?? 1
  const raisedAmount = parseFloat(targetCampaign?.amountRaised || "0");

  const progress = raisedAmount / goalAmount * 100
  const fundingGoal = goalAmount
  const percentFunded = fundingGoal > 0 ? Math.min((progress / fundingGoal) * 100, 100) : 0;
  const daysLeft = Math.floor((new Date((targetCampaign?.deadline || 0) * 1000).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // console.log("---------------targetCampaign:", )

  const { data: creator } = useUserProfile(targetCampaign?.mongoCreatorWalletAddress || "")
  return (
    <div className="container py-8">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-6">
            <img
              src={targetCampaign?.imageUrl} // Base64 string from MongoDB
              alt={targetCampaign?.title}
              className="object-cover w-full h-full"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{targetCampaign?.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?text=AJ" />
                <AvatarFallback>{creator?.user?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{creator?.user?.name ?? "--"}</span>
            </div>
            <Badge variant="outline">{targetCampaign?.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{targetCampaign?.metadataCreatedAt as any}</span>
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              {/* <TabsTrigger value="updates">Updates ({targetCampaign?.updates?.length || 0})</TabsTrigger> */}
              {/* <TabsTrigger value="comments">Comments ({targetCampaign?.comments?.length || 0})</TabsTrigger> */}
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <p className="text-muted-foreground">{targetCampaign?.description}</p>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: targetCampaign?.fullDescription || '' }}
              ></div>
            </TabsContent>

            {/* <TabsContent value="updates" className="space-y-6">
              {targetCampaign?.updates?.map((update) => (
                <div key={update.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-1">{update.title}</h3>
                  <div className="text-sm text-muted-foreground mb-2">{update.date}</div>
                  <p>{update.content}</p>
                </div>
              )) || <p>No updates available.</p>}
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              {targetCampaign?.comments?.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{comment.user?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{comment.user}</span>
                    <span className="text-xs text-muted-foreground">{comment.date}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              )) || <p>No comments available.</p>}
            </TabsContent> */}
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-card">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{progress.toFixed(2)} MSC raised</span>
                <span className="text-muted-foreground">of {fundingGoal} MSC goal</span>
              </div>
              <Progress value={percentFunded} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{targetCampaign?.backers || 0}</div>
                <div className="text-xs text-muted-foreground">Backers</div>
              </div> */}
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{daysLeft || 0}</div>
                <div className="text-xs text-muted-foreground">Days Left</div>
              </div>
            </div>

            <FundingForm />

            {/* <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div> */}
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h3 className="font-semibold mb-4">Campaign Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1 bg-primary rounded relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <div>
                  <div className="font-medium">Campaign Started</div>
                  <div className="text-sm text-muted-foreground">{targetCampaign?.metadataCreatedAt as any}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 bg-muted rounded relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-muted"></div>
                </div>
                <div>
                  <div className="font-medium">Funding Deadline</div>
                  <div className="text-sm text-muted-foreground">In {daysLeft || 0} days</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 bg-muted rounded relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-muted"></div>
                </div>
                <div>
                  <div className="font-medium">Project Completion</div>
                  <div className="text-sm text-muted-foreground">
                    Estimated: {targetCampaign?.timeline || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}