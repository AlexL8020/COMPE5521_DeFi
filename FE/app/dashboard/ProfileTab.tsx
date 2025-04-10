import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, User } from "lucide-react";

export default function ProfileTab({ userProfile, isLoadingProfile }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    My Profile
                </CardTitle>
                <CardDescription>Your personal information and account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoadingProfile ? (
                    <div className="text-center py-4">Loading profile information...</div>
                ) : userProfile ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="font-medium">{userProfile?.user?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="font-medium">{userProfile?.user?.email || "Not provided"}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
                            <p className="font-medium break-all">{userProfile?.user?.walletAddress}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Bio</p>
                            <p>{userProfile?.user?.bio || "No bio provided"}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-muted-foreground">Profile information not available</div>
                )}
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile (Coming Soon)
                </Button>
            </CardFooter>
        </Card>
    );
}