import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Mic2, 
  FileText, 
  Image, 
  Search, 
  Menu, 
  X,
  Sparkles,
  User,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/studio", label: "Voice Studio", icon: Mic2 },
  { href: "/script-generator", label: "Script AI", icon: FileText },
  { href: "/thumbnail-generator", label: "Thumbnails", icon: Image },
  { href: "/seo-kit", label: "SEO Kit", icon: Search },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = false; // TODO: Replace with actual auth state

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 rounded-lg bg-primary flex items-center justify-center glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">
              12Labs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link key={link.href} to={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2 transition-all duration-200",
                      isActive && "bg-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/buy-credits">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>250 Credits</span>
                  </Button>
                </Link>
                <Link to="/history">
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button className="gap-2">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="border-t border-border/50 pt-3 mt-2">
                {isLoggedIn ? (
                  <>
                    <Link to="/buy-credits" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full mb-2 gap-2">
                        <Sparkles className="w-4 h-4" />
                        250 Credits
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full gap-2">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full gap-2">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
