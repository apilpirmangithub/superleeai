'use client';

import { useState } from 'react';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { ChatInput } from '@/components/chat/ChatInput';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { useAgent } from '@/hooks/useAgent';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const {
    messages,
    loading,
    pendingPlan,
    submitPrompt,
    confirmPlan,
    cancelPlan
  } = useAgent();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Card */}
      <Card className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to SuperLeeAgent 🤖
        </h1>
        <p className="text-muted-foreground">
          AI-powered assistant for Story Chain. Swap tokens or register IP using natural language.
        </p>
      </Card>

      {/* Chat Interface */}
      <div className="space-y-4">
        <ChatHistory messages={messages} loading={loading} />
        <ChatInput onSubmit={submitPrompt} disabled={loading} />
      </div>

      {/* Confirmation Modal */}
      {pendingPlan && (
        <ConfirmationModal
          plan={pendingPlan.plan}
          agent={pendingPlan.agent}
          onConfirm={confirmPlan}
          onCancel={cancelPlan}
        />
      )}

      {/* Examples Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Example Commands:</h3>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div>💱 <code>Swap 1 WIP &gt; USDC slippage 0.5%</code></div>
          <div>🌐 <code>tukar 0.25 ip ke usdc slip 1%</code></div>
          <div>📋 <code>Register this image IP, title "Sunset" by-nc</code></div>
          <div>🎨 <code>daftar gambar ini sebagai IP dengan judul "Mountains"</code></div>
        </div>
      </Card>
    </div>
  );
}
```
