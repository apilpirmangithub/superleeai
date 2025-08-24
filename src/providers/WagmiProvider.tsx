'use client';

import { ReactNode } from 'react';
import { WagmiProvider as WagmiProviderOriginal } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';
import '@rainbow-me/rainbowkit/styles.css';

// Define Story Chain
const storyChain = defineChain({
  id: parseInt(process.env.NEXT_PUBLIC_STORY_CHAIN_ID || '1315'),
  name: 'Story Network',
  network: 'story',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    public: { http: [process.env.NEXT_PUBLIC_STORY_RPC || 'https://aeneid.storyrpc.io'] },
    default: { http: [process.env.NEXT_PUBLIC_STORY_RPC || 'https://aeneid.storyrpc.io']
```
