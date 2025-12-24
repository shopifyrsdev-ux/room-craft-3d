import { Button } from '@/components/ui/button';
import { ArrowRight, Box, Palette, Move3D } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Box className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">RoomForge</span>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 border border-border">
              Design with precision. Visualize in 3D.
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Design your room in 3D
            <span className="block gradient-text mt-2">before you spend a single rupee</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Create accurate, true-to-scale room layouts with furniture placement. 
            See exactly how your space will look before making any purchases.
          </p>

          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              variant="hero" 
              size="xl" 
              onClick={onStart}
              className="group"
            >
              Start Designing
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </main>

        {/* How it works */}
        <section className="mt-32 max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-center mb-16 animate-fade-in">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Box,
                step: '01',
                title: 'Enter Dimensions',
                description: 'Input your room\'s width, length, and height. We\'ll generate a true-to-scale 3D model.',
              },
              {
                icon: Move3D,
                step: '02',
                title: 'Add Furniture',
                description: 'Drag and drop furniture from our library. Move, rotate, and position with precision.',
              },
              {
                icon: Palette,
                step: '03',
                title: 'Customize & Visualize',
                description: 'Apply colors to walls and floors. See your complete room design come to life.',
              },
            ].map((item, index) => (
              <div 
                key={item.step}
                className="glass-panel p-8 animate-slide-up hover:border-primary/30 transition-colors"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-4xl font-display font-bold text-muted-foreground/30">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 text-center text-muted-foreground text-sm">
          <p>Built for architects, interior designers, and anyone planning their space.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
