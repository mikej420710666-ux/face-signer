import { useState } from "react";
import { Button } from "./ui/button";
import { FaceScanner } from "./FaceScanner";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TransactionPanelProps {
  onSign: (signature: string) => void;
  isRegistered: boolean;
}

export const TransactionPanel = ({ onSign, isRegistered }: TransactionPanelProps) => {
  const [message, setMessage] = useState("0x7472616e73616374696f6e");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");

  const handleSign = () => {
    if (!isRegistered) {
      toast({
        title: "Not Registered",
        description: "Please register your face first",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    setScanStatus("scanning");
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    setScanStatus("success");
    
    // Mock signature generation
    const mockSignature = `0x${Array.from({ length: 130 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;
    
    setTimeout(() => {
      onSign(mockSignature);
      toast({
        title: "Transaction Signed",
        description: "Signature generated successfully",
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Message Input */}
      <div>
        <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
          Message to Sign
        </label>
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder="0x..."
          />
          <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-r from-primary/5 to-transparent" />
        </div>
      </div>

      {/* Scanner */}
      <div className="py-8">
        <FaceScanner 
          isScanning={isScanning} 
          onScanComplete={handleScanComplete}
          status={scanStatus}
        />
      </div>

      {/* Sign Button */}
      <Button 
        variant="glow" 
        size="xl" 
        className="w-full group"
        onClick={handleSign}
        disabled={isScanning || !message}
      >
        <Shield className="w-5 h-5" />
        {isScanning ? "Authenticating..." : "Sign with Face ID"}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>

      {/* Info badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-warning" />
          <span>&lt;1s signing</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-terminal" />
          <span>Offline-first</span>
        </div>
      </div>
    </div>
  );
};
