import { useReadContract, useWriteContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { erc20Abi } from '@/lib/abi/erc20';

export class BlockchainService {
  async needsApproval(tokenAddress: string, amount: number): Promise<boolean> {
    try {
      const { data: allowance } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [
          '0x', // owner address from useAccount
          process.env.NEXT_PUBLIC_PIPERX_AGGREGATOR as `0x${string}`
        ]
      });

      const requiredAmount = parseUnits(amount.toString(), 18);
      return BigInt(allowance?.toString() || '0') < requiredAmount;
    } catch (error) {
      console.error('Error checking allowance:', error);
      return true; // Assume approval needed if check fails
    }
  }

  async approveToken(tokenAddress: string, amount: number): Promise<any> {
    const { writeContract } = useWriteContract();
    
    return writeContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'approve',
      args: [
        process.env.NEXT_PUBLIC_PIPERX_AGGREGATOR as `0x${string}`,
        parseUnits(amount.toString(), 18)
      ]
    });
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
      const { data: balance } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`]
      });

      return formatUnits(BigInt(balance?.toString() || '0'), 18);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }
}
```
