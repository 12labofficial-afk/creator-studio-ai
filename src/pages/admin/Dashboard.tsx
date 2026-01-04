import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CreditCard, 
  Settings,
  TrendingUp,
  Mic2,
  FileText,
  Image,
  Search,
  Shield
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: TrendingUp },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Users", value: "12,543", change: "+12%", icon: Users, color: "text-blue-500" },
  { label: "Revenue (This Month)", value: "₹4,56,789", change: "+8%", icon: CreditCard, color: "text-green-500" },
  { label: "Voiceovers Generated", value: "45,678", change: "+24%", icon: Mic2, color: "text-purple-500" },
  { label: "Scripts Created", value: "23,456", change: "+18%", icon: FileText, color: "text-orange-500" },
];

const recentActivity = [
  { user: "rahul@gmail.com", action: "Generated voiceover", credits: 25, time: "2 min ago" },
  { user: "priya@gmail.com", action: "Purchased 500 credits", credits: 0, time: "5 min ago" },
  { user: "amit@gmail.com", action: "Created script", credits: 20, time: "12 min ago" },
  { user: "sneha@gmail.com", action: "Generated thumbnail", credits: 10, time: "18 min ago" },
  { user: "vikram@gmail.com", action: "Generated SEO pack", credits: 5, time: "25 min ago" },
];

export default function AdminDashboard() {
  const location = useLocation();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-lg">Admin Panel</span>
              </div>
              <nav className="space-y-1">
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-secondary"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of your platform's performance
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="border-border/50">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                        <Badge variant="secondary" className="text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts & Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Chart Placeholder */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-secondary/30 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Chart visualization</p>
                      <p className="text-xs">(Coming soon)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium text-sm">{activity.user}</div>
                          <div className="text-xs text-muted-foreground">
                            {activity.action}
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.credits > 0 && (
                            <Badge variant="secondary" className="mb-1">
                              -{activity.credits} credits
                            </Badge>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Voiceovers Today", value: 234, icon: Mic2 },
                { label: "Scripts Today", value: 156, icon: FileText },
                { label: "Thumbnails Today", value: 89, icon: Image },
                { label: "SEO Packs Today", value: 312, icon: Search },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <Icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-xl font-bold">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
