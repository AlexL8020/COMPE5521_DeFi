"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, MessageSquare, BarChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CampaignUpdatesGuide() {
  return (
    <div className="container py-12 max-w-4xl">
      <Link href="/guides" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Guides
      </Link>

      <h1 className="text-4xl font-bold mb-4">Updating Your Campaign</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Keep your supporters informed about your campaign's progress
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Types of Updates</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Progress Updates",
                description: "Share milestones and achievements",
                examples: [
                  "Funding milestones",
                  "Project progress",
                  "Timeline updates",
                  "Goal achievements"
                ]
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Community Updates",
                description: "Engage with your supporters",
                examples: [
                  "Thank you messages",
                  "Q&A responses",
                  "Community feedback",
                  "Future plans"
                ]
              },
              {
                icon: <BarChart className="h-6 w-6" />,
                title: "Impact Updates",
                description: "Demonstrate campaign impact",
                examples: [
                  "Fund utilization",
                  "Project outcomes",
                  "Success stories",
                  "Learning experiences"
                ]
              }
            ].map((type, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {type.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{type.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                    <ul className="text-sm text-left space-y-2">
                      {type.examples.map((example, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {example}
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
          <h2 className="text-2xl font-semibold mb-4">Best Practices for Updates</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    title: "Regular Frequency",
                    description: "Post updates at least once every 1-2 weeks to maintain engagement",
                    tips: [
                      "Set a consistent schedule",
                      "Update after reaching milestones",
                      "Respond to major developments",
                      "Keep supporters informed of delays"
                    ]
                  },
                  {
                    title: "Clear Communication",
                    description: "Ensure your updates are clear, concise, and informative",
                    tips: [
                      "Use simple language",
                      "Include specific details",
                      "Add visuals when possible",
                      "Structure information logically"
                    ]
                  },
                  {
                    title: "Transparency",
                    description: "Be open about both progress and challenges",
                    tips: [
                      "Share honest assessments",
                      "Explain any setbacks",
                      "Detail fund utilization",
                      "Address concerns promptly"
                    ]
                  }
                ].map((practice, i) => (
                  <div key={i} className="pb-4">
                    <h3 className="font-semibold text-lg mb-2">{practice.title}</h3>
                    <p className="text-muted-foreground mb-3">{practice.description}</p>
                    <ul className="space-y-2">
                      {practice.tips.map((tip, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {tip}
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
          <h2 className="text-2xl font-semibold mb-4">Update Writing Guide</h2>
          <Card>
            <CardHeader>
              <CardTitle>Structure Your Updates</CardTitle>
              <CardDescription>Follow this template for effective campaign updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    title: "Introduction",
                    content: "Brief overview of what's new",
                    example: "We've reached 50% of our funding goal and completed our first milestone!"
                  },
                  {
                    title: "Progress Details",
                    content: "Specific achievements and developments",
                    example: "In the past two weeks, we've implemented X feature and completed Y requirement."
                  },
                  {
                    title: "Challenges & Solutions",
                    content: "Any obstacles faced and how they're being addressed",
                    example: "While we encountered some delays in X, we've adjusted our timeline and implemented Y solution."
                  },
                  {
                    title: "Next Steps",
                    content: "Upcoming plans and expectations",
                    example: "Our next milestone involves X, and we expect to complete it by Y date."
                  },
                  {
                    title: "Call to Action",
                    content: "How supporters can help",
                    example: "Share our campaign with your network to help us reach our next milestone!"
                  }
                ].map((section, i) => (
                  <div key={i} className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold mb-1">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{section.content}</p>
                    <p className="text-sm italic">Example: {section.example}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Important Reminders</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    title: "Stay Professional",
                    description: "Maintain a professional tone while being authentic and engaging"
                  },
                  {
                    title: "Be Responsive",
                    description: "Address questions and feedback in your updates when relevant"
                  },
                  {
                    title: "Show Gratitude",
                    description: "Always acknowledge and thank your supporters"
                  },
                  {
                    title: "Keep Records",
                    description: "Document your progress for future reference and accountability"
                  }
                ].map((reminder, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">{reminder.title}</h3>
                      <p className="text-muted-foreground">{reminder.description}</p>
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