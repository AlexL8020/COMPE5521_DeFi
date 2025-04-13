import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ContributionsTab() {
    const contributions = [] as any[]
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {contributions && contributions?.length
                ? contributions.map((id) => (
                    <Card key={id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">
                                {id === 3
                                    ? "Renewable Energy Research Project"
                                    : id === 4
                                        ? "Medical School Funding"
                                        : "Educational App Development"}
                            </CardTitle>
                            <CardDescription>
                                Contributed on {id === 3 ? "Oct 5, 2023" : id === 4 ? "Oct 12, 2023" : "Nov 1, 2023"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Your contribution</div>
                                        <div className="font-semibold">
                                            {id === 3 ? "0.5 ETH" : id === 4 ? "0.25 ETH" : "0.75 ETH"}
                                        </div>
                                    </div>
                                    <Badge variant="outline">Active</Badge>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="font-medium">
                                            {id === 3 ? "2.25 ETH" : id === 4 ? "4.5 ETH" : "3.2 ETH"} raised
                                        </span>
                                        <span className="text-muted-foreground">
                                            of {id === 3 ? "5 ETH" : id === 4 ? "6 ETH" : "4 ETH"} goal
                                        </span>
                                    </div>
                                    <Progress value={id === 3 ? 45 : id === 4 ? 75 : 80} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Link href={`/campaigns/${id}`} className="w-full">
                                <Button variant="outline" size="sm" className="w-full">
                                    View Campaign
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                )) : <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-lg font-semibold">No Contributions Yet</h2>
                    <p className="text-sm text-muted-foreground">how about viewing some campaigns, and starting your first contributions?</p>
                    <Link href="/campaigns" className="w-full">
                        <Button variant="outline" size="sm" className="w-full mt-4">
                            Explore Campaigns
                        </Button>
                    </Link>
                </div>
            }
        </div>
    );
}