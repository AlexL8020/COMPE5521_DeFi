"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2, ArrowUpRight } from "lucide-react";
import { CampaignInfo } from "@/query/useForCampaigns";

export default function CampaignsTab({ campaignInfo }: { campaignInfo: CampaignInfo[] | undefined }) {
    console.log("===== campaignInfo: ", campaignInfo)
    return (
        <div className="flex flex-1 ">
            {
                campaignInfo && campaignInfo?.length >= 1 ?

                    <div className="grid md:grid-cols-2 gap-">
                        {campaignInfo?.map(({ campaignId, active, goal, amountRaised, deadline }) => {


                            const campaignName = "TBC: " + campaignId;
                            const createdOn = "TBC"
                            const goalAmount = parseFloat(goal);
                            const raisedAmount = parseFloat(amountRaised);
                            const numOfBackers = 0
                            const daysLeft = Math.floor((new Date(deadline * 1000).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                            return (
                                <Card key={campaignId}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl">
                                                {campaignName}
                                            </CardTitle>
                                            <Badge variant={active ? "default" : "outline"}>{active ? "Active" : "Draft"}</Badge>
                                        </div>
                                        <CardDescription>Created on {createdOn}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-1 text-sm">
                                                    <span className="font-medium">{raisedAmount + " MSC"} raised</span>
                                                    <span className="text-muted-foreground">of {goalAmount + " MSC"} goal</span>
                                                </div>
                                                <Progress value={(raisedAmount / goalAmount)} className="h-2" />
                                            </div>
                                            <div className="flex gap-2 text-center text-sm">
                                                <div className="flex-1   rounded-md p-2">
                                                    <div className="font-medium">{numOfBackers}</div>
                                                    <div className="text-xs text-muted-foreground">Backers</div>
                                                </div>
                                                <div className="flex-1   rounded-md p-2">
                                                    <div className="font-medium">{daysLeft}</div>
                                                    <div className="text-xs text-muted-foreground">Days Left</div>
                                                </div>
                                                {/* <div className="border rounded-md p-2">
                                        <div className="font-medium">{id === 1 ? "2" : "0"}</div>
                                        <div className="text-xs text-muted-foreground">Updates</div>
                                    </div> */}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2">
                                        <div className="flex gap-2 w-full">

                                            <Link href={`/campaigns/${campaignId}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <ArrowUpRight className="h-4 w-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            {/* {id === 2 && (
                                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                )} */}
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        }

                        )}
                    </div> :

                    <div className="gap-2">
                        <p className="text-muted-foreground">No campaigns found</p>

                        <Link href="/campaigns/create">
                            <Button size="sm">Start Campaign</Button>
                        </Link>

                    </div>
            }


        </div>
    );
}