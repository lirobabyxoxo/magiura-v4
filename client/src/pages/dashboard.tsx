import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/dashboard/sidebar";
import Overview from "@/components/dashboard/overview";
import Moderation from "@/components/dashboard/moderation";
import FeaturesConfig from "@/components/dashboard/features-config";

type DashboardSection = "overview" | "moderation" | "roleplay" | "tinder" | "marriage" | "logging" | "settings";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const { toast } = useToast();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: guilds, isLoading: guildsLoading } = useQuery({
    queryKey: ["/api/dashboard/guilds"],
    enabled: !!user,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to access the dashboard.
            </p>
            <Button asChild data-testid="button-login">
              <a href="/login">Login with Discord</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <Overview guilds={guilds} />;
      case "moderation":
        return <Moderation />;
      case "roleplay":
        return <FeaturesConfig feature="roleplay" />;
      case "tinder":
        return <FeaturesConfig feature="tinder" />;
      case "marriage":
        return <FeaturesConfig feature="marriage" />;
      case "logging":
        return <FeaturesConfig feature="logging" />;
      case "settings":
        return <FeaturesConfig feature="settings" />;
      default:
        return <Overview guilds={guilds} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 glassmorphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-primary-foreground text-sm"></i>
              </div>
              <span className="text-xl font-bold">MAGIURA BOT</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <i className="fas fa-circle text-accent text-xs"></i>
                <span>Bot Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
