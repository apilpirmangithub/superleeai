import { BaseAgent } from '../core/BaseAgent';
import { SwapParser } from './SwapParser';
import { SwapExecutor } from './SwapExecutor';
import { AgentConfig, ParseResult, ExecutionPlan, ExecutionResult, AgentHelp, SwapPlan } from '@/types/agents';

export class SwapAgent extends BaseAgent {
  private parser: SwapParser;
  private executor: SwapExecutor;

  constructor(config: AgentConfig) {
    super(config);
    this.parser = new SwapParser();
    this.executor = new SwapExecutor();
  }

  canHandle(prompt: string): boolean {
    const swapKeywords = [
      'swap', 'tukar', 'exchange', 'trade', 'convert',
      '->', '>', 'to', 'ke', 'for', 'dengan'
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    return swapKeywords.some(keyword => lowerPrompt.includes(keyword));
  }

  async parse(prompt: string, image?: File): Promise<ParseResult> {
    return this.parser.parseSwapPrompt(prompt);
  }

  async execute(plan: ExecutionPlan): Promise<ExecutionResult> {
    return this.executor.executeSwap(plan as SwapPlan);
  }

  getHelp(): AgentHelp {
    return {
      agent: 'SwapAgent',
      description: 'Handles token swapping on Story Chain via PiperX Aggregator',
      examples: [
        'Swap 1 WIP > USDC slippage 0.5%',
        'tukar 0.25 ip ke usdc slip 1%',
        'exchange 2 0x123... -> 0x456...',
        'swap 5 WIP to USDC with 1% slippage'
      ],
      parameters: [
        'amount: number (required) - Amount to swap',
        'tokenIn: symbol/address (required) - Token to sell',
        'tokenOut: symbol/address (required) - Token to buy',
        'slippage: percentage (optional, default 0.5%) - Max slippage tolerance'
      ]
    };
  }
}
```
