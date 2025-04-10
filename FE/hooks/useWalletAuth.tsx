// hooks/useWalletAuth.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { signIn, signOut } from "next-auth/react";

export function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);

  // Connect wallet and sign message
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);

      // Disconnect if already connected
      if (isConnected) {
        await disconnectAsync();
      }

      // Connect to MetaMask
      const result = await connectAsync({
        connector: injected(),
      });

      const address = result?.accounts?.[0];

      // Generate a random nonce for signing
      const nonce = Math.floor(Math.random() * 1000000).toString();

      // Create message to sign
      const message = `Sign this message to verify wallet ownership: ${nonce}`;

      // Request signature
      const signature = await signMessageAsync({ message });

      // Authenticate with backend
      await signIn("credentials", {
        address,
        message,
        signature,
        redirect: false,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error?.code == "-32002") {
        console.log("Please check your wallet for connection request.");
      
      }
    } finally {
      setLoading(false);
    }
  }, [connectAsync, disconnectAsync, isConnected, signMessageAsync]);

  const disconnectWallet = useCallback(async () => {
    if (!isConnected) return;

    try {
      setLoading(true);
      await disconnectAsync();
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    } finally {
      setLoading(false);
    }
  }, [disconnectAsync, isConnected]);

  return {
    address,
    isConnected,
    loading,
    connectWallet,
    disconnectWallet,
  };
}
