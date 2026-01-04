import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Mic2, 
  FileText, 
  Image, 
  Search, 
  Sparkles, 
  Zap, 
  Users, 
  Star,
  ArrowRight,
  Play,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: Mic2,
    title: "AI Voice Studio",
    description: "Generate natural voiceovers in 50+ voices. Perfect for YouTube, podcasts, and audiobooks.",
    href: "/studio",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Script Generator",
    description: "Create engaging scripts for any genre. Horror, comedy, drama - AI writes it all.",
    href: "/script-generator",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Image,
    title: "Thumbnail Maker",
    description: "Generate eye-catching thumbnails that boost your click-through rates.",
    href: "/thumbnail-generator",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Search,
    title: "YouTube SEO Kit",
    description: "Get optimized titles, descriptions, and tags to rank your videos higher.",
    href: "/seo-kit",
    gradient: "from-green-500 to-emerald-500",
  },
];

const stats = [
  { value: "10K+", label: "Creators" },
  { value: "1M+", label: "Voiceovers" },
  { value: "50+", label: "AI Voices" },
  { value: "99%", label: "Satisfaction" },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "YouTube Creator",
    avatar: "RS",
    content: "12Labs ne mera content creation game hi change kar diya. Ab har week 3 videos daal pata hoon!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Podcast Host",
    avatar: "PP",
    content: "Voice quality itni natural hai ki log samajh nahi paate AI hai. Amazing tool for podcasters!",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    role: "Horror Story Creator",
    avatar: "AK",
    content: "Script generator se horror stories likhna bahut easy ho gaya. AI really understands the genre.",
    rating: 5,
  },
];

const pricingPlans = [
  { credits: 100, price: 199, popular: false },
  { credits: 500, price: 799, popular: true },
  { credits: 1000, price: 1499, popular: false },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">India's #1 AI Content Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-up">
              Create Content
              <span className="block gradient-text">10x Faster with AI</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Generate voiceovers, scripts, thumbnails, and SEO content in minutes. 
              Perfect for YouTube creators, podcasters, and storytellers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/login">
                <Button size="lg" className="gap-2 px-8 glow">
                  Start Creating Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2 px-8">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border animate-fade-up" style={{ animationDelay: "0.3s" }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-display font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools designed for Indian creators. No technical skills required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.href}>
                  <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-1 mt-4 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Try Now <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create professional content in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: "Write or Paste", desc: "Enter your script or let AI generate one for you" },
              { step: 2, title: "Choose Voices", desc: "Select from 50+ natural AI voices for each character" },
              { step: 3, title: "Generate & Download", desc: "Get your professional voiceover in seconds" },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-display font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {item.step < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Loved by Creators
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of Indian creators who trust 12Labs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm mb-6">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.credits} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg glow' : 'border-border/50'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-display font-bold mb-2">
                    {plan.credits}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">Credits</div>
                  <div className="text-2xl font-bold mb-6">
                    ₹{plan.price}
                  </div>
                  <ul className="text-sm space-y-2 mb-6">
                    <li className="flex items-center gap-2 justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      All AI Tools Access
                    </li>
                    <li className="flex items-center gap-2 justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      No Expiry
                    </li>
                  </ul>
                  <Link to="/buy-credits">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Buy Credits
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/buy-credits" className="text-primary hover:underline text-sm">
              View all pricing options →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Create Amazing Content?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join 10,000+ creators and start your AI content journey today.
            </p>
            <Link to="/login">
              <Button size="lg" className="gap-2 px-8 glow">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
