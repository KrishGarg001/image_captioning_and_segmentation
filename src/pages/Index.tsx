import ImageProcessor from '@/components/ImageProcessor';
import { Brain, Camera, Scissors } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="absolute inset-0 bg-gradient-accent opacity-50" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center shadow-glow">
                  <Brain className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-secondary border-2 border-primary rounded-full flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Vision Talk Segment
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered image analysis combining intelligent captioning and precise segmentation. 
              Upload any image to see our deep learning models in action.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Smart Captioning</span>
              </div>
              <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Background Removal</span>
              </div>
              <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Real-time Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <ImageProcessor />
      </div>
    </div>
  );
};

export default Index;
