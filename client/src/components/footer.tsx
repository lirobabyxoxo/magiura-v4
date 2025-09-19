export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-primary-foreground text-sm"></i>
              </div>
              <span className="text-xl font-bold">MAGIURA BOT</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              The ultimate Discord bot for moderation, roleplay, and social features. Created by lirolegal.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-discord"
              >
                <i className="fab fa-discord text-xl"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-github"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-twitter"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Moderation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Roleplay</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Tinder System</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Marriage</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Logging</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Discord Server</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Commands</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 MAGIURA BOT. Created by lirolegal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
