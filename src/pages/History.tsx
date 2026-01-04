import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  History, 
  Play, 
  Download, 
  Trash2, 
  Search,
  Mic2,
  FileText,
  Image,
  Calendar,
  MoreVertical,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const mockProjects = [
  {
    id: 1,
    name: "Horror Story Episode 1",
    type: "voiceover",
    date: "2024-01-15",
    duration: "5:32",
    credits: 45,
    status: "completed",
  },
  {
    id: 2,
    name: "Product Review Script",
    type: "script",
    date: "2024-01-14",
    words: 850,
    credits: 15,
    status: "completed",
  },
  {
    id: 3,
    name: "Gaming Thumbnail",
    type: "thumbnail",
    date: "2024-01-13",
    credits: 10,
    status: "completed",
  },
  {
    id: 4,
    name: "Motivational Story",
    type: "voiceover",
    date: "2024-01-12",
    duration: "3:45",
    credits: 30,
    status: "completed",
  },
  {
    id: 5,
    name: "Comedy Sketch Script",
    type: "script",
    date: "2024-01-11",
    words: 1200,
    credits: 20,
    status: "completed",
  },
];

const typeIcons = {
  voiceover: Mic2,
  script: FileText,
  thumbnail: Image,
};

const typeColors = {
  voiceover: "bg-blue-500/10 text-blue-500",
  script: "bg-purple-500/10 text-purple-500",
  thumbnail: "bg-orange-500/10 text-orange-500",
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterType || project.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <History className="w-8 h-8 text-primary" />
              My Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your generated content
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterType(null)}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("voiceover")}>
                  Voiceovers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("script")}>
                  Scripts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("thumbnail")}>
                  Thumbnails
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Projects", value: mockProjects.length },
            { label: "Voiceovers", value: mockProjects.filter(p => p.type === "voiceover").length },
            { label: "Scripts", value: mockProjects.filter(p => p.type === "script").length },
            { label: "Credits Used", value: mockProjects.reduce((acc, p) => acc + p.credits, 0) },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const Icon = typeIcons[project.type as keyof typeof typeIcons];
              const colorClass = typeColors[project.type as keyof typeof typeColors];
              
              return (
                <Card key={project.id} className="border-border/50 hover:border-primary/50 transition-colors group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <h3 className="font-medium mb-2 line-clamp-1">{project.name}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.date).toLocaleDateString('en-IN', { 
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">
                        {project.type}
                      </Badge>
                      {project.type === "voiceover" && (
                        <span className="text-sm text-muted-foreground">{project.duration}</span>
                      )}
                      {project.type === "script" && (
                        <span className="text-sm text-muted-foreground">{project.words} words</span>
                      )}
                    </div>

                    {project.type === "voiceover" && (
                      <div className="mt-4 pt-4 border-t border-border flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Play className="w-4 h-4" />
                          Play
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No projects found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Start creating to see your projects here"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
