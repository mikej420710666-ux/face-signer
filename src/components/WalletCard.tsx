import { Copy, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { Chain } from "@/lib/chains";

interface WalletCardProps {
  address: string;
  balance?: string;
  isRegistered: boolean;
  chain: Chain;
}

export const WalletCard = ({ address, balance = "0.000", isRegistered, chain }: WalletCardProps) => {
  const truncateAddress = (addr: string) => {
    if (chain.curve === "ed25519") {
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const openExplorer = () => {
    const url = chain.curve === "ed25519" 
      ? `${chain.explorer}/account/${address}`
      : `${chain.explorer}/address/${address}`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative p-6 rounded-xl bg-card border border-border glow-border overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-10"
        style={{ background: `linear-gradient(135deg, ${chain.color}, transparent)` }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRegistered ? "bg-terminal" : "bg-warning"} animate-pulse`} />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {isRegistered ? "Registered" : "Unregistered"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg" style={{ color: chain.color }}>{chain.icon}</span>
            <span className="text-xs font-mono" style={{ color: chain.color }}>
              {chain.shortName}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
          <div className="flex items-center gap-2">
            <code className="text-lg font-mono text-foreground glow-text">
              {truncateAddress(address)}
            </code>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={openExplorer}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className="text-3xl font-bold text-foreground">
              {balance} <span className="text-lg" style={{ color: chain.color }}>{chain.symbol}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Curve</p>
            <p className="text-sm font-mono" style={{ color: chain.color }}>
              {chain.curve === "ed25519" ? "Ed25519" : "secp256k1"}
            </p>
          </div>
        </div>

        {/* Decorative line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 opacity-50"
          style={{ background: `linear-gradient(90deg, transparent, ${chain.color}, transparent)` }}
        />
      </div>
    </div>
  );
};
