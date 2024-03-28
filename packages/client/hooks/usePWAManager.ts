import { useEffect, useState } from 'react';

import { isWindowAvailable } from '../lib/user-agent';

export const usePWAManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [userChoice, setUserChoice] = useState<'accepted' | 'dismissed' | null>(null);

  const promptInstall = () => {
    if (installPromptEvent) {
      (installPromptEvent as any).prompt();
      setInstallPromptEvent(null);
    }
  };

  useEffect(() => {
    if (!isWindowAvailable()) return;

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };

    const handleAppInstallChoice = (choice: 'accepted' | 'dismissed') => {
      setUserChoice(choice);
    };

    const getRegistration = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const _registration = await navigator.serviceWorker.getRegistration();
          setRegistration(_registration ?? null);
        } catch (err) {
          console.error('Error getting service worker registration:', err);
        }
      } else {
        console.warn('Service Workers are not supported in this browser.');
      }
    };

    const handleControllerChange = () => {
      setUpdateAvailable(true);
      getRegistration();
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', () => handleAppInstallChoice('accepted'));

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    }

    getRegistration();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', () => handleAppInstallChoice('accepted'));

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, []);

  return { updateAvailable, promptInstall, swRegistration: registration, userInstallChoice: userChoice };
};
