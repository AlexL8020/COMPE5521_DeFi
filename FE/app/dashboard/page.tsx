import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Edit, Trash2, AlertCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your campaigns and contributions</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/campaigns/create">
            <Button>Create Campaign</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="mb-8">
          <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
          <TabsTrigger value="contributions">My Contributions</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((id) => (
              <Card key={id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      {id === 1 ? "Computer Science Degree Funding" : "Student-Led Fintech Startup"}
                    </CardTitle>
                    <Badge variant={id === 1 ? "default" : "outline"}>{id === 1 ? "Active" : "Draft"}</Badge>
                  </div>
                  <CardDescription>Created on {id === 1 ? "Oct 1, 2023" : "Nov 15, 2023"}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium">{id === 1 ? "3.75 ETH" : "0 ETH"} raised</span>
                        <span className="text-muted-foreground">of 5 ETH goal</span>
                      </div>
                      <Progress value={id === 1 ? 75 : 0} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="border rounded-md p-2">
                        <div className="font-medium">{id === 1 ? "24" : "0"}</div>
                        <div className="text-xs text-muted-foreground">Backers</div>
                      </div>
                      <div className="border rounded-md p-2">
                        <div className="font-medium">{id === 1 ? "15" : "30"}</div>
                        <div className="text-xs text-muted-foreground">Days Left</div>
                      </div>
                      <div className="border rounded-md p-2">
                        <div className="font-medium">{id === 1 ? "2" : "0"}</div>
                        <div className="text-xs text-muted-foreground">Updates</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Link href={`/campaigns/${id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    {id === 2 && (
                      <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contributions">
          <div className="grid md:grid-cols-2 gap-6">
            {[3, 4, 5].map((id) => (
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
                        <div className="font-semibold">{id === 3 ? "0.5 ETH" : id === 4 ? "0.25 ETH" : "0.75 ETH"}</div>
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
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      View Campaign
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wallet">
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
                <Button>Connect Wallet</Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Recent Transactions</h3>
                <div className="border rounded-lg divide-y">
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">Contribution to Medical School Funding</div>
                      <div className="text-sm text-muted-foreground">Oct 12, 2023</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">0.25 ETH</div>
                      <div className="text-xs text-muted-foreground">Confirmed</div>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">Contribution to Renewable Energy Research</div>
                      <div className="text-sm text-muted-foreground">Oct 5, 2023</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">0.5 ETH</div>
                      <div className="text-xs text-muted-foreground">Confirmed</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

