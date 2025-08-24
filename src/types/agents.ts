export interface AgentConfig {
  name: string;
  version: string;
  capabilities: string[];
  priority: number;
}

export interface ParseResult {
  type: 'complete' | 'incomplete';
  plan?: ExecutionPlan;
  question?: string;
}

export interface ExecutionPlan {
  type: 'swap' | 'register';
  description: string;
  [key: string]: any;
}

export interface SwapPlan extends ExecutionPlan {
  type: 'swap';
  amount: number;
  tokenIn: string;
  tokenOut: string;
  slippage: number;
}

export interface RegisterPlan extends ExecutionPlan {
  type: 'register';
  title: string;
  license: string;
  description: string;
  image: File;
  metadata: {
    creator: string;
    created: string;
    aiPrompt: string;
  };
}

export interface ExecutionResult {
  type: 'success' | 'error';
  message: string;
  transaction?: any;
  data?: any;
  error?: any;
}

export interface AgentResponse {
  type: 'plan' | 'ask' | 'error';
  message: string;
  agent?: string;
  plan?: ExecutionPlan;
  execute?: () => Promise<ExecutionResult>;
  suggestions?: AgentHelp[];
}

export interface AgentHelp {
  agent: string;
  description: string;
  examples: string[];
  parameters: string[];
}

export interface ChatMessage {
  id: number;
  type: 'user' | 'assistant' | 'error' | 'success';
  content: string;
  timestamp: Date;
  image?: File;
  agent?: string;
  data?: any;
}
```
