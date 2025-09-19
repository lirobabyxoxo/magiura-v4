import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FeaturesConfigProps {
  feature: string;
}

export default function FeaturesConfig({ feature }: FeaturesConfigProps) {
  const getFeatureConfig = () => {
    switch (feature) {
      case "roleplay":
        return {
          title: "Roleplay Settings",
          description: "Configure roleplay commands and anime GIF interactions",
          icon: "fas fa-heart",
          color: "text-pink-400",
        };
      case "tinder":
        return {
          title: "Tinder System",
          description: "Configure the dating and matching system",
          icon: "fas fa-fire",
          color: "text-accent",
        };
      case "marriage":
        return {
          title: "Marriage System",
          description: "Configure marriage proposals and relationship tracking",
          icon: "fas fa-ring",
          color: "text-yellow-400",
        };
      case "logging":
        return {
          title: "Logging System",
          description: "Configure server event logging and monitoring",
          icon: "fas fa-clipboard-list",
          color: "text-blue-400",
        };
      case "settings":
        return {
          title: "General Settings",
          description: "Configure bot prefix, language, and general options",
          icon: "fas fa-cog",
          color: "text-purple-400",
        };
      default:
        return {
          title: "Feature Settings",
          description: "Configure this feature",
          icon: "fas fa-cog",
          color: "text-gray-400",
        };
    }
  };

  const config = getFeatureConfig();

  const renderFeatureContent = () => {
    switch (feature) {
      case "roleplay":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Roleplay Commands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Enable Roleplay Commands</Label>
                    <p className="text-sm text-muted-foreground">Allow kiss, hug, pat, slap, kill commands</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-roleplay-enabled" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Anime GIFs</Label>
                    <p className="text-sm text-muted-foreground">Use anime GIFs for roleplay interactions</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-anime-gifs" />
                </div>

                <div>
                  <Label htmlFor="roleplay-channel">Roleplay Channel Restriction</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input 
                      id="roleplay-channel"
                      placeholder="#roleplay (optional)"
                      data-testid="input-roleplay-channel"
                    />
                    <Button variant="outline" data-testid="button-select-roleplay-channel">
                      Select Channel
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Restrict roleplay commands to specific channels (leave empty for all channels)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "tinder":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tinder System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Enable Tinder System</Label>
                    <p className="text-sm text-muted-foreground">Allow members to create dating profiles</p>
                  </div>
                  <Switch data-testid="switch-tinder-enabled" />
                </div>

                <div>
                  <Label htmlFor="min-age">Minimum Age</Label>
                  <Input 
                    id="min-age"
                    type="number"
                    defaultValue="18"
                    min="18"
                    max="99"
                    className="w-24 mt-1"
                    data-testid="input-min-age"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Minimum age required for Tinder profiles
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Match Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send DM notifications for matches</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-match-notifications" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "marriage":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marriage System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Enable Marriage System</Label>
                    <p className="text-sm text-muted-foreground">Allow members to propose and marry</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-marriage-enabled" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Marriage History</Label>
                    <p className="text-sm text-muted-foreground">Track marriage history and divorces</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-marriage-history" />
                </div>

                <div>
                  <Label htmlFor="marriage-channel">Marriage Announcement Channel</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input 
                      id="marriage-channel"
                      placeholder="#announcements (optional)"
                      data-testid="input-marriage-channel"
                    />
                    <Button variant="outline" data-testid="button-select-marriage-channel">
                      Select Channel
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Channel for marriage announcements (leave empty to disable)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "logging":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logging Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="log-messages">Message Logs</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input 
                      id="log-messages"
                      placeholder="#message-logs"
                      data-testid="input-log-messages"
                    />
                    <Button variant="outline" data-testid="button-select-message-log">
                      Select Channel
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Channel for message edit/delete logs
                  </p>
                </div>

                <div>
                  <Label htmlFor="log-members">Member Logs</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input 
                      id="log-members"
                      placeholder="#member-logs"
                      data-testid="input-log-members"
                    />
                    <Button variant="outline" data-testid="button-select-member-log">
                      Select Channel
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Channel for member join/leave and nickname changes
                  </p>
                </div>

                <div>
                  <Label htmlFor="log-server">Server Logs</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input 
                      id="log-server"
                      placeholder="#server-logs"
                      data-testid="input-log-server"
                    />
                    <Button variant="outline" data-testid="button-select-server-log">
                      Select Channel
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Channel for server events (channels, roles, invites)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logging Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Message Edits</Label>
                    <p className="text-sm text-muted-foreground">Log when messages are edited</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-log-edits" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Message Deletes</Label>
                    <p className="text-sm text-muted-foreground">Log when messages are deleted</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-log-deletes" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Member Changes</Label>
                    <p className="text-sm text-muted-foreground">Log nickname and avatar changes</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-log-member-changes" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bot-prefix">Bot Prefix</Label>
                  <Input 
                    id="bot-prefix"
                    defaultValue="."
                    className="w-24 mt-1"
                    data-testid="input-bot-prefix"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Prefix for bot commands (default: .)
                  </p>
                </div>

                <div>
                  <Label htmlFor="bot-language">Bot Language</Label>
                  <Select defaultValue="pt-BR">
                    <SelectTrigger className="w-48 mt-1" data-testid="select-bot-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Language for bot responses and embeds
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Developer Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable additional debugging features</p>
                  </div>
                  <Switch data-testid="switch-developer-mode" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Embed Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Black Embeds</Label>
                    <p className="text-sm text-muted-foreground">Use black-themed embeds (default)</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-black-embeds" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Minimal Emojis</Label>
                    <p className="text-sm text-muted-foreground">Use minimal emojis in responses</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-minimal-emojis" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Creator Footer</Label>
                    <p className="text-sm text-muted-foreground">Show "created by lirolegal" footer in util commands</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-creator-footer" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Feature Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This feature configuration panel is being developed.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <i className={`${config.icon} ${config.color} text-2xl`}></i>
          <h3 className="text-2xl font-bold">{config.title}</h3>
        </div>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      {renderFeatureContent()}

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-8">
        <Button data-testid={`button-save-${feature}`}>
          <i className="fas fa-save mr-2"></i>
          Save Changes
        </Button>
        <Button variant="outline" data-testid={`button-reset-${feature}`}>
          <i className="fas fa-undo mr-2"></i>
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
