/// <reference lib="WebWorker" />

interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
  __WB_MANIFEST: Array<{
    revision: string | null;
    url: string;
  }>;
  
  // Add any other custom properties or methods here
  myCustomFunction(): void;
}

// Add custom modules here (they will be implicitly typed)
declare module 'virtual:pwa-register/helper' {
  function registerSW(options?: {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration) => void;
    onRegisterError?: (error: any) => void;
  }): (reloadPage?: boolean) => Promise<void>;
}

// You can add more custom module declarations as needed