"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, TrendingUp, MessageCircle, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManagingCampaignGuide() {
  return (
    <div className="container py-12 max-w-4xl">
      <Link href="/guides" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Guides
      </Link>

      <h1 className="text-4xl font-bold mb-4">Managing Your Campaign</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Learn how to effectively manage and promote your crowdfunding campaign
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Responsibilities</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Track Progress",
                description: "Monitor funding progress and milestone achievements",
              },
              {
                icon: <MessageCircle className="h-6 w-6" />,
                title: "Communication",
                description: "Maintain regular updates and respond to supporters",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Community",
                description: "Build and engage with your supporter community",
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Campaign Management Checklist</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    title: "Daily Tasks",
                    items: [
                      "Check campaign statistics",
                      "Respond to supporter messages",
                      "Share campaign on social media",
                      "Monitor funding progress",
                    ],
                  },
                  {
                    title: "Weekly Tasks",
                    items: [
                      "Post campaign updates",
                      "Engage with community",
                      "Review campaign strategy",
                      "Plan upcoming milestones",
                    ],
                  },
                  {
                    title: "Monthly Tasks",
                    items: [
                      "Analyze campaign performance",
                      "Adjust campaign strategy if needed",
                      "Plan major announcements",
                      "Review and update timeline",
                    ],
                  },
                ].map((section, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="font-semibold">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Promotion Strategies</h2>
          <div className="space-y-4">
            {[
              {
                title: "Social Media Outreach",
                description: "Leverage social platforms to reach potential supporters",
                tips: [
                  "Create engaging content about your campaign",
                  "Use relevant hashtags",
                  "Share regular updates",
                  "Engage with comments and messages",
                ],
              },
              {
                title: "Community Building",
                description: "Build a strong community around your campaign",
                tips: [
                  "Host virtual meet-ups",
                  "Create exclusive content for supporters",
                  "Recognize and thank contributors",
                  "Share behind-the-scenes updates",
                ],
              },
              {
                title: "Network Expansion",
                description: "Expand your reach through various channels",
                tips: [
                  "Reach out to relevant organizations",
                  "Connect with industry influencers",
                  "Participate in related events",
                  "Collaborate with other campaigns",
                ],
              },
            ].map((strategy, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{strategy.title}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {strategy.tips.map((tip, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {tip}
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
                {[
                  {
                    title: "Maintain Transparency",
                    description: "Keep supporters informed about progress and use of funds",
                  },
                  {
                    title: "Stay Consistent",
                    description: "Maintain regular communication and campaign activities",
                  },
                  {
                    title: "Be Responsive",
                    description: "Address questions and concerns promptly",
                  },
                  {
                    title: "Show Appreciation",
                    description: "Regularly thank and acknowledge your supporters",
                  },
                ].map((practice, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">{practice.title}</h3>
                      <p className="text-muted-foreground">{practice.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="text-center pt-8">
          <Link href="/dashboard">
            <Button size="lg">
              Go to Campaign Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}