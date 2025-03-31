"use client";

import { useWalletAuth } from "../hooks/useWalletAuth";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function WalletLogin() {
  const { connectWallet, disconnectWallet, loading } = useWalletAuth();
  const { data: session } = useSession();

  return (
    <div className="wallet-login">
      {session?.user ? (
        <div className="flex flex-col gap-2">
          <p>Connected: </p>
          <p> {session?.user?.address ?? "--"}</p>
          <Button
            variant="outline"
            onClick={disconnectWallet}
            disabled={loading}
            size="sm"
          >
            {loading ? "Disconnecting..." : "Disconnect Wallet"}
          </Button>
        </div>
      ) : (
        // <button onClick={connectWallet} disabled={loading}>
        //   {loading ? "Connecting..." : "Connect MetaMask"}
        // </button>
        <Button onClick={connectWallet} disabled={loading} size="sm">
          {loading ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}
    </div>
  );
}
