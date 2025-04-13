"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Last updated: April 13, 2025
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect the following types of information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Wallet Information:</strong> Public wallet addresses and transaction data
            </li>
            <li>
              <strong>Campaign Information:</strong> Details provided in crowdfunding campaigns
            </li>
            <li>
              <strong>Usage Data:</strong> How you interact with our platform
            </li>
            <li>
              <strong>Communication Data:</strong> Messages and correspondence with our team
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Information</h2>
          <p className="mb-4">Your information is used to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Facilitate campaign creation and management</li>
            <li>Process contributions and transactions</li>
            <li>Improve our platform and user experience</li>
            <li>Communicate important updates and information</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Blockchain Data</h2>
          <p>
            Due to the nature of blockchain technology, transaction data is public and immutable. This includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Wallet addresses</li>
            <li>Transaction amounts</li>
            <li>Smart contract interactions</li>
            <li>Timestamp information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information. However, no internet transmission is completely secure. We cannot guarantee the security of data transmitted to our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
          <p>
            Our platform integrates with third-party services, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Blockchain networks</li>
            <li>Wallet providers</li>
            <li>Analytics services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (where applicable)</li>
            <li>Object to processing of your data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            For any privacy-related questions or concerns, please contact us at:
            <br />
            Email: privacy@studentfund.comp5521.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Updates to Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. Users will be notified of significant changes through the platform or via email.
          </p>
        </section>
      </div>
    </div>
  );
}