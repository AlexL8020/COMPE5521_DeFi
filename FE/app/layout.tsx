"use client";

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "../providers/WalletProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import WalletLogin from "@/components/WalletLogin";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Defi-CrowdFund - Decentralized Crowdfunding for Students",
//   description:
//     "Create crowdfunding campaigns for tuition, projects, or startups and receive support from global backers in cryptocurrency.",
//   generator: "Defi-CrowdFund",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <WalletProvider>
              <header className="border-b">
                <div className="container flex items-center justify-between py-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <GraduationCap className="h-6 w-6" />
                    <span>Defi-CrowdFund</span>
                  </Link>
                  <nav className="hidden md:flex items-center gap-6">
                    <Link
                      href="/campaigns"
                      className="text-sm font-medium hover:underline"
                    >
                      Browse Campaigns
                    </Link>
                    <Link
                      href="/how-it-works"
                      className="text-sm font-medium hover:underline"
                    >
                      How It Works
                    </Link>
                    <Link
                      href="/about"
                      className="text-sm font-medium hover:underline"
                    >
                      About
                    </Link>
                  </nav>
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/campaigns/create">
                      <Button size="sm">Start Campaign</Button>
                    </Link>
                    {/* Client-side wallet login component */}
                    <WalletLogin />
                  </div>
                </div>
              </header>

              {children}
            </WalletProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
