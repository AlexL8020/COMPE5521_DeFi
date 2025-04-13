"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Shield, Lock, Coins, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SmartContractsGuide() {
  return (
    <div className="container py-12 max-w-4xl">
      <Link href="/guides" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Guides
      </Link>

      <h1 className="text-4xl font-bold mb-4">Understanding Our Smart Contracts</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Learn how our smart contracts ensure secure and transparent crowdfunding
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Core Components</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <Coins className="h-6 w-6" />,
                title: "Mock Stable Coin (MSC)",
                description: "Our platform's token for contributions",
                features: [
                  "ERC-20 compliant token",
                  "Fixed decimal places (18)",
                  "Used for all campaign transactions",
                  "Minted upon user registration"
                ]
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Crowdfunding Platform",
                description: "Main contract managing campaigns",
                features: [
                  "Campaign creation and management",
                  "Contribution handling",
                  "Fund distribution",
                  "Campaign state tracking"
                ]
              }
            ].map((component, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {component.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{component.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{component.description}</p>
                    <ul className="text-sm text-left space-y-2 w-full">
                      {component.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Campaign Lifecycle</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {[
                  {
                    phase: "Creation",
                    description: "Campaign is initialized with specified parameters",
                    details: [
                      "Set funding goal in MSC",
                      "Define campaign duration",
                      "Generate unique campaign ID",
                      "Store campaign metadata"
                    ]
                  },
                  {
                    phase: "Active Funding",
                    description: "Campaign accepts contributions from supporters",
                    details: [
                      "Track contribution amounts",
                      "Update funding progress",
                      "Monitor campaign deadline",
                      "Accept MSC token transfers"
                    ]
                  },
                  {
                    phase: "Completion",
                    description: "Campaign ends and funds are distributed",
                    details: [
                      "Verify funding goal achievement",
                      "Transfer funds to creator if successful",
                      "Process refunds if unsuccessful",
                      "Update campaign status"
                    ]
                  }
                ].map((phase, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{phase.phase}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {phase.details.map((detail, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Security Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <Lock className="h-6 w-6" />,
                title: "Access Control",
                description: "Strict permission management",
                features: [
                  "Role-based access control",
                  "Function-level permissions",
                  "Campaign owner verification",
                  "Admin-only functions"
                ]
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Fund Security",
                description: "Protected fund management",
                features: [
                  "Escrow-like fund holding",
                  "Automatic fund distribution",
                  "Refund mechanisms",
                  "Transaction validation"
                ]
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Time Controls",
                description: "Timeline enforcement",
                features: [
                  "Campaign duration limits",
                  "Deadline enforcement",
                  "Grace period handling",
                  "Time-based state changes"
                ]
              },
              {
                icon: <AlertCircle className="h-6 w-6" />,
                title: "Error Handling",
                description: "Robust error management",
                features: [
                  "Input validation",
                  "State verification",
                  "Balance checks",
                  "Revert conditions"
                ]
              }
            ].map((feature, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
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
          <h2 className="text-2xl font-semibold mb-4">Important Notes</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    title: "Immutability",
                    description: "Once deployed, smart contract code cannot be modified. All transactions are permanent and transparent on the blockchain."
                  },

                  {
                    title: "Transaction Finality",
                    description: "All transactions are final and cannot be reversed. Double-check all details before confirming transactions."
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
      </div>
    </div>
  );
}