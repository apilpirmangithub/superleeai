export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface SwapQuote {
  amountIn: string;
  amountOut: string;
  routes: any[];
  priceImpact: number;
  gasEstimate: string;
}

export interface IPFSUploadResult {
  cid: string;
  url: string;
  hash?: string;
  size?: number;
  name?: string;
}
```
