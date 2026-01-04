import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Sparkles, 
  Loader2, 
  Copy, 
  Download,
  BookOpen,
  Wand2
} from "lucide-react";
import { useState } from "react";

const genres = [
  { value: "horror", label: "Horror / Thriller" },
  { value: "comedy", label: "Comedy" },
  { value: "drama", label: "Drama" },
  { value: "romance", label: "Romance" },
  { value: "action", label: "Action / Adventure" },
  { value: "documentary", label: "Documentary" },
  { value: "educational", label: "Educational" },
  { value: "motivational", label: "Motivational" },
];

const tones = [
  { value: "serious", label: "Serious" },
  { value: "casual", label: "Casual" },
  { value: "humorous", label: "Humorous" },
  { value: "dramatic", label: "Dramatic" },
  { value: "inspirational", label: "Inspirational" },
];

const lengths = [
  { value: "short", label: "Short (500 words)" },
  { value: "medium", label: "Medium (1000 words)" },
  { value: "long", label: "Long (2000 words)" },
];

export default function ScriptGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  
  // Form state
  const [topic, setTopic] = useState("");
  const [genre, setGenre] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("");
  const [characters, setCharacters] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleGenerate = async () => {
    if (!topic || !genre) return;
    
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setGeneratedScript(`SCENE 1: OPENING

NARRATOR: (ominous tone)
कहते हैं इस जंगल में कोई अकेला नहीं जाता। जो गया, वो कभी लौटा नहीं...

[Dark forest ambiance, owls hooting]

HERO: (determined)
मैं जाऊंगा। मेरे भाई को बचाना है।

FRIEND: (worried)
राहुल, सोच लो। वो जगह... वहाँ कुछ है जो इंसान नहीं है।

HERO: (firmly)
तो क्या हुआ? मैं भी कोई साधारण इंसान नहीं हूं।

---

SCENE 2: THE FOREST

[Footsteps on dry leaves, wind howling]

NARRATOR:
राहुल जंगल में घुस गया। अंधेरा इतना गहरा था कि अपना हाथ भी नहीं दिखता था।

HERO: (calling out)
विकास! विकास, कहाँ हो तुम?

[Distant whisper]

MYSTERIOUS VOICE: (echoing)
तुम... यहाँ क्यों आए हो?

HERO: (startled)
कौन है?

---

SCENE 3: THE REVELATION

[Thunder rumbles]

VILLAIN: (menacing laugh)
बहुत बहादुर हो तुम। अपने भाई को बचाने आए हो?

HERO:
मेरा भाई कहाँ है?

VILLAIN:
वो अब मेरा है। जैसे जल्द ही तुम भी मेरे हो जाओगे...

[TO BE CONTINUED...]

---
Script Length: ~500 words
Characters: 4 (Narrator, Hero, Friend, Villain, Mysterious Voice)
Estimated Voiceover Credits: 35`);
    
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              AI Script Generator
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate engaging scripts for any genre with AI
            </p>
          </div>
          <Badge variant="secondary" className="gap-1 px-3 py-1.5">
            <Sparkles className="w-4 h-4" />
            20 Credits/Script
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5" />
                Script Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="topic">Story Topic / Plot *</Label>
                <Textarea
                  id="topic"
                  placeholder="Describe your story idea... (e.g., A young man enters a haunted forest to save his brother)"
                  className="min-h-[100px]"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Genre *</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Script Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="characters">Character Names (optional)</Label>
                <Input
                  id="characters"
                  placeholder="e.g., Rahul, Vikram, Maya"
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific scenes, dialogues, or style preferences..."
                  className="min-h-[80px]"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>

              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={handleGenerate}
                disabled={!topic || !genre || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generated Script
                </span>
                {generatedScript && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={handleCopy}>
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedScript ? (
                <div className="relative">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-secondary/30 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                    {generatedScript}
                  </pre>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center bg-secondary/20 rounded-lg border border-dashed border-border">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Your generated script will appear here
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
