import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Session } from "next-auth";

export default function WalletTab({ session, connectWallet, disconnectWallet, loading, data }: {
    session: Session;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    loading: boolean;
    data: {
        balance: string;
    } | undefined
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
                <CardDescription>Manage your crypto wallet and transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">Connect Your Wallet</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        You need to connect a cryptocurrency wallet to create campaigns and contribute to others.
                    </p>
                    <div className="wallet-login">
                        {session?.user ? (
                            <div className="flex flex-col gap-2">
                                <p>Connected: </p>
                                <p> {session?.user?.address ?? "--"}</p>
                                <Button variant="outline" onClick={disconnectWallet} disabled={loading} size="sm">
                                    {loading ? "Disconnecting..." : "Disconnect Wallet"}
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={connectWallet} disabled={loading} size="sm">
                                {loading ? "Connecting..." : "Connect MetaMask"}
                            </Button>
                        )}
                    </div>
                </div>
                {session?.user?.address && (
                    <div className="flex items-center gap-2">
                        <div className="gap-4">
                            <h3 className="font-medium">Available Balance:</h3>
                            <div className="p-3 border rounded-lg divide-y font-medium">
                                {data?.balance ? data?.balance + " MSC (MOCK STABLE COIN)" : "--"}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}