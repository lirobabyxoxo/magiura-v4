import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Login() {
  const [, setLocation] = useLocation();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const handleDiscordLogin = () => {
    window.location.href = "/api/auth/discord";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <i className="fas fa-robot text-3xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            MAGIURA BOT
          </h1>
        </div>

        <Card className="glassmorphism">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Login to access your bot dashboard and manage your servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleDiscordLogin}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
              size="lg"
              data-testid="button-discord-login"
            >
              <i className="fab fa-discord mr-2"></i>
              Continue with Discord
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                By logging in, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-card/50 p-4 rounded-lg border border-border">
            <i className="fas fa-shield-alt text-primary text-xl mb-2"></i>
            <p className="text-sm">Moderation</p>
          </div>
          <div className="bg-card/50 p-4 rounded-lg border border-border">
            <i className="fas fa-heart text-pink-400 text-xl mb-2"></i>
            <p className="text-sm">Roleplay</p>
          </div>
          <div className="bg-card/50 p-4 rounded-lg border border-border">
            <i className="fas fa-fire text-accent text-xl mb-2"></i>
            <p className="text-sm">Tinder System</p>
          </div>
          <div className="bg-card/50 p-4 rounded-lg border border-border">
            <i className="fas fa-ring text-yellow-400 text-xl mb-2"></i>
            <p className="text-sm">Marriage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
