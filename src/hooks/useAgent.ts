import { useState, useCallback } from 'react';
import { AgentOrchestrator } from '@/agents/core/AgentOrchestrator';
import { ChatMessage, AgentResponse } from '@/types/agents';
import { useAccount } from 'wagmi';

export function useAgent() {
  const [orchestrator] = useState(() => new AgentOrchestrator());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      type: 'assistant',
      content: 'Hi! I\'m SuperLeeAgent 🤖 I can help you swap tokens or register IP on Story Chain. Try commands like "Swap 1 WIP > USDC" or "Register this image IP, title \'My Art\'"',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<AgentResponse | null>(null);
  const { address } = useAccount();

  const submitPrompt = useCallback(async (prompt: string, image?: File) => {
    if (!prompt.trim()) return;

    setLoading(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: prompt,
      image,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await orchestrator.processPrompt(prompt, image);
      
      if (response.type === 'plan') {
        setPendingPlan(response);
      } else {
        const botMessage: ChatMessage = {
          id: Date.now() + 1,
          type: response.type === 'error' ? 'error' : 'assistant',
          content: response.message,
          timestamp: new Date(),
          agent: response.agent
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Unexpected error: ${error.message}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [orchestrator]);

  const confirmPlan = useCallback(async () => {
    if (!pendingPlan?.execute) return;
    
    setLoading(true);
    
    try {
      const result = await pendingPlan.execute();
      
      const resultMessage: ChatMessage = {
        id: Date.now(),
        type: result.type === 'success' ? 'success' : 'error',
        content: result.message,
        timestamp: new Date(),
        data: result.data
      };
      
      setMessages(prev => [...prev, resultMessage]);
      
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now(),
        type: 'error',
        content: `Execution failed: ${error.message}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setPendingPlan(null);
      setLoading(false);
    }
  }, [pendingPlan]);

  const cancelPlan = useCallback(() => {
    setPendingPlan(null);
  }, []);

  return {
    messages,
    loading,
    pendingPlan,
    submitPrompt,
    confirmPlan,
    cancelPlan,
    connected: !!address
  };
}
```
