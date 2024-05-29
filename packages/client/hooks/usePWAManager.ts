/* eslint-disable @typescript-eslint/no-empty-function */
import { useEffect, useState } from 'react';

import { isWindowAvailable } from '../lib/user-agent.js';

type UpdateAvailable = {
  isUpdateAvailable: boolean;
  newWorker: ServiceWorker | null;
};

export type PWAManager = {
  /**
   * Whether an update is available or not.
   */
  updateAvailable: boolean;
  swUpdate: UpdateAvailable;
  /**
   * An asynchronous function that prompts the user to install the PWA.
   *
   * Takes in an optional callback that runs if the user accepts the install prompt.
   *
   * ## Example
   *
   * ```tsx
   * const { promptInstall } = usePWAManager();
   *
   * return (
   *  <>
   *    <button onClick={promptInstall}>Install PWA</button>
   *    <button onClick={async() => await promptInstall(doSmthg)}>Install PWA with callback</button>
   *  </>
   * );
   * ```
   */
  promptInstall: (cb?: () => void) => void;
  /**
   * Retrieves the current service worker registration.
   *
   * Returns `null` if service worker is not supported/registered.
   */
  swRegistration: ServiceWorkerRegistration | null;
  /**
   * The user's choice on whether to install the PWA or not.
   *
   * Defaults to `null`.
   */
  userInstallChoice: 'accepted' | 'dismissed' | null;
};

export const usePWAManager = (): PWAManager => {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [swUpdate, setSwUpdate] = useState<UpdateAvailable>({
    isUpdateAvailable: false,
    newWorker: null,
  });
  const [installPromptEvent, setInstallPromptEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [userChoice, setUserChoice] = useState<'accepted' | 'dismissed' | null>(null);

  const promptInstall = async (cb: () => void = () => {}) => {
    if (installPromptEvent) {
      (installPromptEvent as any).prompt();

      const { outcome: choice } = await (installPromptEvent as any).userChoice;

      if (choice === 'accepted') {
        cb();
        setUserChoice('accepted');
      } else {
        setUserChoice(choice);
      }

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

  useEffect(() => {
    const updateFalse = { isUpdateAvailable: false, newWorker: null };

    if (!registration) {
      setSwUpdate(updateFalse);
      setUpdateAvailable(false);
      return;
    }

    const update = () => {
      const newWorker = registration.installing;

      if (newWorker) {
        const newSWUpdate = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setSwUpdate({ isUpdateAvailable: true, newWorker });
            setUpdateAvailable(true);
          }
        };

        newWorker.addEventListener('statechange', newSWUpdate);
      }
    };

    registration.addEventListener('updatefound', update);

    return () => {
      registration.removeEventListener('updatefound', update);
      setSwUpdate(updateFalse);
      setUpdateAvailable(false);
    };
  }, [registration]);

  return { updateAvailable, swUpdate, promptInstall, swRegistration: registration, userInstallChoice: userChoice };
};
