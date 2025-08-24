import { ParseResult, RegisterPlan } from '@/types/agents';

export class RegisterParser {
  private licenseMap = new Map([
    ['by', 'Attribution'],
    ['by-nc', 'Attribution-NonCommercial'],
    ['cc0', 'CC0'],
    ['arr', 'All Rights Reserved']
  ]);

  parseRegisterPrompt(prompt: string, image?: File): ParseResult {
    if (!image) {
      return {
        type: 'incomplete',
        question: 'Please attach an image file to register as IP. Use the 📎 button to attach your image.'
      };
    }

    // Extract title
    const titleMatch = prompt.match(/title\s*["']([^"']+)["']/i) || 
                      prompt.match(/judul\s*["']([^"']+)["']/i);
    
    if (!titleMatch) {
      return {
        type: 'incomplete', 
        question: 'Please provide a title for your IP. Format: title "Your Title" or judul "Judul Anda"'
      };
    }

    const title = titleMatch[1];

    // Extract license (optional)
    const licenseMatch = prompt.match(/(by-nc|by|cc0|arr)/i);
    const license = licenseMatch ? 
      this.licenseMap.get(licenseMatch[1].toLowerCase()) || 'Attribution' : 
      'Attribution';

    // Extract description (optional)
    const descMatch = prompt.match(/(?:desc|description|deskripsi)\s*["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1] : '';

    return {
      type: 'complete',
      plan: {
        type: 'register',
        title,
        license,
        description,
        image,
        metadata: {
          creator: '', // Will be filled from wallet
          created: new Date().toISOString(),
          aiPrompt: prompt
        },
        description: `Register "${title}" as IP with ${license} license`
      } as RegisterPlan
    };
  }
}
```
