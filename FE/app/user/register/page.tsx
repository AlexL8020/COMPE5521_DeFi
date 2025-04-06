"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateUser } from "@/query/useForUser";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const walletAddress = session?.user?.address;
  const createUserMutation = useCreateUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const [error, setError] = useState<string | null>(null);

  // Redirect if no wallet is connected
  //   if (!walletAddress) {
  //     if (typeof window !== "undefined") {
  //       router.push("/");
  //     }
  //     return null;
  //   }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!walletAddress) {
      console.error("No wallet address found");
      setError("No wallet address found");
      return;
    }
    try {
      await createUserMutation.mutateAsync({
        walletAddress: walletAddress,
        name: formData.name,
        email: formData.email || undefined,
        bio: formData.bio || undefined,
      });

      // Redirect to home page or dashboard after successful registration
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user profile. Please try again.");
    }
  };

  return (
    <div className="container py-12 max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Your wallet is connected, but we need some additional information to
            complete your registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="walletAddress">Wallet Address</Label>
              <Input id="walletAddress" value={walletAddress ?? ""} disabled />
              <p className="text-xs text-muted-foreground">
                This is the wallet address you connected with
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Your name or username"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                We'll only use this for important notifications about your
                campaigns
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a bit about yourself"
                className="resize-none"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={createUserMutation.isPending}
          >
            {createUserMutation.isPending
              ? "Creating Profile..."
              : "Complete Registration"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
