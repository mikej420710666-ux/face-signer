import { SUPPORTED_CHAINS, Chain } from "@/lib/chains";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChainSelectorProps {
  selectedChain: Chain;
  onChainChange: (chain: Chain) => void;
}

export const ChainSelector = ({ selectedChain, onChainChange }: ChainSelectorProps) => {
  return (
    <Select
      value={selectedChain.id}
      onValueChange={(id) => {
        const chain = SUPPORTED_CHAINS.find((c) => c.id === id);
        if (chain) onChainChange(chain);
      }}
    >
      <SelectTrigger className="w-full bg-input border-border font-mono">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span 
              className="text-lg" 
              style={{ color: selectedChain.color }}
            >
              {selectedChain.icon}
            </span>
            <span>{selectedChain.name}</span>
            <span className="text-xs text-muted-foreground">
              ({selectedChain.curve === "ed25519" ? "Ed25519" : "ECDSA"})
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {SUPPORTED_CHAINS.map((chain) => (
          <SelectItem 
            key={chain.id} 
            value={chain.id}
            className="font-mono cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span 
                className="text-lg w-6 text-center" 
                style={{ color: chain.color }}
              >
                {chain.icon}
              </span>
              <div className="flex flex-col">
                <span>{chain.name}</span>
                <span className="text-xs text-muted-foreground">
                  {chain.curve === "ed25519" ? "Ed25519" : "secp256k1"} • {chain.symbol}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
