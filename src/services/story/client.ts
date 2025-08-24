import { StoryClient } from '@story-protocol/core-sdk';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

export class StoryService {
  private client: StoryClient | null = null;

  private async getClient() {
    if (!this.client) {
      const { data: walletClient } = useWalletClient();
      const publicClient = usePublicClient();

      this.client = StoryClient.newClient({
        chainId: parseInt(process.env.NEXT_PUBLIC_STORY_CHAIN_ID!),
        rpcUrl: process.env.NEXT_PUBLIC_STORY_RPC!,
        wallet: walletClient,
        publicClient: publicClient
      });
    }
    return this.client;
  }

  async registerIP({
    metadataUri,
    title,
    description
  }: {
    metadataUri: string;
    title: string;
    description: string;
  }): Promise<any> {
    try {
      const client = await this.getClient();
      const { address } = useAccount();

      const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: process.env.NEXT_PUBLIC_SPG_CONTRACT!, // SPG collection address
        pilType: 'non-commercial-social-remixing',
        metadata: {
          metadataURI: metadataUri,
          nftMetadata: {
            name: title,
            description: description,
            image: metadataUri
          }
        },
        recipient: address!
      });

      return {
        ipId: response.ipId,
        txHash: response.txHash,
        wait: () => response.txHash // Return transaction hash for waiting
      };
    } catch (error) {
      console.error('Story IP registration error:', error);
      throw new Error('Failed to register IP on Story Protocol');
    }
  }
}
```
