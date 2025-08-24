import { ExecutionResult, RegisterPlan } from '@/types/agents';
import { IPFSService } from '@/services/ipfs/client';
import { StoryService } from '@/services/story/client';
import { useAccount } from 'wagmi';

export class RegisterExecutor {
  private ipfs: IPFSService;
  private story: StoryService;

  constructor() {
    this.ipfs = new IPFSService();
    this.story = new StoryService();
  }

  async executeRegister(plan: RegisterPlan): Promise<ExecutionResult> {
    try {
      // 1. Upload image to IPFS
      const imageResult = await this.ipfs.uploadFile(plan.image);
      
      if (!imageResult.success) {
        return {
          type: 'error',
          message: 'Failed to upload image to IPFS'
        };
      }

      // 2. Create metadata JSON
      const metadata = {
        name: plan.title,
        description: plan.description,
        image: imageResult.url,
        license: plan.license,
        creator: plan.metadata.creator,
        created: plan.metadata.created,
        aiPrompt: plan.metadata.aiPrompt,
        attributes: [
          { trait_type: "License", value: plan.license },
          { trait_type: "Creator", value: plan.metadata.creator },
          { trait_type: "AI Generated", value: "true" },
          { trait_type: "Created", value: plan.metadata.created }
        ]
      };

      // 3. Upload metadata to IPFS
      const metadataResult = await this.ipfs.uploadJSON(metadata);
      
      if (!metadataResult.success) {
        return {
          type: 'error',
          message: 'Failed to upload metadata to IPFS'
        };
      }

      // 4. Register IP on Story Protocol
      const registration = await this.story.registerIP({
        metadataUri: metadataResult.url,
        title: plan.title,
        description: plan.description
      });

      const receipt = await registration.wait();

      return {
        type: 'success',
        transaction: receipt,
        data: {
          ipId: registration.ipId,
          title: plan.title,
          license: plan.license,
          imageUrl: imageResult.url,
          metadataUrl: metadataResult.url,
          txHash: receipt.hash
        },
        message: `✅ Successfully registered IP "${plan.title}" on Story Protocol!`
      };

    } catch (error) {
      console.error('IP registration error:', error);
      return {
        type: 'error',
        message: `IP registration failed: ${error.message}`,
        error
      };
    }
  }
}
```
