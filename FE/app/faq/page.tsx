"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Defi-CrowdFund?",
      answer:
        "Defi-CrowdFund is a decentralized crowdfunding platform specifically designed for educational purposes. It allows students and educators to raise funds for tuition, research projects, and educational initiatives using cryptocurrency.",
    },
    {
      question: "How do I create a campaign?",
      answer:
        "To create a campaign, you'll need to connect your cryptocurrency wallet, provide details about your educational goals, set a funding target, and submit your campaign for review. Our platform guides you through each step of the process.",
    },
    {
      question: "What cryptocurrencies are supported?",
      answer:
        "Currently, we support MSC tokens for all campaigns and contributions. This ensures a standardized and secure funding process for all users.",
    },
    {
      question: "How are funds managed?",
      answer:
        "All funds are managed through smart contracts on the blockchain, ensuring transparency and security. Campaign creators can only access funds once their campaign reaches its goal and the funding period ends.",
    },
    {
      question: "What happens if a campaign doesn't reach its goal?",
      answer:
        "If a campaign doesn't reach its funding goal by the deadline, all contributions are automatically returned to the supporters through the smart contract.",
    },
    {
      question: "How do I support a campaign?",
      answer:
        "To support a campaign, connect your wallet, browse available campaigns, and contribute any amount of MSC tokens to the campaigns you wish to support.",
    },
  ];

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Find answers to common questions about using Defi-CrowdFund.
      </p>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}