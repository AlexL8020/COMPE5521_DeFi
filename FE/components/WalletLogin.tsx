"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletAuth } from "../hooks/useWalletAuth";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useCheckUserExists } from "@/query/useForUser";
import { useQueryClient } from "@tanstack/react-query";

export default function WalletLogin() {
  const { connectWallet, disconnectWallet, loading } = useWalletAuth();
  const { data: session } = useSession();
  const router = useRouter();
  const walletAddress = session?.user?.address ?? "";

  const {
    data: chkRes,
    isLoading: isCheckingUser,
    isError: isUserCheckError,
    error: userCheckError,
  } = useCheckUserExists(walletAddress);
  const queryClient = useQueryClient();

  // Redirect to registration page if wallet is connected but user doesn't exist
  useEffect(() => {
    if (walletAddress) {
      queryClient.invalidateQueries({
        queryKey: ["user", walletAddress]
      }); // Invalidate user data to refresh it

    }
    if (
      walletAddress &&
      !chkRes?.isExist &&
      !isCheckingUser &&
      !isUserCheckError
    ) {
      router.push("/user/register");
    }
  }, [
    walletAddress,
    chkRes?.isExist,
    isCheckingUser,
    isUserCheckError,
    router,
  ]);

  return (
    <div className="wallet-login">
      {session?.user ? (
        <div className="md:block">
          <div className="flex flex-col gap-2  rounded-md p-2 text-sm">
            <div className="text-zinc-400">Connected:</div>
            <div className="text-xs truncate max-w-[100px]">
              {session?.user?.address ?? "--"}
            </div>
            {/* <button className="text-zinc-400 hover:text-white text-sm mt-1">Disconnect Wallet</button> */}
            <Button
              variant="outline"
              onClick={disconnectWallet}
              disabled={loading}
              size="sm"
            >
              {loading ? "Disconnecting..." : "Disconnect Wallet"}
            </Button>
          </div>
        </div>
      ) : (
        // <div className="flex flex-col gap-2">
        //   <p>Connected: </p>
        //   <p> {session?.user?.address ?? "--"}</p>
        //   <Button
        //     variant="outline"
        //     onClick={disconnectWallet}
        //     disabled={loading}
        //     size="sm"
        //   >
        //     {loading ? "Disconnecting..." : "Disconnect Wallet"}
        //   </Button>
        // </div>
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
