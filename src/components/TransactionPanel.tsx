import { useState } from "react";
import { Button } from "./ui/button";
import { FaceScanner } from "./FaceScanner";
import { WebcamCapture } from "./WebcamCapture";
import { ArrowRight, Shield, Zap, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TransactionPanelProps {
  onSign: (signature: string) => void;
  isRegistered: boolean;
  registeredFace?: string | null;
}

export const TransactionPanel = ({ onSign, isRegistered, registeredFace }: TransactionPanelProps) => {
  const [message, setMessage] = useState("0x7472616e73616374696f6e");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedForAuth, setCapturedForAuth] = useState<string | null>(null);

  const handleCaptureForAuth = (imageData: string) => {
    setCapturedForAuth(imageData);
    setShowCamera(false);
    
    // Start verification
    setIsScanning(true);
    setScanStatus("scanning");
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    
    // Simulate face matching (always succeeds in demo)
    const matchSuccess = Math.random() > 0.1; // 90% success rate for demo
    
    if (matchSuccess) {
      setScanStatus("success");
      
      // Mock signature generation
      const mockSignature = `0x${Array.from({ length: 130 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`;
      
      setTimeout(() => {
        onSign(mockSignature);
        toast({
          title: "Transaction Signed",
          description: "Face verified. Signature generated successfully.",
        });
        setCapturedForAuth(null);
        setScanStatus("idle");
      }, 500);
    } else {
      setScanStatus("error");
      toast({
        title: "Verification Failed",
        description: "Face did not match. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => {
        setCapturedForAuth(null);
        setScanStatus("idle");
      }, 2000);
    }
  };

  const handleSign = () => {
    if (!isRegistered) {
      toast({
        title: "Not Registered",
        description: "Please register your face first",
        variant: "destructive",
      });
      return;
    }
    
    if (!message) {
      toast({
        title: "No Message",
        description: "Please enter a message to sign",
        variant: "destructive",
      });
      return;
    }
    
    setShowCamera(true);
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

      {/* Camera or Scanner */}
      <div className="py-4">
        {showCamera ? (
          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Verify your identity to sign
            </p>
            <WebcamCapture
              isActive={true}
              onActivate={() => {}}
              onCapture={handleCaptureForAuth}
            />
          </div>
        ) : capturedForAuth || isScanning ? (
          <FaceScanner 
            isScanning={isScanning} 
            onScanComplete={handleScanComplete}
            status={scanStatus}
            capturedImage={capturedForAuth}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            {registeredFace ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/50">
                  <img src={registeredFace} alt="Registered" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-terminal flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                <Camera className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <p className="text-xs text-muted-foreground font-mono">
              {isRegistered ? "Ready to authenticate" : "Face not registered"}
            </p>
          </div>
        )}
      </div>

      {/* Sign Button */}
      {!showCamera && !isScanning && (
        <Button 
          variant="glow" 
          size="xl" 
          className="w-full group"
          onClick={handleSign}
          disabled={isScanning || !message}
        >
          <Shield className="w-5 h-5" />
          Sign with Face ID
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      )}

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
