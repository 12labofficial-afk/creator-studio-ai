import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  Shield,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 199,
    pricePerCredit: 1.99,
    features: [
      "All AI Tools Access",
      "Standard Quality Voices",
      "Email Support",
      "No Expiry",
    ],
    popular: false,
    icon: Sparkles,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 500,
    price: 799,
    pricePerCredit: 1.60,
    features: [
      "All AI Tools Access",
      "Premium HD Voices",
      "Priority Support",
      "No Expiry",
      "Bulk Download",
    ],
    popular: true,
    icon: Zap,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 2000,
    price: 2499,
    pricePerCredit: 1.25,
    features: [
      "All AI Tools Access",
      "Premium HD Voices",
      "Dedicated Support",
      "No Expiry",
      "API Access",
      "Custom Voices",
    ],
    popular: false,
    icon: Crown,
  },
];

const creditCosts = [
  { feature: "1 min Voiceover", credits: "10-15" },
  { feature: "Script (1000 words)", credits: "20" },
  { feature: "Thumbnail", credits: "10" },
  { feature: "SEO Pack", credits: "5" },
];

export default function BuyCredits() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePurchase = (planId: string) => {
    // TODO: Implement Razorpay payment
    console.log("Purchasing plan:", planId);
    setSelectedPlan(planId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Coins className="w-4 h-4 mr-1" />
            Credit Packs
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pay once, use forever. No subscriptions, no hidden fees. Credits never expire.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105 z-10' 
                    : 'border-border/50 hover:-translate-y-1'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                    plan.popular ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <div className="text-5xl font-display font-bold mb-1">
                      {plan.credits}
                    </div>
                    <div className="text-sm text-muted-foreground">Credits</div>
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-bold">
                      ₹{plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ₹{plan.pricePerCredit.toFixed(2)} per credit
                    </div>
                  </div>

                  <ul className="text-sm space-y-3 mb-8 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePurchase(plan.id)}
                  >
                    Buy Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Credit Usage Guide */}
        <Card className="max-w-3xl mx-auto border-border/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              Credit Usage Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {creditCosts.map((item) => (
                <div 
                  key={item.feature}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                >
                  <span className="font-medium">{item.feature}</span>
                  <Badge variant="secondary">{item.credits} credits</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <div className="font-medium">Secure Payments</div>
              <div className="text-sm text-muted-foreground">Powered by Razorpay</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-500" />
              </div>
              <div className="font-medium">7-Day Refund</div>
              <div className="text-sm text-muted-foreground">No questions asked</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <div className="font-medium">Never Expires</div>
              <div className="text-sm text-muted-foreground">Use anytime</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
