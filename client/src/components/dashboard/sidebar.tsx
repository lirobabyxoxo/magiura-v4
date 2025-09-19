import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  { id: "overview", icon: "fas fa-tachometer-alt", label: "Overview" },
  { id: "moderation", icon: "fas fa-shield-alt", label: "Moderation" },
  { id: "roleplay", icon: "fas fa-heart", label: "Roleplay" },
  { id: "tinder", icon: "fas fa-fire", label: "Tinder System" },
  { id: "marriage", icon: "fas fa-ring", label: "Marriage" },
  { id: "logging", icon: "fas fa-clipboard-list", label: "Logging" },
  { id: "settings", icon: "fas fa-cog", label: "Settings" },
];

export default function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  return (
    <div className="w-64 bg-muted/30 p-4 border-r border-border min-h-screen">
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors",
              activeSection === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            data-testid={`sidebar-${item.id}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
