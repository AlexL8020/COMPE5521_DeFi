"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Last updated: April 13, 2025
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Defi-CrowdFund, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Platform Usage</h2>
          <p className="mb-4">
            Defi-CrowdFund is a decentralized crowdfunding platform specifically designed for educational purposes. Users may:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Create and manage educational crowdfunding campaigns</li>
            <li>Contribute to campaigns using supported cryptocurrencies</li>
            <li>Interact with smart contracts on the platform</li>
            <li>Access and use platform features as provided</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="mb-4">Users are responsible for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Maintaining the security of their wallet and credentials</li>
            <li>Providing accurate information in campaigns and profiles</li>
            <li>Complying with applicable laws and regulations</li>
            <li>Using the platform in good faith</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Campaign Guidelines</h2>
          <p className="mb-4">All campaigns must:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Be education-related</li>
            <li>Provide accurate and truthful information</li>
            <li>Not violate any laws or regulations</li>
            <li>Not engage in fraudulent activities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Smart Contracts</h2>
          <p>
            Users acknowledge that interactions with smart contracts are irreversible and governed by the code deployed on the blockchain. The platform is not responsible for any losses due to smart contract interactions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p>
            Defi-CrowdFund and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of modified terms.
          </p>
        </section>
      </div>
    </div>
  );
}