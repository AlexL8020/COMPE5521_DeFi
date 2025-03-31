"use client";

import { useWalletAuth } from "../hooks/useWalletAuth";
import { useSession } from "next-auth/react";

export default function WalletLogin() {
  const { connectWallet, disconnectWallet, loading } = useWalletAuth();
  const { data: session } = useSession();

  return (
    <div className="wallet-login">
      {session?.user ? (
        <div>
          <p>Connected: {session?.user?.address ?? "--"}</p>
          <button onClick={disconnectWallet} disabled={loading}>
            {loading ? "Disconnecting..." : "Disconnect Wallet"}
          </button>
        </div>
      ) : (
        <button onClick={connectWallet} disabled={loading}>
          {loading ? "Connecting..." : "Connect MetaMask"}
        </button>
      )}
    </div>
  );
}
