import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Sparkles, 
  Loader2, 
  Copy, 
  CheckCircle2,
  Tag,
  FileText,
  Type
} from "lucide-react";
import { useState } from "react";

interface SEOResult {
  titles: string[];
  description: string;
  tags: string[];
  hashtags: string[];
}

export default function SeoKit() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<SEOResult | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult({
      titles: [
        `${topic} - Complete Guide 2024 🔥`,
        `How to Master ${topic} in 10 Minutes`,
        `${topic}: Secrets Nobody Tells You! 😱`,
        `Why ${topic} is Trending in India | Full Explanation`,
        `${topic} Tutorial for Beginners - Step by Step`,
      ],
      description: `🎯 इस video में हम ${topic} के बारे में पूरी जानकारी देंगे।

आप सीखेंगे:
✅ ${topic} क्या है
✅ कैसे शुरू करें
✅ Pro tips और tricks
✅ Common mistakes से कैसे बचें

👇 ज़रूर देखें और SUBSCRIBE करें!

#${topic.replace(/\s+/g, '')} #Hindi #Tutorial

📌 Chapters:
0:00 - Introduction
1:30 - What is ${topic}
5:00 - Getting Started
10:00 - Pro Tips
15:00 - Conclusion

🔔 Don't forget to LIKE, SHARE, and SUBSCRIBE!`,
      tags: [
        topic.toLowerCase(),
        `${topic} tutorial`,
        `${topic} hindi`,
        `${topic} 2024`,
        `how to ${topic}`,
        `${topic} for beginners`,
        `${topic} tips`,
        `${topic} guide`,
        `learn ${topic}`,
        `${topic} explained`,
        "hindi tutorial",
        "step by step",
      ],
      hashtags: [
        `#${topic.replace(/\s+/g, '')}`,
        "#Hindi",
        "#Tutorial",
        "#2024",
        "#Learning",
        "#HowTo",
        "#India",
        "#Viral",
      ],
    });
    
    setIsGenerating(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const copyAll = (items: string[], separator: string = ", ") => {
    navigator.clipboard.writeText(items.join(separator));
    setCopiedItem("all");
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <Search className="w-8 h-8 text-primary" />
              YouTube SEO Kit
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate optimized titles, descriptions, and tags
            </p>
          </div>
          <Badge variant="secondary" className="gap-1 px-3 py-1.5">
            <Sparkles className="w-4 h-4" />
            5 Credits/Pack
          </Badge>
        </div>

        {/* Input Section */}
        <Card className="border-border/50 mb-8">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="topic" className="sr-only">Video Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter your video topic (e.g., iPhone 15 Review, Learn Python, Horror Story)"
                  className="h-12 text-base"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
              <Button 
                size="lg"
                className="gap-2 px-8"
                onClick={handleGenerate}
                disabled={!topic || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate SEO Pack
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Titles */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Type className="w-5 h-5" />
                  Title Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.titles.map((title, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                  >
                    <span className="text-sm flex-1 pr-2">{title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCopy(title, `title-${index}`)}
                    >
                      {copiedItem === `title-${index}` ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Description
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleCopy(result.description, "description")}
                  >
                    {copiedItem === "description" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-secondary/30 rounded-lg p-4 max-h-[300px] overflow-y-auto font-sans">
                  {result.description}
                </pre>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => copyAll(result.tags)}
                  >
                    {copiedItem === "all" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleCopy(tag, `tag-${index}`)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hashtags */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Hashtags
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => copyAll(result.hashtags, " ")}
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((hashtag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      onClick={() => handleCopy(hashtag, `hashtag-${index}`)}
                    >
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!result && !isGenerating && (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Enter Your Video Topic</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Get AI-optimized titles, descriptions, and tags to help your videos rank higher on YouTube
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
