import { AgentConfig, ParseResult, ExecutionPlan, ExecutionResult, AgentHelp } from '@/types/agents';

export abstract class BaseAgent {
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  abstract canHandle(prompt: string): boolean;
  abstract parse(prompt: string, image?: File): Promise<ParseResult>;
  abstract execute(plan: ExecutionPlan): Promise<ExecutionResult>;
  abstract getHelp(): AgentHelp;

  getName(): string {
    return this.config.name;
  }

  getPriority(): number {
    return this.config.priority;
  }

  getCapabilities(): string[] {
    return this.config.capabilities;
  }

  getVersion(): string {
    return this.config.version;
  }
}
```
