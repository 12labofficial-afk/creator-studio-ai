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
  Filter,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  type: string;
  created_at: string;
  status: string | null;
  content: unknown;
}

const typeIcons: Record<string, typeof Mic2> = {
  voiceover: Mic2,
  script: FileText,
  thumbnail: Image,
  seo: FileText,
};

const typeColors: Record<string, string> = {
  voiceover: "bg-blue-500/10 text-blue-500",
  script: "bg-purple-500/10 text-purple-500",
  thumbnail: "bg-orange-500/10 text-orange-500",
  seo: "bg-green-500/10 text-green-500",
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    setLoading(true);
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to load projects");
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      toast.error("Failed to delete project");
    } else {
      toast.success("Project deleted");
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const filteredProjects = projects.filter((project) => {
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
                <DropdownMenuItem onClick={() => setFilterType("seo")}>
                  SEO
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Projects", value: projects.length },
            { label: "Voiceovers", value: projects.filter(p => p.type === "voiceover").length },
            { label: "Scripts", value: projects.filter(p => p.type === "script").length },
            { label: "Thumbnails", value: projects.filter(p => p.type === "thumbnail").length },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const Icon = typeIcons[project.type] || FileText;
              const colorClass = typeColors[project.type] || "bg-muted text-muted-foreground";
              
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
                          <DropdownMenuItem 
                            className="gap-2 text-destructive"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <h3 className="font-medium mb-2 line-clamp-1">{project.name}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.created_at).toLocaleDateString('en-IN', { 
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">
                        {project.type}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {project.status}
                      </Badge>
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
