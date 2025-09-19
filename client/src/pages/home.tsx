import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import DashboardPreview from "@/components/dashboard-preview";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      
      {/* Language Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Multi-Language Support</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Available in Portuguese (PT-BR) and English with easy language switching.
          </p>
          <div className="flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">BR</span>
              </div>
              <span>Português (Brasil)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">EN</span>
              </div>
              <span>English</span>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
