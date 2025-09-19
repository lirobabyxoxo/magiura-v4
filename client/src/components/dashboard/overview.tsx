import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OverviewProps {
  guilds?: any[];
}

export default function Overview({ guilds }: OverviewProps) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Dashboard Overview</h3>
        <p className="text-muted-foreground">Monitor your bot's performance and server statistics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Servers</p>
                <p className="text-2xl font-bold" data-testid="stat-total-servers">
                  {guilds?.length || 0}
                </p>
              </div>
              <i className="fas fa-server text-primary text-xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Features</p>
                <p className="text-2xl font-bold" data-testid="stat-active-features">12</p>
              </div>
              <i className="fas fa-check-circle text-accent text-xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bot Status</p>
                <p className="text-lg font-semibold text-accent" data-testid="stat-bot-status">Online</p>
              </div>
              <i className="fas fa-circle text-accent text-xl"></i>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="flex flex-col items-center space-y-2 h-auto py-4" data-testid="button-setup-moderation">
              <i className="fas fa-shield-alt text-xl"></i>
              <span>Setup Moderation</span>
            </Button>
            <Button variant="secondary" className="flex flex-col items-center space-y-2 h-auto py-4" data-testid="button-configure-logging">
              <i className="fas fa-clipboard-list text-xl"></i>
              <span>Configure Logging</span>
            </Button>
            <Button variant="secondary" className="flex flex-col items-center space-y-2 h-auto py-4" data-testid="button-enable-tinder">
              <i className="fas fa-fire text-xl"></i>
              <span>Enable Tinder</span>
            </Button>
            <Button variant="secondary" className="flex flex-col items-center space-y-2 h-auto py-4" data-testid="button-change-language">
              <i className="fas fa-language text-xl"></i>
              <span>Change Language</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Server List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Servers</CardTitle>
        </CardHeader>
        <CardContent>
          {guilds && guilds.length > 0 ? (
            <div className="space-y-4">
              {guilds.map((guild) => (
                <div 
                  key={guild.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  data-testid={`guild-item-${guild.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      {guild.icon ? (
                        <img 
                          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                          alt={guild.name}
                          className="w-12 h-12 rounded-lg"
                        />
                      ) : (
                        <span className="text-primary-foreground font-bold">
                          {guild.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{guild.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {guild.memberCount || 'Unknown'} members
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" data-testid={`button-configure-${guild.id}`}>
                    Configure
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" data-testid="no-guilds">
              <i className="fas fa-server text-4xl text-muted-foreground mb-4"></i>
              <h4 className="text-lg font-semibold mb-2">No Servers Found</h4>
              <p className="text-muted-foreground">
                Add MAGIURA BOT to your Discord servers to start managing them here.
              </p>
              <Button className="mt-4" data-testid="button-add-to-server">
                <i className="fab fa-discord mr-2"></i>
                Add to Server
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
