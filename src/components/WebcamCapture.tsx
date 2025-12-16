import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, CameraOff, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const WebcamCapture = ({ onCapture, isActive, onActivate }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setHasPermission(false);
      setError(err instanceof Error ? err.message : "Failed to access camera");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Mirror the image for selfie mode
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    onCapture(imageData);
    stopCamera();
  }, [onCapture, stopCamera]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  useEffect(() => {
    if (isActive && !capturedImage) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isActive, startCamera, stopCamera, capturedImage]);

  if (!isActive) {
    return (
      <div 
        className="w-full aspect-square rounded-lg bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={onActivate}
      >
        <Camera className="w-12 h-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Click to activate camera</p>
      </div>
    );
  }

  if (error || hasPermission === false) {
    return (
      <div className="w-full aspect-square rounded-lg bg-destructive/10 border border-destructive/30 flex flex-col items-center justify-center gap-3 p-4">
        <CameraOff className="w-12 h-12 text-destructive" />
        <p className="text-sm text-destructive text-center">
          {error || "Camera access denied"}
        </p>
        <Button variant="outline" size="sm" onClick={startCamera}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-secondary">
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {capturedImage ? (
        <>
          {/* Captured image display */}
          <img 
            src={capturedImage} 
            alt="Captured face" 
            className="w-full h-full object-cover"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 gap-2"
            onClick={retake}
          >
            <RefreshCw className="w-4 h-4" />
            Retake
          </Button>
        </>
      ) : (
        <>
          {/* Live video feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          
          {/* Capture overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Face guide circle */}
            <div className="w-48 h-48 rounded-full border-2 border-primary/50 border-dashed" />
          </div>
          
          {/* Capture button */}
          <Button
            variant="glow"
            size="lg"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full w-16 h-16 p-0"
            onClick={captureFrame}
          >
            <div className="w-12 h-12 rounded-full bg-primary-foreground" />
          </Button>
          
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary" />
          <div className="absolute bottom-20 left-4 w-8 h-8 border-l-2 border-b-2 border-primary" />
          <div className="absolute bottom-20 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />
        </>
      )}
      
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
    </div>
  );
};
