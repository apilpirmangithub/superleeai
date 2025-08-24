import { ParseResult, SwapPlan } from '@/types/agents';
import { getTokenAddress } from '@/lib/tokens';

export class SwapParser {
  parseSwapPrompt(prompt: string): ParseResult {
    const cleanPrompt = prompt.toLowerCase().replace(/[,]/g, '.');

    // Extract amount
    const amountMatch = cleanPrompt.match(/(\d+(?:\.\d+)?)/);
    if (!amountMatch) {
      return {
        type: 'incomplete',
        question: 'How much do you want to swap? Please specify an amount. Example: "Swap 1 WIP > USDC"'
      };
    }

    const amount = parseFloat(amountMatch[1]);

    // Extract tokens
    const { tokenIn, tokenOut } = this.extractTokens(cleanPrompt);
    
    if (!tokenIn || !tokenOut) {
      return {
        type: 'incomplete',
        question: 'Which tokens do you want to swap? Please use format: "amount TokenA > TokenB" or "amount TokenA -> TokenB"'
      };
    }

    // Extract slippage (optional)
    const slippageMatch = cleanPrompt.match(/slip(?:page)?\s*(\d+(?:\.\d+)?)/);
    const slippage = slippageMatch ? parseFloat(slippageMatch[1]) : 0.5;

    // Resolve token addresses
    const tokenInAddress = getTokenAddress(tokenIn);
    const tokenOutAddress = getTokenAddress(tokenOut);

    if (!tokenInAddress || !tokenOutAddress) {
      return {
        type: 'incomplete',
        question: `Cannot resolve token addresses. Please use known symbols (WIP, USDC, WETH) or provide full addresses (0x...)`
      };
    }

    return {
      type: 'complete',
      plan: {
        type: 'swap',
        amount,
        tokenIn: tokenInAddress,
        tokenOut: tokenOutAddress,
        slippage,
        description: `Swap ${amount} ${tokenIn.toUpperCase()} → ${tokenOut.toUpperCase()} (${slippage}% slippage)`
      } as SwapPlan
    };
  }

  private extractTokens(prompt: string): { tokenIn?: string, tokenOut?: string } {
    // Pattern: amount token > token or amount token -> token
    const patterns = [
      /(?:^|\s)(\w+)\s*(?:>|->|to|ke)\s*(\w+)(?:\s|$)/,
      /(?:^|\s)(\w+)\s*(?:untuk|for)\s*(\w+)(?:\s|$)/,
      /(0x[a-f0-9]{40})\s*(?:>|->)\s*(0x[a-f0-9]{40})/i
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match && match[1] !== match[2]) { // Ensure different tokens
        return {
          tokenIn: match[1].trim(),
          tokenOut: match[2].trim()
        };
      }
    }

    // Try alternative pattern for Indonesian
    const indonesianMatch = prompt.match(/tukar\s*(\d+(?:\.\d+)?)\s*(\w+)\s*(?:ke|untuk)\s*(\w+)/);
    if (indonesianMatch) {
      return {
        tokenIn: indonesianMatch[2],
        tokenOut: indonesianMatch[3]
      };
    }

    return {};
  }
}
```
