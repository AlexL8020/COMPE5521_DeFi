import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Share2, Flag, Heart } from "lucide-react"
import { FundingForm } from "@/components/funding-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function CampaignPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // This would come from a database in a real app
  const campaign = {
    id,
    title:
      id % 3 === 0
        ? "Computer Science Degree Funding"
        : id % 3 === 1
          ? "Renewable Energy Research Project"
          : "Student-Led Fintech Startup",
    description:
      "I'm a passionate student looking to complete my education and make a difference in the world. This campaign will help fund my tuition and living expenses while I complete my degree.",
    longDescription: `
      <p>Hello everyone! I'm excited to share my educational journey with you and ask for your support.</p>
      
      <p>As a first-generation college student, I've always been passionate about technology and its potential to solve real-world problems. I've completed two years of my Computer Science degree, maintaining a 3.8 GPA while working part-time to support myself.</p>
      
      <p>However, due to rising tuition costs and family circumstances, I'm facing financial challenges that might prevent me from completing my education. That's why I'm turning to this platform and the global community for support.</p>
      
      <p>With your backing, I'll be able to:</p>
      <ul>
        <li>Complete my remaining two years of education</li>
        <li>Focus on my studies without the burden of excessive work hours</li>
        <li>Participate in research opportunities that will enhance my skills</li>
        <li>Contribute to open-source projects that benefit the community</li>
      </ul>
      
      <p>I'm committed to giving back to the community that supports me. As part of this campaign, I pledge to:</p>
      <ul>
        <li>Create and share educational content about what I'm learning</li>
        <li>Mentor other students from similar backgrounds</li>
        <li>Develop at least one open-source tool that addresses an educational need</li>
      </ul>
      
      <p>Thank you for considering my campaign. Your support, regardless of the amount, will make a significant difference in my educational journey and future career.</p>
    `,
    creator: "Alex Johnson",
    creatorId: "alex123",
    category: id % 3 === 0 ? "Tuition" : id % 3 === 1 ? "Research" : "Startup",
    goal: 5,
    raised: id % 3 === 0 ? 3.75 : id % 3 === 1 ? 2.25 : 3,
    backers: 24,
    daysLeft: 15,
    createdAt: "2023-10-01",
    updates: [
      {
        id: 1,
        title: "First milestone reached!",
        content:
          "Thanks to your generous support, I've reached my first milestone! I've been able to register for the upcoming semester and secure my housing.",
        date: "2023-10-15",
      },
      {
        id: 2,
        title: "Halfway through the semester",
        content:
          "I wanted to share an update on my progress. I'm currently maintaining an A average in all my courses and have started working on a side project that I'm excited to share soon.",
        date: "2023-11-01",
      },
    ],
    comments: [
      {
        id: 1,
        user: "Sarah M.",
        content: "So happy to support your education! Keep up the great work!",
        date: "2023-10-05",
      },
      {
        id: 2,
        user: "David K.",
        content: "As a CS graduate myself, I know how valuable this degree will be. Wishing you all the best!",
        date: "2023-10-10",
      },
      {
        id: 3,
        user: "Michelle T.",
        content:
          "Your commitment to giving back to the community is inspiring. Looking forward to seeing what you create!",
        date: "2023-10-20",
      },
    ],
  }

  const percentFunded = (campaign.raised / campaign.goal) * 100

  return (
    <div className="container py-8">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-6">
            <img
              src={`/placeholder.svg?height=400&width=800&text=Campaign+${id}`}
              alt={campaign.title}
              className="object-cover w-full h-full"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?text=AJ" />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{campaign.creator}</span>
            </div>
            <Badge variant="outline">{campaign.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{campaign.createdAt}</span>
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates ({campaign.updates.length})</TabsTrigger>
              <TabsTrigger value="comments">Comments ({campaign.comments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <p className="text-muted-foreground">{campaign.description}</p>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: campaign.longDescription }}
              ></div>
            </TabsContent>

            <TabsContent value="updates" className="space-y-6">
              {campaign.updates.map((update) => (
                <div key={update.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-1">{update.title}</h3>
                  <div className="text-sm text-muted-foreground mb-2">{update.date}</div>
                  <p>{update.content}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              {campaign.comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{comment.user}</span>
                    <span className="text-xs text-muted-foreground">{comment.date}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-card">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{campaign.raised} ETH raised</span>
                <span className="text-muted-foreground">of {campaign.goal} ETH goal</span>
              </div>
              <Progress value={percentFunded} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{campaign.backers}</div>
                <div className="text-xs text-muted-foreground">Backers</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{campaign.daysLeft}</div>
                <div className="text-xs text-muted-foreground">Days Left</div>
              </div>
            </div>

            <FundingForm />

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h3 className="font-semibold mb-4">Campaign Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1 bg-primary rounded relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <div>
                  <div className="font-medium">Campaign Started</div>
                  <div className="text-sm text-muted-foreground">{campaign.createdAt}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 bg-muted rounded relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-muted"></div>
                </div>
                <div>
                  <div className="font-medium">Funding Deadline</div>
                  <div className="text-sm text-muted-foreground">In {campaign.daysLeft} days</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 bg-muted rounded relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-muted"></div>
                </div>
                <div>
                  <div className="font-medium">Project Completion</div>
                  <div className="text-sm text-muted-foreground">Estimated: May 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

