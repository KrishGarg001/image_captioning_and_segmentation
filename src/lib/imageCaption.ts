import { pipeline, env } from '@huggingface/transformers';


env.allowLocalModels = false;
env.useBrowserCache = false;

let captioner: any = null;

const initializeCaptioner = async () => {
  if (!captioner) {
    console.log('Initializing image captioning model...');
    captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning', {
      device: 'webgpu',
    });
    console.log('Image captioning model loaded');
  }
  return captioner;
};

export const generateImageCaption = async (imageElement: HTMLImageElement): Promise<string> => {
  try {
    const model = await initializeCaptioner();
    
    // Convert image to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image for optimal processing
    const maxSize = 384;
    let { width, height } = imageElement;
    
    if (width > maxSize || height > maxSize) {
      if (width > height) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imageElement, 0, 0, width, height);
    
    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    console.log('Generating caption...');
    const result = await model(imageData);
    
    console.log('Caption result:', result);
    
    if (result && result[0] && result[0].generated_text) {
      return result[0].generated_text;
    }
    
    return 'Unable to generate caption for this image.';
  } catch (error) {
    console.error('Error generating caption:', error);
    return 'Error generating caption. The image may be too complex or the model failed to load.';
  }
};