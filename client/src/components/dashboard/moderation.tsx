import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Moderation() {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Moderation Settings</h3>
        <p className="text-muted-foreground">Configure moderation features and permissions.</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Moderation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Enable Moderation Commands</Label>
                <p className="text-sm text-muted-foreground">Allow ban, kick, mute, and other moderation commands</p>
              </div>
              <Switch defaultChecked data-testid="switch-moderation-enabled" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-Moderation</Label>
                <p className="text-sm text-muted-foreground">Automatically moderate spam and inappropriate content</p>
              </div>
              <Switch data-testid="switch-auto-moderation" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Require Reason</Label>
                <p className="text-sm text-muted-foreground">Require moderators to provide reasons for actions</p>
              </div>
              <Switch defaultChecked data-testid="switch-require-reason" />
            </div>
          </CardContent>
        </Card>

        {/* Logging Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Moderation Logging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mod-log-channel">Moderation Log Channel</Label>
              <div className="flex space-x-2 mt-2">
                <Input 
                  id="mod-log-channel"
                  placeholder="#mod-logs"
                  data-testid="input-mod-log-channel"
                />
                <Button variant="outline" data-testid="button-select-channel">
                  Select Channel
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Channel where moderation actions will be logged
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Log All Actions</Label>
                <p className="text-sm text-muted-foreground">Log bans, kicks, mutes, and warnings</p>
              </div>
              <Switch defaultChecked data-testid="switch-log-all-actions" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Log Auto-Mod Actions</Label>
                <p className="text-sm text-muted-foreground">Log automatic moderation actions</p>
              </div>
              <Switch data-testid="switch-log-auto-actions" />
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Moderator Roles</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Roles that can use moderation commands
              </p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="@Moderator"
                  data-testid="input-mod-roles"
                />
                <Button variant="outline" data-testid="button-add-mod-role">
                  Add Role
                </Button>
              </div>
            </div>

            <div>
              <Label>Admin Roles</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Roles with full moderation access
              </p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="@Admin"
                  data-testid="input-admin-roles"
                />
                <Button variant="outline" data-testid="button-add-admin-role">
                  Add Role
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-Moderation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-Moderation Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Anti-Spam</Label>
                <p className="text-sm text-muted-foreground">Prevent message spam and repeated content</p>
              </div>
              <Switch data-testid="switch-anti-spam" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Anti-Raid</Label>
                <p className="text-sm text-muted-foreground">Protect against server raids and mass joins</p>
              </div>
              <Switch data-testid="switch-anti-raid" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Filter Bad Words</Label>
                <p className="text-sm text-muted-foreground">Automatically filter inappropriate language</p>
              </div>
              <Switch data-testid="switch-word-filter" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Filter Invites</Label>
                <p className="text-sm text-muted-foreground">Block Discord server invites</p>
              </div>
              <Switch data-testid="switch-invite-filter" />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button data-testid="button-save-moderation">
            <i className="fas fa-save mr-2"></i>
            Save Changes
          </Button>
          <Button variant="outline" data-testid="button-reset-moderation">
            <i className="fas fa-undo mr-2"></i>
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
}
