import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Image as ImageIcon, 
  Sparkles, 
  Loader2, 
  Download,
  Wand2,
  Type,
  Palette
} from "lucide-react";
import { useState } from "react";

const styles = [
  { value: "realistic", label: "Realistic" },
  { value: "cinematic", label: "Cinematic" },
  { value: "anime", label: "Anime / Cartoon" },
  { value: "3d", label: "3D Render" },
  { value: "horror", label: "Dark / Horror" },
  { value: "vibrant", label: "Vibrant / Colorful" },
];

export default function ThumbnailGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Form state
  const [prompt, setPrompt] = useState("");
  const [overlayText, setOverlayText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("cinematic");

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated image (would be actual AI-generated image)
    setGeneratedImage("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&h=720&fit=crop");
    
    setIsGenerating(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-primary" />
              Thumbnail Generator
            </h1>
            <p className="text-muted-foreground mt-1">
              Create eye-catching thumbnails with AI
            </p>
          </div>
          <Badge variant="secondary" className="gap-1 px-3 py-1.5">
            <Sparkles className="w-4 h-4" />
            10 Credits/Image
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="w-5 h-5" />
                Thumbnail Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="prompt">Image Description *</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe what you want in the thumbnail... (e.g., A ghost standing in a dark forest at night, fog everywhere, moonlight)"
                  className="min-h-[120px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overlay">Text Overlay (optional)</Label>
                <Input
                  id="overlay"
                  placeholder="e.g., EP 1: The Beginning"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This text will be added to your thumbnail
                </p>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Style
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {styles.map((style) => (
                    <Button
                      key={style.value}
                      variant={selectedStyle === style.value ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setSelectedStyle(style.value)}
                    >
                      {style.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!prompt || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Thumbnail...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generate Thumbnail
                    </>
                  )}
                </Button>
              </div>

              {/* Tips */}
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Pro Tips
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Be specific about colors, lighting, and mood</li>
                  <li>• Mention camera angle (close-up, wide shot, etc.)</li>
                  <li>• Include emotional keywords (scary, exciting, peaceful)</li>
                  <li>• Keep text overlay short (3-5 words max)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Generated Thumbnail
                </span>
                {generatedImage && (
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
                    <img 
                      src={generatedImage} 
                      alt="Generated thumbnail"
                      className="w-full h-full object-cover"
                    />
                    {overlayText && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/60 px-6 py-3 rounded-lg">
                          <span className="text-2xl font-display font-bold text-white drop-shadow-lg">
                            {overlayText}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Regenerate
                    </Button>
                    <Button className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Download HD
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Resolution: 1280 x 720 (YouTube Optimized)
                  </p>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-secondary/20 rounded-lg border border-dashed border-border">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Your generated thumbnail will appear here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      1280 x 720 pixels
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
