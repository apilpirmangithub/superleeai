const TOKEN_ADDRESSES = {
  WIP: process.env.NEXT_PUBLIC_PIPERX_WIP || '0x1514000000000000000000000000000000000000',
  USDC: process.env.NEXT_PUBLIC_TOKEN_USDC || '',
  WETH: process.env.NEXT_PUBLIC_TOKEN_WETH || '',
};

const TOKEN_ALIASES = {
  'ip': 'WIP',
  'wip': 'WIP',
  'usdc': 'USDC',
  'weth': 'WETH',
  'eth': 'WETH'
};

export function getTokenAddress(symbol: string): string | null {
  // If it's already an address
  if (symbol.startsWith('0x') && symbol.length === 42) {
    return symbol;
  }

  const upperSymbol = symbol.toUpperCase();
  const aliasSymbol = TOKEN_ALIASES[symbol.toLowerCase()];
  
  const finalSymbol = aliasSymbol || upperSymbol;
  return TOKEN_ADDRESSES[finalSymbol] || null;
}

export function getTokenSymbol(address: string): string {
  const entries = Object.entries(TOKEN_ADDRESSES);
  const found = entries.find(([_, addr]) => addr.toLowerCase() === address.toLowerCase());
  return found ? found[0] : address.slice(0, 8) + '...';
}
```

## src/lib/abi/erc20.ts
```ts
export const erc20Abi = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
```
