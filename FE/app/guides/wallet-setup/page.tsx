"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Wallet, Shield, Link as LinkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WalletSetupGuide() {
  return (
    <div className="container py-12 max-w-4xl">
      <Link href="/guides" className="inline-flex items-center mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Guides
      </Link>

      <h1 className="text-4xl font-bold mb-4">Setting Up MetaMask</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Learn how to set up MetaMask and connect to our local development network
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started with MetaMask</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Wallet className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Install MetaMask</h3>
                    <p className="text-muted-foreground">
                      First, install the MetaMask browser extension from the official website.
                    </p>
                    <Button variant="outline" className="mt-2" asChild>
                      <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                        Get MetaMask
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Configuring Hardhat Network</h2>
          <Card>
            <CardHeader>
              <CardTitle>Add Hardhat Network to MetaMask</CardTitle>
              <CardDescription>Follow these steps to add the local Hardhat network</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Open MetaMask and click the network dropdown</p>
                    <p className="text-sm text-muted-foreground">Usually shows "Ethereum Mainnet" by default</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Select "Add network" then "Add a network manually"</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Enter network details:</p>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>Network name: <span className="font-mono">Hardhat Localhost</span></li>
                      <li>New RPC URL: <span className="font-mono">http://127.0.0.1:8545</span></li>
                      <li>Chain ID: <span className="font-mono">1337</span></li>
                      <li>Currency symbol: <span className="font-mono">ETH</span></li>
                      <li>Block explorer URL: Leave blank</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Click "Save" to add the network</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Importing Test Account</h2>
          <Card>
            <CardHeader>
              <CardTitle>Import Hardhat Test Account</CardTitle>
              <CardDescription>Set up a test account with pre-funded ETH</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Ensure Hardhat node is running</p>
                    <p className="text-sm text-muted-foreground">Copy a private key from the terminal where you ran `npx hardhat node`</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">In MetaMask:</p>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>Select the Hardhat Localhost network</li>
                      <li>Click the account circle icon</li>
                      <li>Choose "Import account"</li>
                      <li>Paste the private key</li>
                      <li>Click "Import"</li>
                    </ul>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Adding Mock Stable Coin (MSC)</h2>
          <Card>
            <CardHeader>
              <CardTitle>Import MSC Token</CardTitle>
              <CardDescription>Add the Mock Stable Coin to see your token balance</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Get the MSC contract address</p>
                    <p className="text-sm text-muted-foreground">Find it in your deployment output or environment variables</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">In MetaMask:</p>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>Ensure Hardhat Localhost network is selected</li>
                      <li>Go to "Assets" tab</li>
                      <li>Click "Import tokens"</li>
                      <li>Paste the MSC contract address</li>
                      <li>Verify token symbol (MSC) and decimals (18)</li>
                      <li>Click "Add custom token" then "Import tokens"</li>
                    </ul>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Important Security Notes</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Test Accounts Only</h3>
                    <p className="text-muted-foreground">
                      Never use real private keys or send actual ETH to test accounts. These are for development only.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Network Verification</h3>
                    <p className="text-muted-foreground">
                      Always ensure you're connected to the correct network (Hardhat Localhost) when testing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}