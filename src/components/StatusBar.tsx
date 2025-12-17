import { Wifi, WifiOff, Shield, Cpu } from "lucide-react";
import { Chain } from "@/lib/chains";

interface StatusBarProps {
  isOnline?: boolean;
  livenessCheck?: boolean;
  chain?: Chain;
}

export const StatusBar = ({ isOnline = false, livenessCheck = false, chain }: StatusBarProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card/50 border-b border-border text-xs font-mono">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <Wifi className="w-3 h-3 text-terminal" />
          ) : (
            <WifiOff className="w-3 h-3 text-muted-foreground" />
          )}
          <span className={isOnline ? "text-terminal" : "text-muted-foreground"}>
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Shield className={`w-3 h-3 ${livenessCheck ? "text-terminal" : "text-muted-foreground"}`} />
          <span className={livenessCheck ? "text-terminal" : "text-muted-foreground"}>
            LIVENESS: {livenessCheck ? "ON" : "OFF"}
          </span>
        </div>

        {chain && (
          <div className="flex items-center gap-1.5">
            <span style={{ color: chain.color }}>{chain.icon}</span>
            <span style={{ color: chain.color }}>{chain.shortName}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-1.5 text-primary">
        <Cpu className="w-3 h-3" />
        <span>EDGE DEVICE</span>
      </div>
    </div>
  );
};
