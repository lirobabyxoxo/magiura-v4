import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Dashboard</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Configure all bot features through an intuitive web dashboard or directly in Discord.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <Card className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl">
          {/* Dashboard Header */}
          <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-primary-foreground text-sm"></i>
              </div>
              <span className="font-semibold">Server Dashboard</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <i className="fas fa-circle text-accent text-xs"></i>
              <span>Bot Online</span>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-muted/30 p-4 border-r border-border">
              <nav className="space-y-2">
                <a 
                  href="#" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground"
                  data-testid="nav-overview"
                >
                  <i className="fas fa-tachometer-alt"></i>
                  <span>Overview</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  data-testid="nav-moderation"
                >
                  <i className="fas fa-shield-alt"></i>
                  <span>Moderation</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  data-testid="nav-roleplay"
                >
                  <i className="fas fa-heart"></i>
                  <span>Roleplay</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  data-testid="nav-tinder"
                >
                  <i className="fas fa-fire"></i>
                  <span>Tinder System</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  data-testid="nav-marriage"
                >
                  <i className="fas fa-ring"></i>
                  <span>Marriage</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  data-testid="nav-logging"
                >
                  <i className="fas fa-clipboard-list"></i>
                  <span>Logging</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  data-testid="nav-settings"
                >
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </a>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Server Overview</h3>
                <p className="text-muted-foreground">Configure your bot settings and monitor server activity.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-secondary p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-2xl font-bold" data-testid="stat-members">1,234</p>
                    </div>
                    <i className="fas fa-users text-primary text-xl"></i>
                  </div>
                </div>
                <div className="bg-secondary p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Commands Used</p>
                      <p className="text-2xl font-bold" data-testid="stat-commands">5,678</p>
                    </div>
                    <i className="fas fa-terminal text-accent text-xl"></i>
                  </div>
                </div>
                <div className="bg-secondary p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Features</p>
                      <p className="text-2xl font-bold" data-testid="stat-features">12</p>
                    </div>
                    <i className="fas fa-check-circle text-green-400 text-xl"></i>
                  </div>
                </div>
              </div>

              {/* Configuration Sections */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-secondary p-6 rounded-lg border border-border">
                  <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button className="flex items-center justify-center space-x-2" data-testid="button-moderation-quick">
                      <i className="fas fa-shield-alt"></i>
                      <span>Moderation</span>
                    </Button>
                    <Button variant="secondary" className="flex items-center justify-center space-x-2" data-testid="button-logs-quick">
                      <i className="fas fa-clipboard-list"></i>
                      <span>Logs</span>
                    </Button>
                    <Button variant="secondary" className="flex items-center justify-center space-x-2" data-testid="button-tinder-quick">
                      <i className="fas fa-fire"></i>
                      <span>Tinder</span>
                    </Button>
                    <Button variant="secondary" className="flex items-center justify-center space-x-2" data-testid="button-language-quick">
                      <i className="fas fa-language"></i>
                      <span>Language</span>
                    </Button>
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="bg-secondary p-6 rounded-lg border border-border">
                  <h4 className="text-lg font-semibold mb-4">Feature Configuration</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Moderation Commands</p>
                        <p className="text-sm text-muted-foreground">Enable ban, kick, mute commands</p>
                      </div>
                      <Switch defaultChecked data-testid="switch-moderation" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Roleplay Commands</p>
                        <p className="text-sm text-muted-foreground">Enable anime GIF interactions</p>
                      </div>
                      <Switch defaultChecked data-testid="switch-roleplay" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Tinder System</p>
                        <p className="text-sm text-muted-foreground">Allow dating profiles and matching</p>
                      </div>
                      <Switch data-testid="switch-tinder" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marriage System</p>
                        <p className="text-sm text-muted-foreground">Enable marriage proposals and tracking</p>
                      </div>
                      <Switch defaultChecked data-testid="switch-marriage" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
