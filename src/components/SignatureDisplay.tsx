import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface SignatureDisplayProps {
  signature: string | null;
}

export const SignatureDisplay = ({ signature }: SignatureDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copySignature = () => {
    if (signature) {
      navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!signature) return null;

  return (
    <div className="p-4 rounded-lg bg-card border border-border fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          ECDSA Signature (v, r, s)
        </span>
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
      <code className="block text-xs font-mono text-primary break-all leading-relaxed">
        {signature}
      </code>
    </div>
  );
};
