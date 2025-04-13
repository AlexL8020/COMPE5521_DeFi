"use client"; // Add this at the top

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from 'react';
import { API_CONFIG } from '../API'; // Your API config file
import { useGetMergedCampaigns } from "@/query/useForCampaigns";

export default function CampaignsPage() {
  const { data: campaigns, isLoading } = useGetMergedCampaigns()


  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Campaigns</h1>
          <p className="text-muted-foreground">
            Discover student campaigns from around the world !
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tuition">Tuition</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>





      {isLoading ? (
        <p className="text-center">Loading campaigns...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign) => {
            // Convert progress and fundingGoal to numbers
            const progress = isNaN(Number(campaign.amountRaised)) ? 0 : Number(campaign.amountRaised);
            const fundingGoal = isNaN(Number(campaign.blockchainGoal)) ? 1 : Number(campaign.blockchainGoal);

            // Calculate progress percentage
            const progressPercentage = fundingGoal > 0
              ? Math.round((progress / fundingGoal) * 100)
              : 0; // Cap at 100% and handle division by zero

            return (
              <
                Link href={`/campaigns/${campaign.frontendTrackerId}`} key={campaign._id as any} className="group">
                <div className="rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src={campaign.imageUrl} // Base64 string from MongoDB
                      alt={campaign.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {campaign.description}
                    </p>
                    <div className="space-y-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${progressPercentage}%` }} // Real progress
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          {progress.toFixed(2)} MSC raised
                        </span>
                        <span className="text-muted-foreground">
                          {progressPercentage.toFixed(0)}% of {fundingGoal} MSC
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}





    </div>
  );
}
