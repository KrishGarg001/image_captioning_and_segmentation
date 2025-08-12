import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon, Sparkles, Scissors } from 'lucide-react';
import { removeBackground, loadImage } from '@/lib/backgroundRemoval';
import { generateImageCaption } from '@/lib/imageCaption';

interface ProcessedImage {
  original: string;
  segmented: string;
  caption: string;
}

export default function ImageProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    setSelectedFile(file);
    setProcessedImage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setCurrentStep('Loading image...');

    try {
      // Load the image
      const imageElement = await loadImage(selectedFile);
      const originalUrl = URL.createObjectURL(selectedFile);
      setProgress(20);

      // Generate caption
      setCurrentStep('Generating caption...');
      const caption = await generateImageCaption(imageElement);
      setProgress(50);

      // Remove background
      setCurrentStep('Segmenting image...');
      const segmentedBlob = await removeBackground(imageElement);
      const segmentedUrl = URL.createObjectURL(segmentedBlob);
      setProgress(100);

      setProcessedImage({
        original: originalUrl,
        segmented: segmentedUrl,
        caption
      });

      setCurrentStep('Complete!');
      toast.success('Image processed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Upload Section */}
      <Card className="p-8 bg-gradient-to-br from-card to-secondary/50 border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-300">
        <div
          className="flex flex-col items-center justify-center space-y-4 min-h-[200px]"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center shadow-glow">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Upload an Image</h3>
            <p className="text-muted-foreground max-w-md">
              Drag and drop an image here, or click to select one. We'll generate a caption and segment the image for you.
            </p>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose Image
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />

          {selectedFile && (
            <div className="mt-4 p-4 bg-secondary rounded-lg border">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Process Button */}
      {selectedFile && !isProcessing && !processedImage && (
        <div className="flex justify-center">
          <Button
            onClick={processImage}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 px-8"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Process Image
          </Button>
        </div>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Processing Image</h3>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">{currentStep}</p>
          </div>
        </Card>
      )}

      {/* Results */}
      {processedImage && (
        <div className="space-y-6">
          {/* Caption */}
          <Card className="p-6 bg-gradient-to-r from-card to-secondary/30">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Generated Caption</h3>
                <p className="text-foreground/90 leading-relaxed">{processedImage.caption}</p>
              </div>
            </div>
          </Card>

          {/* Image Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Original Image</h3>
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img
                  src={processedImage.original}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Segmented Image</h3>
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-secondary to-muted" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 0%, transparent 50%), 
                                radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`
              }}>
                <img
                  src={processedImage.segmented}
                  alt="Segmented"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}