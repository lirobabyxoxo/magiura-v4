import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <header className="border-b border-border sticky top-0 z-50 glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-primary-foreground text-sm"></i>
            </div>
            <span className="text-xl font-bold">MAGIURA BOT</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-features"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('commands')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-commands"
            >
              Commands
            </button>
            <button 
              onClick={() => scrollToSection('dashboard')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-dashboard"
            >
              Dashboard
            </button>
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-login-discord"
            >
              <a href="/login">
                <i className="fab fa-discord mr-2"></i>Login with Discord
              </a>
            </Button>
          </nav>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <i className="fas fa-bars text-xl"></i>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors p-2"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('commands')}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors p-2"
                >
                  Commands
                </button>
                <button 
                  onClick={() => scrollToSection('dashboard')}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors p-2"
                >
                  Dashboard
                </button>
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground justify-start"
                >
                  <a href="/login">
                    <i className="fab fa-discord mr-2"></i>Login with Discord
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
