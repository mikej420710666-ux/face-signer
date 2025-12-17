// FaceGate Supported Chains Configuration

export interface Chain {
  id: string;
  name: string;
  shortName: string;
  symbol: string;
  color: string;
  icon: string;
  explorer: string;
  curve: "secp256k1" | "ed25519";
}

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    shortName: "ETH",
    symbol: "ETH",
    color: "hsl(227, 50%, 59%)",
    icon: "◇",
    explorer: "https://etherscan.io",
    curve: "secp256k1",
  },
  {
    id: "base",
    name: "Base",
    shortName: "BASE",
    symbol: "ETH",
    color: "hsl(220, 100%, 55%)",
    icon: "◈",
    explorer: "https://basescan.org",
    curve: "secp256k1",
  },
  {
    id: "polygon",
    name: "Polygon",
    shortName: "MATIC",
    symbol: "MATIC",
    color: "hsl(270, 75%, 55%)",
    icon: "⬡",
    explorer: "https://polygonscan.com",
    curve: "secp256k1",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    shortName: "ARB",
    symbol: "ETH",
    color: "hsl(205, 90%, 55%)",
    icon: "⟐",
    explorer: "https://arbiscan.io",
    curve: "secp256k1",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    shortName: "AVAX",
    symbol: "AVAX",
    color: "hsl(0, 80%, 55%)",
    icon: "◬",
    explorer: "https://snowtrace.io",
    curve: "secp256k1",
  },
  {
    id: "solana",
    name: "Solana",
    shortName: "SOL",
    symbol: "SOL",
    color: "hsl(280, 100%, 65%)",
    icon: "◎",
    explorer: "https://solscan.io",
    curve: "ed25519",
  },
];

export const getChainById = (id: string): Chain | undefined => {
  return SUPPORTED_CHAINS.find((chain) => chain.id === id);
};

export const generateMockAddress = (chain: Chain): string => {
  if (chain.curve === "ed25519") {
    // Solana-style base58 address
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    return Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }
  // EVM-style hex address
  return `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
};

export const generateMockSignature = (chain: Chain): string => {
  if (chain.curve === "ed25519") {
    // Ed25519 signature (64 bytes)
    return Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  }
  // ECDSA signature (65 bytes with recovery id)
  return `0x${Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
};
