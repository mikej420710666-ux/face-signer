import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletCard } from "@/components/WalletCard";
import { TransactionPanel } from "@/components/TransactionPanel";
import { SignatureDisplay } from "@/components/SignatureDisplay";
import { RegistrationFlow } from "@/components/RegistrationFlow";
import { StatusBar } from "@/components/StatusBar";
import { Fingerprint, PenTool, Terminal } from "lucide-react";

const Index = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [walletAddress, setWalletAddress] = useState("0x0000000000000000000000000000000000000000");
  const [lastSignature, setLastSignature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("register");

  const handleRegister = (address: string) => {
    setWalletAddress(address);
    setIsRegistered(true);
    setTimeout(() => setActiveTab("sign"), 1000);
  };

  const handleSign = (signature: string) => {
    setLastSignature(signature);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Status Bar */}
      <StatusBar isOnline={false} livenessCheck={false} />
      
      {/* Main Content */}
      <div className="container max-w-2xl py-8 px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Fingerprint className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground">ETH Passkey</h1>
              <p className="text-xs text-muted-foreground font-mono">v0.1.0 • MIT License</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Biometric ECDSA signer — turn your face into an Ethereum wallet. 
            No seed phrases. No cloud. Pure local signing.
          </p>
        </header>

        {/* Wallet Card */}
        <div className="mb-8">
          <WalletCard 
            address={walletAddress} 
            balance="0.000"
            isRegistered={isRegistered}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border mb-6">
            <TabsTrigger value="register" className="gap-2 data-[state=active]:bg-primary/10">
              <Fingerprint className="w-4 h-4" />
              Register
            </TabsTrigger>
            <TabsTrigger value="sign" className="gap-2 data-[state=active]:bg-primary/10">
              <PenTool className="w-4 h-4" />
              Sign
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2 data-[state=active]:bg-primary/10">
              <Terminal className="w-4 h-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="mt-0">
            <div className="p-6 rounded-xl bg-card border border-border">
              <RegistrationFlow onRegister={handleRegister} />
            </div>
          </TabsContent>

          <TabsContent value="sign" className="mt-0">
            <div className="p-6 rounded-xl bg-card border border-border">
              <TransactionPanel onSign={handleSign} isRegistered={isRegistered} />
            </div>
            {lastSignature && (
              <div className="mt-4">
                <SignatureDisplay signature={lastSignature} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="mt-0">
            <div className="p-4 rounded-xl bg-card border border-border font-mono text-xs space-y-1 max-h-96 overflow-auto">
              <LogLine timestamp="00:00:01" level="info" message="ETH Passkey v0.1.0 initialized" />
              <LogLine timestamp="00:00:01" level="info" message="ONNX Runtime loaded (CPU backend)" />
              <LogLine timestamp="00:00:02" level="warn" message="Liveness check: DISABLED (stub)" />
              {isRegistered && (
                <>
                  <LogLine timestamp="00:00:15" level="info" message="Face embedding extracted (512-d)" />
                  <LogLine timestamp="00:00:15" level="info" message="PBKDF2 derivation: 100k iterations" />
                  <LogLine timestamp="00:00:16" level="success" message={`Wallet derived: ${walletAddress.slice(0, 10)}...`} />
                </>
              )}
              {lastSignature && (
                <>
                  <LogLine timestamp="00:00:30" level="info" message="Face match: 99.7% confidence" />
                  <LogLine timestamp="00:00:30" level="success" message="ECDSA signature generated" />
                </>
              )}
              <LogLine timestamp="--:--:--" level="muted" message="Waiting for commands..." />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-muted-foreground font-mono space-y-2">
          <p>ethpasskey sign --face selfie.jpg --msg 0x... → hex sig</p>
          <p className="text-primary/60">Designed for Jetson Nano/Orin • Offline-First • ECDSA on secp256k1</p>
        </footer>
      </div>
    </div>
  );
};

const LogLine = ({ 
  timestamp, 
  level, 
  message 
}: { 
  timestamp: string; 
  level: "info" | "warn" | "error" | "success" | "muted"; 
  message: string;
}) => {
  const colors = {
    info: "text-primary",
    warn: "text-warning",
    error: "text-destructive",
    success: "text-terminal",
    muted: "text-muted-foreground",
  };

  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground">[{timestamp}]</span>
      <span className={colors[level]}>{level.toUpperCase().padEnd(7)}</span>
      <span className="text-foreground">{message}</span>
    </div>
  );
};

export default Index;
