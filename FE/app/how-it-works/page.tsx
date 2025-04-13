"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, Wallet, Globe, Heart, ArrowRight, CheckCircle } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">How It Works</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Learn how to create and support educational crowdfunding campaigns using cryptocurrency.
      </p>

      <div className="space-y-12">
        {/* For Campaign Creators */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">For Campaign Creators</h2>
          <div className="grid gap-6">
            {[
              {
                icon: <GraduationCap className="h-6 w-6" />,
                title: "Create Your Campaign",
                description:
                  "Share your educational goals, project details, and funding requirements.",
              },
              {
                icon: <Wallet className="h-6 w-6" />,
                title: "Connect Your Wallet",
                description:
                  "Set up your crypto wallet to receive funds securely through smart contracts.",
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Share & Engage",
                description:
                  "Promote your campaign and engage with supporters worldwide.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 border rounded-lg bg-card hover:shadow-sm transition-shadow"
              >
                <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/campaigns/create">
              <Button size="lg">
                Start Your Campaign
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* For Supporters */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">For Supporters</h2>
          <div className="grid gap-6">
            {[
              {
                icon: <Heart className="h-6 w-6" />,
                title: "Find Campaigns",
                description:
                  "Browse through verified educational campaigns that resonate with you.",
              },
              {
                icon: <Wallet className="h-6 w-6" />,
                title: "Connect & Contribute",
                description:
                  "Use your crypto wallet to support campaigns securely.",
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                title: "Track Impact",
                description:
                  "Follow the progress of campaigns you've supported and see your impact.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 border rounded-lg bg-card hover:shadow-sm transition-shadow"
              >
                <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/campaigns">
              <Button size="lg" variant="outline">
                Browse Campaigns
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}