import { Injectable } from '@nestjs/common';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

@Injectable()
export class DesignPreviewService {
  private client: ImageGenerationClient;

  constructor() {
    const config = new Config();
    this.client = new ImageGenerationClient(config);
  }

  async generateDesignPreview(scheme: string) {
    const prompts = {
      'A': `Mobile puzzle game UI, magazine editorial style. Clean minimalist design with warm off-white background, soft natural lighting, generous white space, subtle paper texture, rounded corners, elegant typography. A 4x4 grid of puzzle pieces showing a scenic landscape, soft gradient borders on pieces, delicate drop shadows creating depth. Professional minimalist aesthetic, high quality UI design, magazine layout, refined and sophisticated.`,
      'B': `Mobile puzzle game UI, futuristic sci-fi style. Deep space blue background (#0a0e27), neon cyan (#00d4ff) and bright purple (#a855f7) accents, glowing neon borders, holographic glassmorphism effects, 3D floating buttons, laser lines and circuit patterns. A 4x4 grid of puzzle pieces showing a cyberpunk cityscape, neon glowing edges on pieces, particle effects, futuristic HUD elements. Cyberpunk aesthetic, high tech, glowing and vibrant.`,
      'C': `Mobile puzzle game UI, dynamic typography and narrative design. Modern clean layout with bento grid system, large dynamic text numbers showing progress, animated typography that responds to interaction, modular card-based layout. A 4x4 grid of puzzle pieces with text overlays, progress indicators, story fragments displayed in cards. Editorial design style, information-rich but organized, typographic hierarchy, modern magazine aesthetic.`,
      'D': `Mobile puzzle game UI, retro pixel art style. Classic 8-bit color palette, pixel-perfect icons, nostalgic pixel texture, retro pixel fonts, chunky rounded buttons. A 4x4 grid of puzzle pieces showing a pixel art landscape, pixelated borders, retro game UI elements, charming nostalgic aesthetic. High resolution pixel art, clean and crisp, classic arcade game feel.`,
      'E': `Mobile puzzle game UI, tactile 3D depth style. Layered design with floating 3D buttons, realistic drop shadows, frosted glass overlays, physical material textures, dimensional depth. A 4x4 grid of puzzle pieces showing a realistic scene, 3D beveled edges, tactile card-like pieces, soft ambient occlusion shadows. Premium realistic interface, depth and dimension, luxurious tactile feel.`
    };

    const prompt = prompts[scheme as keyof typeof prompts] || prompts['A'];

    try {
      const response = await this.client.generate({
        prompt,
        size: '2K',
        watermark: false
      });

      const helper = this.client.getResponseHelper(response);

      if (helper.success && helper.imageUrls.length > 0) {
        return {
          code: 200,
          msg: 'success',
          data: {
            imageUrl: helper.imageUrls[0]
          }
        };
      } else {
        return {
          code: 500,
          msg: 'Image generation failed',
          data: null,
          errors: helper.errorMessages
        };
      }
    } catch (error) {
      return {
        code: 500,
        msg: 'Error generating image',
        data: null,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
