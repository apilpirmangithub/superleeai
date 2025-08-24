import { ExecutionResult, SwapPlan } from '@/types/agents';
import { PiperXService } from '@/services/piperx/client';
import { BlockchainService } from '@/services/blockchain/contracts';

export class SwapExecutor {
  private piperx: PiperXService;
  private blockchain: BlockchainService;

  constructor() {
    this.piperx = new PiperXService();
    this.blockchain = new BlockchainService();
  }

  async executeSwap(plan: SwapPlan): Promise<ExecutionResult> {
    try {
      // 1. Get quote from PiperX
      const quote = await this.piperx.getQuote({
        tokenIn: plan.tokenIn,
        tokenOut: plan.tokenOut,
        amount: plan.amount,
        slippage: plan.slippage
      });

      if (!quote.routes || quote.routes.length === 0) {
        return {
          type: 'error',
          message: 'No swap routes available for this token pair.'
        };
      }

      // 2. Check and approve token if needed
      const needsApproval = await this.blockchain.needsApproval(
        plan.tokenIn,
        plan.amount
      );

      if (needsApproval) {
        const approvalTx = await this.blockchain.approveToken(
          plan.tokenIn,
          plan.amount
        );
        await approvalTx.wait();
      }

      // 3. Execute swap
      const swapTx = await this.piperx.executeSwap(quote.routes);
      const receipt = await swapTx.wait();

      return {
        type: 'success',
        transaction: receipt,
        data: {
          amountIn: plan.amount,
          amountOut: quote.amountOut,
          tokenIn: plan.tokenIn,
          tokenOut: plan.tokenOut,
          txHash: receipt.hash,
          priceImpact: quote.priceImpact
        },
        message: `✅ Swap successful! ${plan.amount} → ${quote.amountOut} tokens`
      };

    } catch (error) {
      console.error('Swap execution error:', error);
      return {
        type: 'error',
        message: `Swap failed: ${error.message}`,
        error
      };
    }
  }
}
```
