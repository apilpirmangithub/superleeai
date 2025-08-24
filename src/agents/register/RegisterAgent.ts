import { BaseAgent } from '../core/BaseAgent';
import { RegisterParser } from './RegisterParser';
import { RegisterExecutor } from './RegisterExecutor';
import { AgentConfig, ParseResult, ExecutionPlan, ExecutionResult, AgentHelp, RegisterPlan } from '@/types/agents';

export class RegisterAgent extends BaseAgent {
  private parser: RegisterParser;
  private executor: RegisterExecutor;

  constructor(config: AgentConfig) {
    super(config);
    this.parser = new RegisterParser();
    this.executor = new RegisterExecutor();
  }

  canHandle(prompt: string): boolean {
    const registerKeywords = [
      'register', 'daftar', 'mint', 'create ip',
      'upload', 'simpan', 'save', 'buat ip'
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    return registerKeywords.some(keyword => lowerPrompt.includes(keyword));
  }

  async parse(prompt: string, image?: File): Promise<ParseResult> {
    return this.parser.parseRegisterPrompt(prompt, image);
  }

  async execute(plan: ExecutionPlan): Promise<ExecutionResult> {
    return this.executor.executeRegister(plan as RegisterPlan);
  }

  getHelp(): AgentHelp {
    return {
      agent: 'RegisterAgent',
      description: 'Registers IP (images + metadata) on Story Protocol via IPFS',
      examples: [
        'Register this image IP, title "Sunset" by-nc',
        'daftar gambar ini sebagai IP dengan judul "Mountains"',
        'create IP from image, license cc0',
        'mint IP with title "Art Work" description "Beautiful landscape"'
      ],
      parameters: [
        'image: file (required) - Image file to register',
        'title: string (required) - Title of the IP',
        'license: by|by-nc|cc0|arr (optional, default: by) - License type',
        'description: string (optional) - Description of the IP'
      ]
    };
  }
}
```
