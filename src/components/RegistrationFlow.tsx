import { useState } from "react";
import { Button } from "./ui/button";
import { FaceScanner } from "./FaceScanner";
import { WebcamCapture } from "./WebcamCapture";
import { UserPlus, Check, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RegistrationFlowProps {
  onRegister: (address: string) => void;
}

export const RegistrationFlow = ({ onRegister }: RegistrationFlowProps) => {
  const [step, setStep] = useState<"intro" | "capture" | "processing" | "complete">("intro");
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    toast({
      title: "Face Captured",
      description: "Processing biometric data...",
    });
  };

  const startProcessing = () => {
    if (!capturedImage) {
      toast({
        title: "No face captured",
        description: "Please capture your face first",
        variant: "destructive",
      });
      return;
    }
    
    setStep("processing");
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    
    // Simulate key derivation
    setTimeout(() => {
      const mockAddress = `0x${Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`;
      
      setStep("complete");
      onRegister(mockAddress);
      toast({
        title: "Registration Complete",
        description: "Your face has been registered and wallet derived",
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      {step === "intro" && (
        <div className="text-center space-y-6 fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <UserPlus className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Register Your Identity</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Your face becomes your private key. No seed phrases, no cloud storage. 
              Everything stays on your device.
            </p>
          </div>
          
          {/* Warning box */}
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 text-left">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning mb-1">Real Camera Capture</p>
                <p className="text-muted-foreground">
                  This demo uses your actual webcam. Key derivation is simulated, 
                  but face capture is real.
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="glow" 
            size="lg" 
            onClick={() => setStep("capture")} 
            className="gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Start Registration
          </Button>
        </div>
      )}

      {step === "capture" && (
        <div className="space-y-6 fade-in">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-1">Capture Your Face</h3>
            <p className="text-sm text-muted-foreground">
              Position your face in the frame and click capture
            </p>
          </div>
          
          <WebcamCapture
            isActive={cameraActive}
            onActivate={() => setCameraActive(true)}
            onCapture={handleCapture}
          />
          
          {capturedImage && (
            <Button 
              variant="glow" 
              size="lg" 
              onClick={startProcessing}
              className="w-full gap-2"
            >
              Process Face Data
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground text-center font-mono">
            512-d embedding extraction via InsightFace (simulated)
          </p>
        </div>
      )}

      {step === "processing" && (
        <div className="text-center space-y-6 fade-in">
          <FaceScanner 
            isScanning={isScanning} 
            onScanComplete={handleScanComplete}
            status={isScanning ? "scanning" : "success"}
            capturedImage={capturedImage}
          />
          
          <div className="pt-8">
            <h3 className="text-lg font-semibold mb-2">
              {isScanning ? "Processing Biometrics..." : "Deriving Keys..."}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">
              {isScanning 
                ? "Extracting 512-d face embedding" 
                : "PBKDF2 → secp256k1 private key"}
            </p>
          </div>
        </div>
      )}

      {step === "complete" && (
        <div className="text-center space-y-6 fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-terminal/20 flex items-center justify-center">
            <Check className="w-10 h-10 text-terminal" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-terminal mb-2">Registration Complete</h3>
            <p className="text-sm text-muted-foreground">
              Your wallet is now linked to your biometric identity
            </p>
          </div>
          
          {capturedImage && (
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-terminal">
              <img src={capturedImage} alt="Registered face" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
