import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Chain } from "@/lib/chains";

interface SignatureDisplayProps {
  signature: string | null;
  chain?: Chain;
}

export const SignatureDisplay = ({ signature, chain }: SignatureDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copySignature = () => {
    if (signature) {
      navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!signature) return null;

  const sigType = chain?.curve === "ed25519" ? "Ed25519 Signature" : "ECDSA Signature (v, r, s)";

  return (
    <div className="p-4 rounded-lg bg-card border border-border fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {chain && (
            <span style={{ color: chain.color }}>{chain.icon}</span>
          )}
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {sigType}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={copySignature} className="h-7 gap-1">
          {copied ? (
            <>
              <Check className="w-3 h-3 text-terminal" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </Button>
      </div>
      <code 
        className="block text-xs font-mono break-all leading-relaxed"
        style={{ color: chain?.color || "hsl(var(--primary))" }}
      >
        {signature}
      </code>
    </div>
  );
};
