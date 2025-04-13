"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreatingCampaignGuide() {
  return (
    <div className="container py-12 max-w-4xl">
      <Link href="/guides" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Guides
      </Link>

      <h1 className="text-4xl font-bold mb-4">Creating Your First Campaign</h1>
      <p className="text-xl text-muted-foreground mb-8">
        A step-by-step guide to launching your educational crowdfunding campaign
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {[
                  "Connected cryptocurrency wallet",
                  "Clear educational goal or project",
                  "Basic details about your funding needs",
                  "Campaign image or visual content",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Step-by-Step Process</h2>
          <div className="space-y-4">
            {[
              {
                title: "1. Prepare Your Campaign",
                content: "Gather all necessary information including your educational background, project details, and funding requirements.",
                items: [
                  "Write a compelling campaign title",
                  "Prepare a detailed description",
                  "Calculate your funding goal",
                  "Create a timeline",
                ],
              },
              {
                title: "2. Create Your Campaign",
                content: "Navigate to the campaign creation page and fill in all required information.",
                items: [
                  "Click 'Start Campaign' in the navigation",
                  "Fill in basic information",
                  "Add campaign details",
                  "Set funding goal and duration",
                ],
              },
              {
                title: "3. Review and Launch",
                content: "Carefully review all information before launching your campaign.",
                items: [
                  "Preview your campaign",
                  "Confirm all details are accurate",
                  "Accept terms and conditions",
                  "Launch your campaign",
                ],
              },
            ].map((step, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.content}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Be Transparent</h3>
                    <p className="text-muted-foreground">
                      Clearly explain how funds will be used and provide regular updates to supporters.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Set Realistic Goals</h3>
                    <p className="text-muted-foreground">
                      Ensure your funding goal matches your actual needs and can be achieved within the campaign duration.
                    </p>
                  </div>
                </div>
    
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="text-center pt-8">
          <Link href="/campaigns/create">
            <Button size="lg">
              Start Creating Your Campaign
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}