import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <i className="fas fa-robot text-3xl text-white"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            MAGIURA BOT
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The ultimate Discord bot with moderation, roleplay, social features, and comprehensive server management tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg shadow-lg"
              data-testid="button-add-discord"
            >
              <i className="fab fa-discord mr-2"></i>Add to Discord
            </Button>
            <Button 
              variant="outline"
              size="lg"
              asChild
              className="border-border hover:bg-secondary/80 px-8 py-3 text-lg"
              data-testid="button-view-dashboard"
            >
              <a href="/dashboard">
                <i className="fas fa-cog mr-2"></i>View Dashboard
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
