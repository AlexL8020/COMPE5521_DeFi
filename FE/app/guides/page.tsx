"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, ArrowRight, GraduationCap, Shield, Coins, RefreshCw } from "lucide-react";

export default function GuidesPage() {
  const guides = [
    {
      title: "Getting Started",
      icon: <GraduationCap className="h-6 w-6" />,
      articles: [
        {
          title: "Creating Your First Campaign",
          description: "Learn how to set up and launch your crowdfunding campaign.",
          link: "/guides/creating-campaign",
        },
        {
          title: "Setting Up Your Wallet",
          description: "Guide to connecting and managing your crypto wallet.",
          link: "/guides/wallet-setup",
        },
      ],
    },

    {
      title: "Contributing",
      icon: <Coins className="h-6 w-6" />,
      articles: [
        {
          title: "How to Support Campaigns",
          description: "Step-by-step guide to contributing to campaigns.",
          link: "/guides/supporting-campaigns",
        },
        {
          title: "Understanding Smart Contracts",
          description: "Learn about the security and transparency of our platform.",
          link: "/guides/smart-contracts",
        },
      ],
    },
  ];

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Platform Guides</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Comprehensive guides to help you make the most of StudentFund.
      </p>

      <div className="space-y-8">
        {guides.map((section, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {section.articles.map((article, j) => (
                  <div
                    key={j}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {article.description}
                    </p>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={article.link}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}