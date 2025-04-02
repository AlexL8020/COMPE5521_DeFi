import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CampaignsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Campaigns</h1>
          <p className="text-muted-foreground">
            Discover student campaigns from around the world !
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tuition">Tuition</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Link href={`/campaigns/${i + 1}`} key={i} className="group">
            <div className="rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video relative bg-muted">
                <img
                  src={`/placeholder.svg?height=225&width=400&text=Campaign+${
                    i + 1
                  }`}
                  alt={`Campaign ${i + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                  {i % 3 === 0
                    ? `Computer Science Degree ${i + 1}`
                    : i % 3 === 1
                    ? `Research Project ${i + 1}`
                    : `Student Startup ${i + 1}`}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {i % 3 === 0
                    ? "Help me complete my degree and build open-source tools."
                    : i % 3 === 1
                    ? "Supporting innovative research in an emerging field."
                    : "Building a platform to solve real-world problems."}
                </p>
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${Math.floor(Math.random() * 80 + 20)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {(Math.random() * 5).toFixed(2)} ETH raised
                    </span>
                    <span className="text-muted-foreground">
                      {Math.floor(Math.random() * 80 + 20)}% of 5 ETH
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <div className="flex gap-1">
          <Button variant="outline" size="icon" disabled>
            1
          </Button>
          <Button variant="outline" size="icon">
            2
          </Button>
          <Button variant="outline" size="icon">
            3
          </Button>
          <Button variant="outline" size="icon">
            4
          </Button>
        </div>
      </div>
    </div>
  );
}
