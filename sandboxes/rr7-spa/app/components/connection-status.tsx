import { WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useNetworkConnectivity } from "@remix-pwa/client";

export default function ConnectionStatus() {
  const isOnline = useNetworkConnectivity();

  if (isOnline) return null;

  return (
    <Alert variant="destructive" className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  );
}
