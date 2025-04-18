"use client"; // Add this at the top

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Globe, Lightbulb } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import WalletLogin from "@/components/WalletLogin";
import { useState, useEffect } from "react";
import { API_CONFIG } from "./API"; // Your API config file
import { useGetMergedCampaigns } from "@/query/useForCampaigns";

export default function Home() {
  const { data: campaigns, isLoading: loading } = useGetMergedCampaigns()

  // Empty dependency array to run once on mount

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted">
          <div className="container max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Fund Your Education with Crypto
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Create crowdfunding campaigns for tuition, projects, or startups
              and receive support from global backers in cryptocurrency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/campaigns/create">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Campaign
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border-2 bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a Campaign</h3>
              <p className="text-muted-foreground">
                Share your educational goals, projects, or startup ideas with
                the community.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border-2 bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Receive Global Support
              </h3>
              <p className="text-muted-foreground">
                Connect with backers worldwide who believe in your potential and
                vision.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border-2 bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Achieve Your Goals</h3>
              <p className="text-muted-foreground">
                Use the funds to pay for tuition, build your project, or launch
                your startup.
              </p>
            </div>
          </div>
        </section>

        {/* <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Campaigns
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Link href={`/campaigns/${i}`} key={i} className="group">
                  <div className="rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-video relative bg-muted">
                      <img
                        src={`/placeholder.svg?height=225&width=400&text=Campaign+${i}`}
                        alt={`Campaign ${i}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                        {i === 1
                          ? "Computer Science Degree Funding"
                          : i === 2
                          ? "Renewable Energy Research Project"
                          : "Student-Led Fintech Startup"}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {i === 1
                          ? "Help me complete my CS degree and build open-source tools for education."
                          : i === 2
                          ? "Supporting research into affordable solar solutions for developing regions."
                          : "Building a platform to help students manage finances and build credit."}
                      </p>
                      <div className="space-y-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: i === 1 ? "75%" : i === 2 ? "45%" : "60%",
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            {i === 1
                              ? "3.75 MSC"
                              : i === 2
                              ? "2.25 MSC"
                              : "3 MSC"}{" "}
                            raised
                          </span>
                          <span className="text-muted-foreground">
                            {i === 1 ? "75%" : i === 2 ? "45%" : "60%"} of{" "}
                            {i === 1 ? "5 MSC" : "5 MSC"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/campaigns">
                <Button variant="outline" className="gap-2">
                  View All Campaigns <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section> */}

        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Campaigns
            </h2>
            {loading ? (
              <p className="text-center">Loading campaigns...</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns?.length === 0 ? (
                  //  messages to users if no campaigns are found
                  <p className="text-center col-span-full">
                    No campaigns found. Please check back later.
                  </p>
                ) : (
                  campaigns?.filter((_, i) => i < 3).map((campaign, i) => {
                    // Convert progress and fundingGoal to numbers
                    const progress = Number(campaign.amountRaised);
                    const fundingGoal = Number(campaign.blockchainGoal);



                    // Calculate progress percentage
                    const progressPercentage =
                      fundingGoal > 0
                        ? Math.round((progress / fundingGoal) * 100)
                        : 0; // Cap at 100% and handle division by zero

                    return (
                      <Link
                        href={`/campaigns/${campaign.frontendTrackerId}`}
                        key={campaign.frontendTrackerId}
                        className="group"
                      >
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
                                  {progressPercentage.toFixed(0)}% of{" "}
                                  {fundingGoal} MSC
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="border-t mt-auto">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold mb-4"
              >
                <GraduationCap className="h-6 w-6" />
                <span>Defi-CrowdFund</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Empowering students through decentralized crowdfunding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/campaigns"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Browse Campaigns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/campaignstest"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Browse Campaigns Test
                  </Link>
                </li>

                <li>
                  <Link
                    href="/campaigns/create"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Start a Campaign
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/faq"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} StudentFund. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
