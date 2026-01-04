import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mic2, 
  Sparkles, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Volume2,
  User,
  Loader2,
  FileText,
  Coins
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const voices = [
  { id: "male-deep", name: "Arjun (Male - Deep)", language: "Hindi" },
  { id: "male-young", name: "Rohan (Male - Young)", language: "Hindi" },
  { id: "female-soft", name: "Priya (Female - Soft)", language: "Hindi" },
  { id: "female-energetic", name: "Sneha (Female - Energetic)", language: "Hindi" },
  { id: "male-narrator", name: "Narrator (Male - Professional)", language: "English" },
  { id: "female-narrator", name: "Sarah (Female - Professional)", language: "English" },
];

interface Character {
  name: string;
  dialogues: string[];
  selectedVoice: string;
}

export default function Studio() {
  const [script, setScript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleAnalyzeScript = async () => {
    if (!script.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-script', {
        body: { script }
      });

      if (error) throw error;
      
      if (data?.characters) {
        const formattedCharacters = data.characters.map((char: { name: string; dialogues: string[]; suggestedVoice: string }) => ({
          name: char.name,
          dialogues: char.dialogues,
          selectedVoice: char.suggestedVoice || 'male-narrator'
        }));
        setCharacters(formattedCharacters);
        setEstimatedCost(data.estimatedCredits || 0);
        toast({
          title: "Script Analyzed! ✨",
          description: `Found ${data.characters.length} characters.`,
        });
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      console.error('Error analyzing script:', error);
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateVoice = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate generation progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(i);
    }
    
    setAudioGenerated(true);
    setIsGenerating(false);
  };

  const updateCharacterVoice = (characterName: string, voiceId: string) => {
    setCharacters(chars => 
      chars.map(c => 
        c.name === characterName ? { ...c, selectedVoice: voiceId } : c
      )
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <Mic2 className="w-8 h-8 text-primary" />
              AI Voice Studio
            </h1>
            <p className="text-muted-foreground mt-1">
              Transform your scripts into professional voiceovers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 px-3 py-1.5">
              <Coins className="w-4 h-4" />
              250 Credits
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Script Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5" />
                  Your Script
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`Paste your script here...

Example format:
NARRATOR: In a dark forest, where shadows dance...
HERO: I won't let you escape this time!
VILLAIN: You fool! You have no idea what you're dealing with.`}
                  className="min-h-[300px] resize-none font-mono text-sm"
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload File
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      .txt, .doc, .pdf supported
                    </span>
                  </div>
                  <Button 
                    onClick={handleAnalyzeScript}
                    disabled={!script.trim() || isAnalyzing}
                    className="gap-2"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Analyze Script
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Characters Section */}
            {characters.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5" />
                    Characters Detected ({characters.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {characters.map((character) => (
                    <div 
                      key={character.name}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{character.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {character.dialogues.length} dialogue(s)
                        </div>
                      </div>
                      <Select
                        value={character.selectedVoice}
                        onValueChange={(value) => updateCharacterVoice(character.name, value)}
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {voices.map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              {voice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Cost Estimation */}
            <Card className="border-border/50 bg-primary/5">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Estimated Cost</div>
                  <div className="text-4xl font-display font-bold text-primary">
                    {estimatedCost}
                  </div>
                  <div className="text-sm text-muted-foreground">Credits</div>
                </div>
                
                {characters.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Breakdown</div>
                    {characters.map((char) => (
                      <div key={char.name} className="flex justify-between text-sm">
                        <span>{char.name}</span>
                        <span>{char.dialogues.length * 5} credits</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  className="w-full mt-6 gap-2"
                  size="lg"
                  disabled={characters.length === 0 || isGenerating}
                  onClick={handleGenerateVoice}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Mic2 className="w-4 h-4" />
                      Generate Voiceover
                    </>
                  )}
                </Button>
                
                {isGenerating && (
                  <div className="mt-4">
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-center text-muted-foreground mt-2">
                      {progress}% complete
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audio Player */}
            {audioGenerated && (
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Volume2 className="w-8 h-8 text-primary" />
                    </div>
                    <div className="font-medium">Audio Ready!</div>
                    <div className="text-sm text-muted-foreground">Duration: 2:34</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <Progress value={35} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground">0:54 / 2:34</span>
                  </div>
                  
                  <Button className="w-full mt-4 gap-2" variant="secondary">
                    <Download className="w-4 h-4" />
                    Download MP3
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Pro Tips
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Use character names in CAPS before dialogue</li>
                  <li>• Add emotion hints like [angry] or [whisper]</li>
                  <li>• Keep dialogues under 500 words for best quality</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
