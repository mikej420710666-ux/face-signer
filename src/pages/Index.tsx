import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletCard } from "@/components/WalletCard";
import { TransactionPanel } from "@/components/TransactionPanel";
import { SignatureDisplay } from "@/components/SignatureDisplay";
import { RegistrationFlow } from "@/components/RegistrationFlow";
import { StatusBar } from "@/components/StatusBar";
import { ChainSelector } from "@/components/ChainSelector";
import { SUPPORTED_CHAINS, Chain, generateMockAddress, generateMockSignature } from "@/lib/chains";
import { Fingerprint, PenTool, Terminal, Layers } from "lucide-react";

const Index = () => {
  const [selectedChain, setSelectedChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [walletAddress, setWalletAddress] = useState("0x0000000000000000000000000000000000000000");
  const [lastSignature, setLastSignature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("register");
  const [registeredFace, setRegisteredFace] = useState<string | null>(null);
  const [logs, setLogs] = useState<Array<{ timestamp: string; level: string; message: string }>>([
    { timestamp: "00:00:01", level: "info", message: "FaceGate v0.2.0 initialized" },
    { timestamp: "00:00:01", level: "info", message: "Multi-chain support: ETH, BASE, SOL, MATIC, ARB, AVAX" },
    { timestamp: "00:00:02", level: "warn", message: "Liveness check: DISABLED (stub)" },
  ]);

  const addLog = (level: string, message: string) => {
    const now = new Date();
    const timestamp = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')}`;
    setLogs(prev => [...prev, { timestamp, level, message }]);
  };

  const handleChainChange = (chain: Chain) => {
    setSelectedChain(chain);
    addLog("info", `Switched to ${chain.name} (${chain.curve})`);
    
    // Regenerate address for new chain if registered
    if (isRegistered) {
      const newAddress = generateMockAddress(chain);
      setWalletAddress(newAddress);
      addLog("info", `Derived ${chain.shortName} address: ${newAddress.slice(0, 10)}...`);
    }
  };

  const handleRegister = (address: string) => {
    const chainAddress = generateMockAddress(selectedChain);
    setWalletAddress(chainAddress);
    setIsRegistered(true);
    addLog("info", "Face embedding extracted (512-d)");
    addLog("info", `Key derivation: ${selectedChain.curve === "ed25519" ? "Ed25519" : "PBKDF2 → secp256k1"}`);
    addLog("success", `${selectedChain.name} wallet derived: ${chainAddress.slice(0, 10)}...`);
    setTimeout(() => setActiveTab("sign"), 1000);
  };

  const handleFaceCapture = (imageData: string) => {
    setRegisteredFace(imageData);
    addLog("info", "Face captured from webcam");
    addLog("info", "Image dimensions: 640x480");
  };

  const handleSign = (signature: string) => {
    const chainSig = generateMockSignature(selectedChain);
    setLastSignature(chainSig);
    addLog("info", "Face match: 99.7% confidence");
    addLog("success", `${selectedChain.curve === "ed25519" ? "Ed25519" : "ECDSA"} signature generated`);
    addLog("info", `Sig: ${chainSig.slice(0, 20)}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Status Bar */}
      <StatusBar isOnline={false} livenessCheck={false} chain={selectedChain} />
      
      {/* Main Content */}
      <div className="container max-w-2xl py-8 px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Fingerprint className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground">FaceGate</h1>
              <p className="text-xs text-muted-foreground font-mono">v0.2.0 • Multi-Chain • MIT</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Universal biometric signer — turn your face into a wallet for any chain. 
            No seed phrases. No cloud. Pure local signing.
          </p>
        </header>

        {/* Chain Selector */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
            <Layers className="w-3 h-3 inline mr-1" />
            Select Chain
          </label>
          <ChainSelector selectedChain={selectedChain} onChainChange={handleChainChange} />
        </div>

        {/* Wallet Card */}
        <div className="mb-8">
          <WalletCard 
            address={walletAddress} 
            balance="0.000"
            isRegistered={isRegistered}
            chain={selectedChain}
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
              <RegistrationFlow 
                onRegister={handleRegister}
                chain={selectedChain}
              />
            </div>
          </TabsContent>

          <TabsContent value="sign" className="mt-0">
            <div className="p-6 rounded-xl bg-card border border-border">
              <TransactionPanel 
                onSign={handleSign} 
                isRegistered={isRegistered}
                registeredFace={registeredFace}
                chain={selectedChain}
              />
            </div>
            {lastSignature && (
              <div className="mt-4">
                <SignatureDisplay signature={lastSignature} chain={selectedChain} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="mt-0">
            <div className="p-4 rounded-xl bg-card border border-border font-mono text-xs space-y-1 max-h-96 overflow-auto">
              {logs.map((log, i) => (
                <LogLine key={i} timestamp={log.timestamp} level={log.level as any} message={log.message} />
              ))}
              <LogLine timestamp="--:--:--" level="muted" message="Waiting for commands..." />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-muted-foreground font-mono space-y-2">
          <p>facegate sign --chain {selectedChain.id} --face selfie.jpg --msg 0x...</p>
          <p className="text-primary/60">
            Multi-Chain: ETH • BASE • SOL • MATIC • ARB • AVAX
          </p>
          <p className="text-muted-foreground/50">
            Offline-First • ECDSA (secp256k1) • Ed25519
          </p>
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
