'use client';

import { ReactNode } from 'react';
import { WagmiProvider } from './WagmiProvider';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <WagmiProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </WagmiProvider>
    </QueryProvider>
  );
}
```
