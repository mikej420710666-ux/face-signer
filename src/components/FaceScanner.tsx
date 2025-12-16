import { useState, useEffect } from "react";
import { Scan, CheckCircle2, AlertCircle } from "lucide-react";

interface FaceScannerProps {
  isScanning: boolean;
  onScanComplete?: () => void;
  status?: "idle" | "scanning" | "success" | "error";
  capturedImage?: string | null;
}

export const FaceScanner = ({ 
  isScanning, 
  onScanComplete, 
  status = "idle",
  capturedImage 
}: FaceScannerProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onScanComplete?.();
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [isScanning, onScanComplete]);

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Outer ring */}
      <div className={`absolute inset-0 rounded-full border-2 transition-colors duration-300 ${
        status === "success" ? "border-terminal" : 
        status === "error" ? "border-destructive" : 
        "border-primary/50"
      }`} />
      
      {/* Animated scanning ring */}
      {isScanning && (
        <div className="absolute inset-2 rounded-full border-2 border-primary pulse-ring" />
      )}
      
      {/* Inner circle with gradient or captured image */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary to-muted overflow-hidden">
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Face" 
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {/* Grid pattern */}
            <div className="absolute inset-0 grid-bg opacity-50" />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              {status === "success" ? (
                <CheckCircle2 className="w-16 h-16 text-terminal fade-in" />
              ) : status === "error" ? (
                <AlertCircle className="w-16 h-16 text-destructive fade-in" />
              ) : (
                <Scan className={`w-16 h-16 ${isScanning ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
              )}
            </div>
          </>
        )}
        
        {/* Scan line animation */}
        {isScanning && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="scan-line absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-primary to-transparent" />
          </div>
        )}
        
        {/* Success/Error overlay on image */}
        {capturedImage && (status === "success" || status === "error") && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            status === "success" ? "bg-terminal/20" : "bg-destructive/20"
          }`}>
            {status === "success" ? (
              <CheckCircle2 className="w-16 h-16 text-terminal fade-in" />
            ) : (
              <AlertCircle className="w-16 h-16 text-destructive fade-in" />
            )}
          </div>
        )}
        
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines" />
      </div>
      
      {/* Progress indicator */}
      {isScanning && (
        <div className="absolute -bottom-8 left-0 right-0">
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2 font-mono">
            ANALYZING... {progress}%
          </p>
        </div>
      )}
      
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary" />
      <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary" />
    </div>
  );
};
