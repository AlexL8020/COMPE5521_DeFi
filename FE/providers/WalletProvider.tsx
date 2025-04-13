// app/providers/WalletProvider.tsx
"use client";

import { createConfig, http, injected, WagmiProvider } from "wagmi";
import { hardhat, mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";

const queryClient = new QueryClient();

const hardhatLocal = {
  ...hardhat, // Spread defaults like name, native currency
  id: 1337,    // Default Hardhat chain ID
  name: 'Hardhat Local', // Give it a distinct name
  rpcUrls: {
    // Explicitly define the RPC URL Wagmi should use for this chain
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] }, // Often good to define public too
  },
} as const;

// --- Create Wagmi Config ---
const config = createConfig({
  // Add hardhatLocal to the list of supported chains
  chains: [hardhatLocal,], // Order might influence default chain
  connectors: [
    injected(), // Connector for MetaMask, etc.
    // Add other connectors like WalletConnect if needed
  ],
  transports: {
    // Define transport for each chain
    [hardhatLocal.id]: http(), // Use the default RPC defined in hardhatLocal object
  },
  ssr: true, // Recommended for Next.js to help with hydration
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
