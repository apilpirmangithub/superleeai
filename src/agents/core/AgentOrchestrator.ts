import { BaseAgent } from './BaseAgent';
import { SwapAgent } from '../swap/SwapAgent';
import { RegisterAgent } from '../register/RegisterAgent';
import { AgentResponse } from '@/types/agents';

export class AgentOrchestrator {
  private agents: BaseAgent[] = [];

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    this.agents = [
      new SwapAgent({
        name: 'SwapAgent',
        version: '1.0.0',
        capabilities: ['token_swap', 'dex_interaction'],
        priority: 1
      }),
      new RegisterAgent({
        name: 'RegisterAgent',
        version: '1.0.0',
        capabilities: ['ip_registration', 'ipfs_upload'],
        priority: 2
      })
    ];
  }

  async processPrompt(prompt: string, image?: File): Promise<AgentResponse> {
    if (!prompt.trim()) {
      return {
        type: 'error',
        message: 'Please provide a command. Type "help" for examples.',
        suggestions: this.getAllHelp()
      };
    }

    // Handle help command
    if (prompt.toLowerCase().includes('help')) {
      return {
        type: 'ask',
        message: 'Here are the available commands:',
        suggestions: this.getAllHelp()
      };
    }

    // Find capable agent
    const agent = this.findAgent(prompt);
    
    if (!agent) {
      return {
        type: 'error',
        message: 'I don\'t understand that command. Please try one of these:',
        suggestions: this.getAllHelp()
      };
    }

    try {
      // Parse the prompt
      const parseResult = await agent.parse(prompt, image);
      
      if (parseResult.type === 'incomplete') {
        return {
          type: 'ask',
          message: parseResult.question || 'Please provide more information.',
          agent: agent.getName()
        };
      }

      // Generate execution plan
      const plan = parseResult.plan!;
      
      return {
        type: 'plan',
        agent: agent.getName(),
        plan: plan,
        message: `Ready to execute: ${plan.description}`,
        execute: () => agent.execute(plan)
      };

    } catch (error) {
      console.error('Agent processing error:', error);
      return {
        type: 'error',
        message: `${agent.getName()} failed: ${error.message}`,
        agent: agent.getName()
      };
    }
  }

  private findAgent(prompt: string): BaseAgent | null {
    const capableAgents = this.agents.filter(agent => agent.canHandle(prompt));
    
    if (capableAgents.length === 0) return null;
    
    // Return agent with highest priority (lowest number)
    return capableAgents.sort((a, b) => a.getPriority() - b.getPriority())[0];
  }

  private getAllHelp() {
    return this.agents.map(agent => agent.getHelp());
  }

  getAgents(): BaseAgent[] {
    return [...this.agents];
  }
}
```
