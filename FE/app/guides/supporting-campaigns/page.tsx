"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Wallet, Search, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SupportingCampaignsGuide() {
  return (
    <div className="container py-12 max-w-4xl">
      <Link href="/guides" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Guides
      </Link>

      <h1 className="text-4xl font-bold mb-4">Supporting Campaigns</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Learn how to contribute to educational campaigns using MSC tokens
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Before You Contribute</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    icon: <Wallet className="h-6 w-6" />,
                    title: "Set Up Your Wallet",
                    description: "Ensure your MetaMask wallet is properly configured and has MSC tokens",
                    link: "/guides/wallet-setup"
                  },
                  {
                    icon: <Search className="h-6 w-6" />,
                    title: "Research Campaigns",
                    description: "Review campaign details, goals, and creator background carefully",
                    link: "/campaigns"
                  },
                  {
                    icon: <Heart className="h-6 w-6" />,
                    title: "Understand Smart Contracts",
                    description: "Learn how our smart contracts protect contributors",
                    link: "/guides/smart-contracts"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground mb-2">{item.description}</p>
                      <Link href={item.link}>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Learn more
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How to Contribute</h2>
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Contribution Process</CardTitle>
              <CardDescription>Follow these steps to support a campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {[
                  {
                    title: "Connect Your Wallet",
                    description: "Click 'Connect Wallet' and select MetaMask",
                    details: [
                      "Ensure you're on Hardhat Localhost network",
                      "Verify you have sufficient MSC tokens",
                      "Approve the connection request"
                    ]
                  },
                  {
                    title: "Select Campaign",
                    description: "Browse and select a campaign to support",
                    details: [
                      "Review campaign details thoroughly",
                      "Check funding progress and goals",
                      "Verify campaign timeline"
                    ]
                  },
                  {
                    title: "Enter Contribution Amount",
                    description: "Specify how many MSC tokens to contribute",
                    details: [
                      "Enter your desired contribution amount",
                      "Review the transaction details",
                      "Ensure you have sufficient balance"
                    ]
                  },
                  {
                    title: "Approve Transaction",
                    description: "Confirm the transaction in MetaMask",
                    details: [
                      "Review gas fees and total amount",
                      "Confirm the transaction",
                      "Wait for transaction confirmation"
                    ]
                  }
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground mb-2">{step.description}</p>
                      <ul className="space-y-1">
                        {step.details.map((detail, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Understanding Contributions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>How Funds Are Managed</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Contributions are held in smart contracts",
                    "Funds are released upon reaching goals",
                    "Automatic refunds if goals aren't met",
                    "Transparent transaction history"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contributor Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Support educational initiatives",
                    "Track campaign progress",
                    "Receive campaign updates",
                    "Join supporter community"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Important Notes</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    title: "Transaction Security",
                    description: "All contributions are secured by smart contracts and cannot be altered once confirmed"
                  },
                  {
                    title: "Campaign Verification",
                    description: "While we encourage due diligence, contributors are responsible for evaluating campaigns"
                  },
                  {
                    title: "Refund Policy",
                    description: "Contributions are automatically refunded if the campaign doesn't reach its goal"
                  }
                ].map((note, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">{note.title}</h3>
                      <p className="text-muted-foreground">{note.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="text-center pt-8">
          <Link href="/campaigns">
            <Button size="lg">
              Browse Campaigns
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}