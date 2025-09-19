import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: "fas fa-shield-alt",
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
    title: "Moderation",
    description: "Complete moderation suite with ban, kick, mute, and advanced permission management.",
    commands: ["ban", "kick", "mute"]
  },
  {
    icon: "fas fa-heart",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/20",
    title: "Roleplay",
    description: "Interactive roleplay commands with anime GIFs for enhanced server engagement.",
    commands: ["kiss", "hug", "pat"]
  },
  {
    icon: "fas fa-fire",
    iconColor: "text-accent",
    iconBg: "bg-accent/20",
    title: "Dating System",
    description: "Built-in Tinder-like system with profiles, likes, and match notifications.",
    commands: ["profiles", "matching"]
  },
  {
    icon: "fas fa-ring",
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/20",
    title: "Marriage System",
    description: "Create lasting bonds with marriage proposals, relationship tracking, and history.",
    commands: ["marry", "divorce"]
  },
  {
    icon: "fas fa-clipboard-list",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
    title: "Advanced Logging",
    description: "Comprehensive logging system for messages, member changes, and server events.",
    commands: ["messages", "members"]
  },
  {
    icon: "fas fa-tools",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/20",
    title: "Utility Tools",
    description: "Essential utility commands for user information, avatars, and message management.",
    commands: ["userinfo", "clear"]
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-card p-6 border border-border hover:border-primary/50 transition-colors"
              data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardContent className="p-0">
                <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                  <i className={`${feature.icon} ${feature.iconColor} text-xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.commands.map((command, cmdIndex) => (
                    <Badge 
                      key={cmdIndex} 
                      variant="secondary"
                      className="bg-muted"
                      data-testid={`badge-command-${command}`}
                    >
                      {command}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
