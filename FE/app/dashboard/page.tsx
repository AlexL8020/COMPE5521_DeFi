"use client";

import { useWalletAuth } from "../../hooks/useWalletAuth";
import { useSession } from "next-auth/react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Edit, Trash2, AlertCircle, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import WalletLogin from "@/components/WalletLogin";
import { useUserProfile } from "@/query/useForUser";
import { useWalletBalance } from "@/query/useForBlockchain";
import CampaignsTab from "./CampaignsTab";
import ContributionsTab from "./ContributionsTab";
import ProfileTab from "./ProfileTab";
import WalletTab from "./WalletTab";
import { useGetCampaignsByCreator } from "@/query/useForCampaigns";

export default function DashboardPage() {
  const { connectWallet, disconnectWallet, loading } = useWalletAuth();
  const { data: session } = useSession();
  const userWalletAddress = session?.user?.address;

  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile(
    userWalletAddress,
    !userWalletAddress
  );

  const { data: walletBalance } = useWalletBalance(userWalletAddress);
  const { data: campaignsByCreator } = useGetCampaignsByCreator(userWalletAddress)


  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          {session?.user?.address ? (
            <p className="text-muted-foreground">
              Manage your campaigns and contributions
            </p>
          ) : null}
        </div>
      </div>

      {session?.user?.address ? (
        <Tabs defaultValue="campaigns">
          <TabsList className="mb-8">
            <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
            <TabsTrigger value="contributions">My Contributions</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <CampaignsTab
              campaignInfo={campaignsByCreator}
            />
          </TabsContent>

          <TabsContent value="contributions">
            <ContributionsTab
            />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab userProfile={userProfile} isLoadingProfile={isLoadingProfile} />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletTab
              session={session}
              connectWallet={connectWallet}
              disconnectWallet={disconnectWallet}
              loading={loading}
              data={walletBalance}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Please connect your wallet to access your dashboard.
          </p>
          <WalletLogin />
        </div>
      )}
    </div>
  );
}
